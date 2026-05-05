const express = require('express');
const {
  createItinerary,
  generateAIItinerary,
  getUserItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  addDayToItinerary,
  updateDay
} = require('../controllers/itineraryController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, createItinerary);
router.post('/ai-generate', authMiddleware, generateAIItinerary);
router.get('/my-itineraries', authMiddleware, getUserItineraries);
router.get('/:id', authMiddleware, getItineraryById);
router.put('/:id', authMiddleware, updateItinerary);
router.delete('/:id', authMiddleware, deleteItinerary);
router.post('/:id/days', authMiddleware, addDayToItinerary);
router.put('/:id/days', authMiddleware, updateDay);

module.exports = router;
