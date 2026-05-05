const { Payment, Booking } = require('../models');

const processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, paymentDetails } = req.body;

    if (global.USE_LOCAL_DB) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const booking = await global.localDB.bookings.findById(bookingId);
      
      const paymentRecord = await global.localDB.payments.create({
        paymentId: `PAY${Date.now()}`,
        transactionId: `TXN${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
        user: req.user.id,
        booking: bookingId,
        amount: booking ? booking.totalAmount : 1200,
        paymentMethod,
        status: 'completed',
        paidAt: new Date().toISOString()
      });

      if (booking) {
        await global.localDB.bookings.findByIdAndUpdate(bookingId, {
          $set: {
            paymentStatus: 'paid',
            status: 'confirmed',
            confirmationCode: `CFM${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          }
        });
      }

      return res.json({
        message: 'Payment processed successfully',
        payment: paymentRecord,
        booking: {
          bookingId: booking ? booking.bookingId : `BK${Date.now()}`,
          confirmationCode: `CFM${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          status: 'confirmed'
        }
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Payment already completed for this booking' });
    }

    const paymentId = `PAY${Date.now()}`;
    const transactionId = `TXN${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

    await new Promise(resolve => setTimeout(resolve, 1500));

    const payment = new Payment({
      paymentId,
      user: req.user.id,
      booking: bookingId,
      amount: booking.totalAmount,
      currency: booking.currency,
      paymentMethod,
      paymentDetails: {
        ...paymentDetails,
        cardNumber: paymentDetails.cardNumber ? `****${paymentDetails.cardNumber.slice(-4)}` : undefined
      },
      status: 'completed',
      transactionId,
      gatewayResponse: {
        success: true,
        message: 'Payment processed successfully',
        timestamp: new Date()
      },
      paidAt: new Date()
    });

    await payment.save();

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.confirmationCode = `CFM${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    await booking.save();

    res.json({
      message: 'Payment processed successfully',
      payment: {
        paymentId: payment.paymentId,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status,
        paidAt: payment.paidAt
      },
      booking: {
        bookingId: booking.bookingId,
        confirmationCode: booking.confirmationCode,
        status: booking.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const payments = await Payment.find({ user: req.user.id })
      .populate('booking', 'bookingId destination bookingType')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Payment.countDocuments({ user: req.user.id });

    res.json({
      payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('booking');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const processRefund = async (req, res) => {
  try {
    const { paymentId, refundReason } = req.body;

    const payment = await Payment.findOne({
      paymentId,
      user: req.user.id
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot refund incomplete payment' });
    }

    const refundAmount = payment.amount * 0.9;

    payment.status = 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundReason = refundReason;
    payment.refundedAt = new Date();
    await payment.save();

    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.paymentStatus = 'refunded';
      booking.refundAmount = refundAmount;
      await booking.save();
    }

    res.json({
      message: 'Refund processed successfully',
      refund: {
        paymentId: payment.paymentId,
        refundAmount,
        refundedAt: payment.refundedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    if (global.USE_LOCAL_DB) {
      let payments = global.localDB.payments._read();
      if (status) payments = payments.filter(p => p.status === status);
      const total = payments.length;
      const paged = payments.slice((page - 1) * limit, page * limit);
      return res.json({ payments: paged, totalPages: Math.ceil(total / limit), currentPage: Number(page), total });
    }

    const query = {};
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('user', 'firstName lastName email')
      .populate('booking', 'bookingId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Payment.countDocuments(query);

    res.json({
      payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPaymentStats = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const payments = global.localDB.payments._read().filter(p => p.status === 'completed');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const totalRevenue = payments.reduce((s, p) => s + (p.amount || 0), 0);
      const todayRevenue = payments.filter(p => new Date(p.paidAt) >= today).reduce((s, p) => s + (p.amount || 0), 0);
      const monthlyRevenue = payments.filter(p => new Date(p.paidAt) >= startOfMonth).reduce((s, p) => s + (p.amount || 0), 0);
      
      const methods = {};
      payments.forEach(p => {
        const m = p.paymentMethod || 'unknown';
        if (!methods[m]) methods[m] = { count: 0, total: 0 };
        methods[m].count++;
        methods[m].total += (p.amount || 0);
      });

      return res.json({
        stats: {
          totalRevenue, todayRevenue, monthlyRevenue,
          paymentMethods: Object.entries(methods).map(([k, v]) => ({ _id: k, ...v }))
        }
      });
    }

    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const todayRevenue = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          paidAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyRevenue = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          paidAt: { $gte: new Date(new Date().setDate(1)) }
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const paymentMethods = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);

    res.json({
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        paymentMethods
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  processPayment,
  getUserPayments,
  getPaymentById,
  processRefund,
  getAllPayments,
  getPaymentStats
};
