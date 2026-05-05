const express = require('express');
const {
  processPayment,
  getUserPayments,
  getPaymentById,
  processRefund,
  getAllPayments,
  getPaymentStats
} = require('../controllers/paymentController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/process', authMiddleware, processPayment);
router.get('/my-payments', authMiddleware, getUserPayments);
router.get('/stats', authMiddleware, adminMiddleware, getPaymentStats);
router.get('/all', authMiddleware, adminMiddleware, getAllPayments);
router.get('/:id', authMiddleware, getPaymentById);
router.post('/refund', authMiddleware, processRefund);

module.exports = router;
