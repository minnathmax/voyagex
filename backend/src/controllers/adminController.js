const { User, Destination, Booking, Payment, Review, Report } = require('../models');

const getDashboardStats = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const users = global.localDB.users._read().filter(u => u.role === 'user');
      const allDests = global.localDB.destinations._read();
      const bookings = global.localDB.bookings._read();
      const payments = global.localDB.payments._read();
      const reviews = global.localDB.reviews._read();

      return res.json({
        stats: {
          users: {
            total: users.length,
            active: users.filter(u => u.isActive !== false).length,
            blocked: users.filter(u => u.isBlocked).length
          },
          destinations: {
            total: allDests.length,
            active: allDests.filter(d => d.isActive !== false).length
          },
          bookings: {
            total: bookings.length,
            pending: bookings.filter(b => b.status === 'pending').length,
            confirmed: bookings.filter(b => b.status === 'confirmed').length,
            completed: bookings.filter(b => b.status === 'completed').length,
            cancelled: bookings.filter(b => b.status === 'cancelled').length
          },
          revenue: {
            total: payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0),
            monthly: payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0)
          },
          reviews: reviews.length,
          openReports: 0
        },
        recent: {
          users: users.slice(-5).reverse().map(u => ({ _id: u._id, firstName: u.firstName, lastName: u.lastName, email: u.email, createdAt: u.createdAt, isActive: u.isActive })),
          bookings: bookings.slice(-5).reverse()
        },
        popularDestinations: [...allDests].sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0)).slice(0, 5)
      });
    }

    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const blockedUsers = await User.countDocuments({ role: 'user', isBlocked: true });

    const totalDestinations = await Destination.countDocuments();
    const activeDestinations = await Destination.countDocuments({ isActive: true });

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const revenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'completed', paidAt: { $gte: new Date(new Date().setDate(1)) } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalReviews = await Review.countDocuments();
    let openReports = 0;
    try { openReports = await Report.countDocuments({ status: 'open' }); } catch(e) {}

    const recentUsers = await User.find({ role: 'user' }).select('firstName lastName email createdAt isActive').sort({ createdAt: -1 }).limit(5);
    const recentBookings = await Booking.find().populate('user', 'firstName lastName').populate('destination', 'name').sort({ createdAt: -1 }).limit(5);
    const popularDestinations = await Destination.find({ isActive: true }).sort({ visitCount: -1 }).limit(5);

    res.json({
      stats: {
        users: { total: totalUsers, active: activeUsers, blocked: blockedUsers },
        destinations: { total: totalDestinations, active: activeDestinations },
        bookings: { total: totalBookings, pending: pendingBookings, confirmed: confirmedBookings, completed: completedBookings, cancelled: cancelledBookings },
        revenue: { total: revenue[0]?.total || 0, monthly: monthlyRevenue[0]?.total || 0 },
        reviews: totalReviews,
        openReports
      },
      recent: { users: recentUsers, bookings: recentBookings },
      popularDestinations
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    if (global.USE_LOCAL_DB) {
      let users = global.localDB.users._read().filter(u => u.role !== 'admin');
      if (status === 'active') users = users.filter(u => u.isActive !== false);
      if (status === 'blocked') users = users.filter(u => u.isBlocked);
      if (search) {
        const s = search.toLowerCase();
        users = users.filter(u =>
          (u.firstName || '').toLowerCase().includes(s) ||
          (u.lastName || '').toLowerCase().includes(s) ||
          (u.email || '').toLowerCase().includes(s)
        );
      }
      const total = users.length;
      const paged = users.slice((page - 1) * limit, page * limit);
      return res.json({
        users: paged.map(({ password, ...u }) => u),
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        total
      });
    }

    const query = { role: 'user' };
    if (status === 'active') query.isActive = true;
    if (status === 'blocked') query.isBlocked = true;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const count = await User.countDocuments(query);

    res.json({ users, totalPages: Math.ceil(count / limit), currentPage: page, total: count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const user = global.localDB.users._read().find(u => u._id === req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password, ...safeUser } = user;
      const bookings = global.localDB.bookings._read().filter(b => b.user === req.params.id);
      const reviews = global.localDB.reviews._read().filter(r => r.user === req.params.id);
      return res.json({ user: safeUser, bookings, reviews });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userBookings = await Booking.find({ user: user._id }).populate('destination', 'name').sort({ createdAt: -1 });
    const userReviews = await Review.find({ user: user._id }).populate('destination', 'name').sort({ createdAt: -1 });

    res.json({ user, bookings: userBookings, reviews: userReviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const blockUser = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const user = await global.localDB.users.findByIdAndUpdate(req.params.id, {
        $set: { isBlocked: true, isActive: false }
      }, { new: true });
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password, ...safeUser } = user;
      return res.json({ message: 'User blocked successfully', user: safeUser });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true, isActive: false }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User blocked successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const unblockUser = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const user = await global.localDB.users.findByIdAndUpdate(req.params.id, {
        $set: { isBlocked: false, isActive: true }
      }, { new: true });
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password, ...safeUser } = user;
      return res.json({ message: 'User unblocked successfully', user: safeUser });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false, isActive: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User unblocked successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const user = await global.localDB.users.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ message: 'User deleted successfully' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const bookings = global.localDB.bookings._read();
      const users = global.localDB.users._read().filter(u => u.role === 'user');
      const dests = global.localDB.destinations._read();

      // Generate mock analytics from real local data
      const today = new Date().toISOString().split('T')[0];
      return res.json({
        userGrowth: [
          { _id: today, count: users.length }
        ],
        bookingTrends: [
          { _id: today, count: bookings.length, revenue: bookings.reduce((s, b) => s + (b.totalAmount || 0), 0) }
        ],
        revenueByCategory: [
          { _id: 'city', total: Math.floor(bookings.reduce((s, b) => s + (b.totalAmount || 0), 0) * 0.4) },
          { _id: 'beach', total: Math.floor(bookings.reduce((s, b) => s + (b.totalAmount || 0), 0) * 0.3) },
          { _id: 'adventure', total: Math.floor(bookings.reduce((s, b) => s + (b.totalAmount || 0), 0) * 0.2) },
          { _id: 'cultural', total: Math.floor(bookings.reduce((s, b) => s + (b.totalAmount || 0), 0) * 0.1) },
        ],
        topDestinations: dests.sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0)).slice(0, 10).map(d => ({
          _id: d._id, name: d.name, visitCount: d.visitCount, rating: d.rating
        }))
      });
    }

    const { period = 'month' } = req.query;
    let dateFilter = {};
    const now = new Date();

    if (period === 'week') dateFilter = { $gte: new Date(now.setDate(now.getDate() - 7)) };
    else if (period === 'month') dateFilter = { $gte: new Date(now.setDate(1)) };
    else if (period === 'year') dateFilter = { $gte: new Date(now.setMonth(0, 1)) };

    const userGrowth = await User.aggregate([
      { $match: { createdAt: dateFilter, role: 'user' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const bookingTrends = await Booking.aggregate([
      { $match: { createdAt: dateFilter } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { _id: 1 } }
    ]);

    const revenueByCategory = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $lookup: { from: 'destinations', localField: 'destination', foreignField: '_id', as: 'destinationData' } },
      { $unwind: '$destinationData' },
      { $unwind: '$destinationData.category' },
      { $group: { _id: '$destinationData.category', total: { $sum: '$totalAmount' } } }
    ]);

    const topDestinations = await Destination.find().sort({ visitCount: -1 }).limit(10).select('name visitCount rating');

    res.json({ userGrowth, bookingTrends, revenueByCategory, topDestinations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser,
  getAnalytics
};
