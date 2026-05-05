const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStats
} = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getUserBookings);
router.get('/stats', authMiddleware, adminMiddleware, getBookingStats);
router.get('/all', authMiddleware, adminMiddleware, getAllBookings);
router.get('/:id', authMiddleware, getBookingById);
router.put('/:id/cancel', authMiddleware, cancelBooking);
router.put('/:id/status', authMiddleware, adminMiddleware, updateBookingStatus);

module.exports = router;
