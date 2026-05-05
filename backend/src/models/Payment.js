const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'wallet', 'netbanking'],
    required: true
  },
  paymentDetails: {
    upiId: String,
    cardNumber: String,
    cardHolder: String,
    expiryDate: String,
    walletType: String,
    bankName: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  transactionId: String,
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  paidAt: Date,
  refundedAt: Date,
  refundAmount: Number,
  refundReason: String,
  failureReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
