const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/recommendations', authMiddleware, async (req, res) => {
  try {
    // Get destinations from local DB or mock data
    let destinations = [];
    if (global.USE_LOCAL_DB) {
      const all = global.localDB.destinations._read();
      // Pick 6 random destinations as "AI recommendations"
      const shuffled = [...all].sort(() => 0.5 - Math.random());
      destinations = shuffled.slice(0, 6).map(d => ({
        name: d.name,
        country: d.location.country,
        image: d.images?.[0]?.url,
        rating: d.rating?.average || 4.5,
        highlights: d.category || [],
        reason: `Perfect match based on your travel preferences and ${d.bestSeason?.[0] || 'year-round'} season availability.`
      }));
    } else {
      destinations = [
        { name: 'Paris', country: 'France', highlights: ['Culture', 'Romance'], reason: 'Matches your preference for cultural experiences.' },
        { name: 'Tokyo', country: 'Japan', highlights: ['City', 'Food'], reason: 'Great for culinary exploration.' },
        { name: 'Bali', country: 'Indonesia', highlights: ['Beach', 'Relaxation'], reason: 'Perfect for a relaxing getaway.' },
      ];
    }

    res.json({
      recommendations: {
        destinations,
        activities: [
          'City Walking Tours', 'Local Food Tasting', 'Sunset Watching',
          'Museum Visits', 'Adventure Sports', 'Cultural Workshops',
          'Beach Relaxation', 'Mountain Hiking', 'Night Markets',
          'Photography Walks', 'Cooking Classes', 'Spa & Wellness'
        ],
        tips: [
          'Book flights 2-3 months in advance for the best deals.',
          'Always carry a portable charger and universal adapter.',
          'Learn a few basic phrases in the local language.',
          'Try street food — it\'s often the most authentic experience.',
          'Travel insurance is always worth the investment.',
          'Pack light and leave room for souvenirs.'
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
