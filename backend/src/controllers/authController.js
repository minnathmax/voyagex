const { validationResult } = require('express-validator');
const { User } = require('../models');
const { generateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, password, location, preferences } = req.body;

    if (global.USE_LOCAL_DB) {
      const existing = await global.localDB.users.findOne({ email });
      if (existing) return res.status(400).json({ message: 'User already exists with this email' });

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const user = await global.localDB.users.create({
        firstName, lastName, email, phone,
        password: hashed,
        location, preferences,
        role: 'user',
        isActive: true,
        isBlocked: false,
      });

      const token = generateToken(user._id);
      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: user._id, firstName, lastName, email, role: 'user', avatar: null }
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({
      firstName, lastName, email, phone, password, location, preferences, role: 'user'
    });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    if (global.USE_LOCAL_DB) {
      const user = await global.localDB.users.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      await global.localDB.users.findByIdAndUpdate(user._id, { $set: { lastLogin: new Date().toISOString() } });

      const token = generateToken(user._id);
      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences
        }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.isLocked()) {
      return res.status(423).json({ 
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.loginAttempts > 0) {
      await User.updateOne(
        { _id: user._id },
        { $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } }
      );
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    if (global.USE_LOCAL_DB) {
      const user = await global.localDB.users.findOne({ email, role: 'admin' });
      if (!user) return res.status(400).json({ message: 'Invalid admin credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid admin credentials' });

      const token = generateToken(user._id);
      return res.json({
        message: 'Admin login successful',
        token,
        user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: 'admin' }
      });
    }

    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const user = await global.localDB.users.findById(req.user.id);
      if (user) {
        const { password, ...safeUser } = user;
        return res.json({ user: safeUser });
      }
      // Return mock profile for the mock user
      return res.json({ user: { id: req.user.id, firstName: req.user.firstName, lastName: req.user.lastName, email: 'user@voyagex.com', role: req.user.role } });
    }

    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.role;
    delete updates.isActive;
    delete updates.isBlocked;

    if (global.USE_LOCAL_DB) {
      const user = await global.localDB.users.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true });
      if (user) {
        const { password, ...safeUser } = user;
        return res.json({ message: 'Profile updated successfully', user: safeUser });
      }
      return res.json({ message: 'Profile updated successfully', user: { ...req.user, ...updates } });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (global.USE_LOCAL_DB) {
      const user = await global.localDB.users.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      await global.localDB.users.findByIdAndUpdate(req.user.id, { $set: { password: hashed } });
      return res.json({ message: 'Password changed successfully' });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (global.USE_LOCAL_DB) {
      const user = await global.localDB.users.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found with this email' });
      const resetToken = Math.random().toString(36).substring(2, 15);
      await global.localDB.users.findByIdAndUpdate(user._id, { $set: { resetPasswordToken: resetToken } });
      return res.json({ message: 'Password reset token generated', resetToken });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();

    res.json({ 
      message: 'Password reset token generated',
      resetToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (global.USE_LOCAL_DB) {
      const user = await global.localDB.users.findOne({ resetPasswordToken: resetToken });
      if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      await global.localDB.users.findByIdAndUpdate(user._id, { $set: { password: hashed, resetPasswordToken: null } });
      return res.json({ message: 'Password reset successful' });
    }

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
};
