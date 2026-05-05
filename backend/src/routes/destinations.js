const express = require('express');
const {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  getPopularDestinations,
  getFeaturedDestinations,
  getDestinationsByCategory,
  getCategories,
  getCountries
} = require('../controllers/destinationController');
const { authMiddleware, adminMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, getAllDestinations);
router.get('/popular', getPopularDestinations);
router.get('/featured', getFeaturedDestinations);
router.get('/categories', getCategories);
router.get('/countries', getCountries);
router.get('/category/:category', getDestinationsByCategory);
router.get('/:id', getDestinationById);
router.post('/', authMiddleware, adminMiddleware, createDestination);
router.put('/:id', authMiddleware, adminMiddleware, updateDestination);
router.delete('/:id', authMiddleware, adminMiddleware, deleteDestination);

module.exports = router;
