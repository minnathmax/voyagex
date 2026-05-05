const express = require('express');
const {
  createReview,
  getDestinationReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markHelpful,
  getAllReviews,
  adminResponse
} = require('../controllers/reviewController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/my-reviews', authMiddleware, getUserReviews);
router.get('/all', authMiddleware, adminMiddleware, getAllReviews);
router.get('/destination/:destinationId', getDestinationReviews);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);
router.post('/:id/helpful', authMiddleware, markHelpful);
router.post('/:id/admin-response', authMiddleware, adminMiddleware, adminResponse);

module.exports = router;
