const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rating: {
    overall: { type: Number, required: true, min: 1, max: 5 },
    accommodation: { type: Number, min: 1, max: 5 },
    activities: { type: Number, min: 1, max: 5 },
    transport: { type: Number, min: 1, max: 5 },
    valueForMoney: { type: Number, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5 }
  },
  title: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  visitDate: Date,
  travelerType: {
    type: String,
    enum: ['solo', 'couple', 'family', 'friends', 'business']
  },
  images: [{
    url: String,
    caption: String
  }],
  helpful: {
    count: { type: Number, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  adminResponse: {
    response: String,
    respondedAt: Date,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

reviewSchema.index({ destination: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

module.exports = mongoose.model('Review', reviewSchema);
