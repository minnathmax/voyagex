const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['booking', 'payment', 'destination', 'technical', 'other'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  relatedBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  relatedDestination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  attachments: [{
    url: String,
    name: String
  }],
  responses: [{
    from: { type: String, enum: ['user', 'admin'] },
    message: String,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedAt: { type: Date, default: Date.now }
  }],
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolution: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
