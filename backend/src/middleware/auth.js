const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'voyagex-secret-key-2024';

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // If no token and no DB, allow through as mock user (for direct API testing)
      if (global.USE_LOCAL_DB) {
        req.user = { id: 'mock_user_id', role: 'user', firstName: 'Guest', lastName: 'User' };
        return next();
      }
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }

    if (global.USE_LOCAL_DB) {
      // Look up user in local JSON database
      const user = await global.localDB.users.findById(decoded.userId);
      if (!user) {
        req.user = { id: decoded.userId, role: 'user', firstName: 'User', lastName: '' };
        return next();
      }
      if (user.isBlocked) {
        return res.status(403).json({ message: 'Your account has been blocked.' });
      }
      const { password, ...safeUser } = user;
      req.user = { ...safeUser, id: user._id };
      return next();
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const userMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. User privileges required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        if (global.USE_LOCAL_DB) {
          const user = await global.localDB.users.findById(decoded.userId);
          if (user && !user.isBlocked) {
            const { password, ...safeUser } = user;
            req.user = { ...safeUser, id: user._id };
          }
        } else {
          const user = await User.findById(decoded.userId).select('-password');
          if (user && !user.isBlocked) {
            req.user = user;
          }
        }
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
  adminMiddleware,
  userMiddleware,
  optionalAuth
};
