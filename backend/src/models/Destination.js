const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [{
    url: String,
    caption: String
  }],
  category: {
    type: [String],
    enum: ['beach', 'mountain', 'city', 'historical', 'adventure', 'wildlife', 'cultural', 'romantic', 'family', 'solo']
  },
  bestSeason: [{
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter']
  }],
  budgetRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  activities: [{
    name: String,
    description: String,
    price: Number,
    duration: String,
    image: String
  }],
  attractions: [{
    name: String,
    description: String,
    type: String,
    entryFee: Number,
    openingHours: String
  }],
  weather: {
    climate: String,
    bestTimeToVisit: String,
    averageTemperature: {
      summer: Number,
      winter: Number,
      spring: Number,
      autumn: Number
    }
  },
  accommodations: [{
    name: String,
    type: { type: String, enum: ['hotel', 'resort', 'hostel', 'homestay', 'villa'] },
    pricePerNight: Number,
    rating: Number,
    amenities: [String]
  }],
  transport: {
    nearestAirport: String,
    airportDistance: Number,
    localTransport: [String]
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  visitCount: {
    type: Number,
    default: 0
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

destinationSchema.index({ name: 'text', description: 'text', 'location.city': 'text', 'location.country': 'text' });
destinationSchema.index({ category: 1 });
destinationSchema.index({ 'budgetRange.min': 1, 'budgetRange.max': 1 });
destinationSchema.index({ rating: -1 });

module.exports = mongoose.model('Destination', destinationSchema);
