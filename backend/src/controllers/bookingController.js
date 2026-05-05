const { Booking, Destination, Payment } = require('../models');

const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    
    if (global.USE_LOCAL_DB) {
      const dest = await global.localDB.destinations.findById(bookingData.destination);
      const booking = await global.localDB.bookings.create({
        bookingId: `BK${Date.now()}`,
        ...bookingData,
        user: req.user ? req.user.id : 'mock_user_id',
        destination: dest || { _id: bookingData.destination, name: 'Unknown', location: { city: 'Unknown' } },
        status: 'pending',
        paymentStatus: 'unpaid',
      });
      return res.status(201).json({ message: 'Booking created successfully', booking });
    }

    const booking = new Booking({
      ...bookingData,
      bookingId: `BK${Date.now()}`,
      user: req.user.id
    });

    await booking.save();
    await booking.populate('destination');

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    if (global.USE_LOCAL_DB) {
      const query = { user: req.user.id };
      if (status) query.status = status;
      let bookings = await global.localDB.bookings.find(query).sort({ createdAt: -1 });
      bookings = await bookings;
      const total = bookings.length;
      const paged = bookings.slice((page - 1) * limit, page * limit);
      return res.json({
        bookings: paged,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        total
      });
    }

    const query = { user: req.user.id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('destination', 'name location images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const booking = await global.localDB.bookings.findById(req.params.id);
      if (booking) {
        return res.json({ booking });
      }
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('destination');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    if (global.USE_LOCAL_DB) {
      const booking = await global.localDB.bookings.findByIdAndUpdate(req.params.id, {
        $set: { status: 'cancelled', cancellationReason, cancelledAt: new Date().toISOString() }
      }, { new: true });
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      return res.json({ message: 'Booking cancelled successfully', booking });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();
    await booking.save();

    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
      booking.refundAmount = booking.totalAmount * 0.9;
      await booking.save();
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    if (global.USE_LOCAL_DB) {
      const query = {};
      if (status) query.status = status;
      let bookings = await global.localDB.bookings.find(query).sort({ createdAt: -1 });
      bookings = await bookings;
      const total = bookings.length;
      const paged = bookings.slice((page - 1) * limit, page * limit);
      return res.json({
        bookings: paged,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        total
      });
    }

    const query = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('user', 'firstName lastName email')
      .populate('destination', 'name location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (global.USE_LOCAL_DB) {
      const booking = await global.localDB.bookings.findByIdAndUpdate(req.params.id, {
        $set: { status }
      }, { new: true });
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      return res.json({ message: 'Booking status updated', booking });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      message: 'Booking status updated',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBookingStats = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const total = await global.localDB.bookings.countDocuments();
      const pending = await global.localDB.bookings.countDocuments({ status: 'pending' });
      const confirmed = await global.localDB.bookings.countDocuments({ status: 'confirmed' });
      const cancelled = await global.localDB.bookings.countDocuments({ status: 'cancelled' });
      const completed = await global.localDB.bookings.countDocuments({ status: 'completed' });
      return res.json({
        stats: { total, pending, confirmed, cancelled, completed, revenue: 0 }
      });
    }

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      stats: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        completed: completedBookings,
        revenue: revenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStats
};
