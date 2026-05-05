const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const { seedDatabase, createAdminUser } = require('./src/utils/seedData');

const authRoutes = require('./src/routes/auth');
const destinationRoutes = require('./src/routes/destinations');
const bookingRoutes = require('./src/routes/bookings');
const itineraryRoutes = require('./src/routes/itineraries');
const paymentRoutes = require('./src/routes/payments');
const reviewRoutes = require('./src/routes/reviews');
const adminRoutes = require('./src/routes/admin');
const reportRoutes = require('./src/routes/reports');
const aiRoutes = require('./src/routes/ai');

const app = express();

// Render (and most PaaS) sit behind a reverse proxy; required for correct
// client IP detection in express-rate-limit and secure cookies.
app.set('trust proxy', 1);

connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000, // Increased for development testing
  message: 'Too many requests from this IP, please try again later.'
});

app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'VoyageX API is running',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
