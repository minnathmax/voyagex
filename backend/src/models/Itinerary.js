const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  travelers: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 }
  },
  budget: {
    total: Number,
    currency: { type: String, default: 'USD' }
  },
  days: [{
    dayNumber: Number,
    date: Date,
    activities: [{
      time: String,
      title: String,
      description: String,
      type: { type: String, enum: ['sightseeing', 'activity', 'meal', 'transport', 'rest', 'checkin', 'checkout'] },
      location: String,
      duration: String,
      cost: Number,
      bookingRequired: Boolean,
      bookingStatus: { type: String, enum: ['none', 'pending', 'confirmed'], default: 'none' },
      notes: String
    }],
    meals: {
      breakfast: String,
      lunch: String,
      dinner: String
    },
    accommodation: String,
    transport: String,
    estimatedCost: Number
  }],
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiPrompt: String,
  aiResponse: String,
  totalEstimatedCost: {
    accommodation: Number,
    activities: Number,
    transport: Number,
    meals: Number,
    other: Number,
    total: Number
  },
  status: {
    type: String,
    enum: ['draft', 'planned', 'booked', 'completed', 'cancelled'],
    default: 'draft'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
