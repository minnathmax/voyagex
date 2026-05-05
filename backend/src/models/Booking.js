const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
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
  bookingType: {
    type: String,
    enum: ['hotel', 'transport', 'package', 'activity'],
    required: true
  },
  details: {
    hotelName: String,
    roomType: String,
    checkIn: Date,
    checkOut: Date,
    nights: Number,
    transportType: String,
    transportCompany: String,
    departure: Date,
    arrival: Date,
    from: String,
    to: String,
    passengers: Number,
    activityName: String,
    activityDate: Date
  },
  travelers: [{
    name: String,
    age: Number,
    type: { type: String, enum: ['adult', 'child', 'infant'] }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'wallet', 'netbanking'],
    default: null
  },
  cancellationReason: String,
  cancelledAt: Date,
  refundAmount: Number,
  specialRequests: String,
  confirmationCode: String,
  itinerary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary'
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

module.exports = mongoose.model('Booking', bookingSchema);
