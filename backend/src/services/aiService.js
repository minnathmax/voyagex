const generateTravelPlan = async (prompt) => {
  try {
    const { 
      destination, 
      country, 
      duration, 
      startDate, 
      endDate, 
      travelers, 
      budget, 
      preferences,
      activities,
      attractions,
      notes 
    } = prompt;

    const travelStyles = preferences?.length > 0 
      ? preferences.join(', ') 
      : 'balanced mix of sightseeing and relaxation';

    const activitiesList = activities?.map(a => a.name).join(', ') || 'various local activities';
    const attractionsList = attractions?.map(a => a.name).join(', ') || 'popular tourist attractions';

    const aiResponse = {
      destination,
      country,
      duration,
      summary: `A ${duration}-day ${travelStyles} journey through ${destination}, ${country}. This itinerary is designed for ${travelers.adults} adults${travelers.children > 0 ? ` and ${travelers.children} children` : ''}, with a budget of $${budget.total || 'flexible'}.`,
      days: [],
      totalEstimatedCost: {
        accommodation: 0,
        activities: 0,
        transport: 0,
        meals: 0,
        other: 0,
        total: 0
      }
    };

    const dailyBudget = budget?.total ? budget.total / duration : 200;
    const accommodationCost = dailyBudget * 0.4;
    const mealsCost = dailyBudget * 0.25;
    const activitiesCost = dailyBudget * 0.25;
    const transportCost = dailyBudget * 0.1;

    const morningActivities = [
      'Visit local market and enjoy breakfast',
      'Explore historic city center',
      'Take a guided walking tour',
      'Visit famous landmarks',
      'Morning hike with scenic views',
      'Beach sunrise and yoga session',
      'Museum and cultural exploration',
      'Local cooking class',
      'Adventure sports activity',
      'Wildlife safari or nature walk'
    ];

    const afternoonActivities = [
      'Lunch at traditional restaurant',
      'Explore local shops and cafes',
      'Visit popular attractions',
      'Relax at the beach or pool',
      'Take a city bus tour',
      'Boat cruise or water activities',
      'Visit art galleries',
      'Wine tasting experience',
      'Shopping at local markets',
      'Spa and wellness session'
    ];

    const eveningActivities = [
      'Sunset viewing at scenic spot',
      'Dinner at rooftop restaurant',
      'Cultural show or performance',
      'Night market exploration',
      'Sunset cruise',
      'Local entertainment and nightlife',
      'Stargazing or night walk',
      'Bonfire and local music',
      'Fine dining experience',
      'Relaxing evening at hotel'
    ];

    const accommodationTypes = ['Boutique Hotel', 'Resort', 'Guest House', 'Villa', 'Eco Lodge'];
    const transportModes = ['Local Taxi', 'Rental Car', 'Public Transport', 'Walking', 'Tour Bus'];
    const mealSuggestions = [
      'Traditional local breakfast',
      'Street food lunch',
      'Fine dining dinner',
      'Cafe brunch',
      'Beachside seafood',
      'Rooftop dining'
    ];

    const start = new Date(startDate);

    for (let i = 0; i < duration; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + i);
      
      const dayNumber = i + 1;
      const isFirstDay = i === 0;
      const isLastDay = i === duration - 1;

      let dayActivities = [];

      if (isFirstDay) {
        dayActivities = [
          { time: '09:00', title: 'Arrival & Check-in', description: `Arrive at ${destination} and check into your accommodation. Freshen up after your journey.`, type: 'checkin', duration: '2 hours', cost: 0 },
          { time: '11:00', title: 'Welcome Orientation', description: `Get familiar with the area. Take a leisurely walk around your hotel and nearby attractions.`, type: 'sightseeing', duration: '1.5 hours', cost: 0 },
          { time: '13:00', title: 'Lunch', description: 'Enjoy your first meal at a recommended local restaurant.', type: 'meal', duration: '1 hour', cost: Math.round(mealsCost * 0.4) },
          { time: '15:00', title: afternoonActivities[Math.floor(Math.random() * afternoonActivities.length)], description: 'Start exploring the main attractions of the city.', type: 'activity', duration: '2 hours', cost: Math.round(activitiesCost * 0.5) },
          { time: '18:00', title: eveningActivities[Math.floor(Math.random() * eveningActivities.length)], description: 'Experience the evening ambiance of the city.', type: 'activity', duration: '2 hours', cost: Math.round(activitiesCost * 0.3) },
          { time: '20:30', title: 'Dinner', description: 'Enjoy a delicious dinner featuring local cuisine.', type: 'meal', duration: '1.5 hours', cost: Math.round(mealsCost * 0.6) }
        ];
      } else if (isLastDay) {
        dayActivities = [
          { time: '08:00', title: 'Breakfast', description: 'Enjoy a hearty breakfast before departure.', type: 'meal', duration: '1 hour', cost: Math.round(mealsCost * 0.3) },
          { time: '09:30', title: 'Last Minute Shopping', description: 'Buy souvenirs and gifts for loved ones.', type: 'activity', duration: '2 hours', cost: Math.round(activitiesCost * 0.2) },
          { time: '12:00', title: 'Farewell Lunch', description: 'Have a memorable final meal in the city.', type: 'meal', duration: '1.5 hours', cost: Math.round(mealsCost * 0.5) },
          { time: '14:00', title: 'Final Exploration', description: 'Visit any missed spots or revisit your favorite place.', type: 'sightseeing', duration: '2 hours', cost: 0 },
          { time: '16:00', title: 'Check-out & Departure', description: 'Check out from your accommodation and head to the airport/station.', type: 'checkout', duration: '2 hours', cost: Math.round(transportCost) }
        ];
      } else {
        const morning = morningActivities[Math.floor(Math.random() * morningActivities.length)];
        const afternoon = afternoonActivities[Math.floor(Math.random() * afternoonActivities.length)];
        const evening = eveningActivities[Math.floor(Math.random() * eveningActivities.length)];

        dayActivities = [
          { time: '07:30', title: 'Breakfast', description: mealSuggestions[Math.floor(Math.random() * mealSuggestions.length)], type: 'meal', duration: '1 hour', cost: Math.round(mealsCost * 0.3) },
          { time: '09:00', title: morning, description: `Start your day with ${morning.toLowerCase()}.`, type: 'activity', duration: '2.5 hours', cost: Math.round(activitiesCost * 0.4) },
          { time: '12:00', title: 'Lunch Break', description: 'Enjoy local cuisine at a recommended restaurant.', type: 'meal', duration: '1 hour', cost: Math.round(mealsCost * 0.4) },
          { time: '14:00', title: afternoon, description: `Continue your exploration with ${afternoon.toLowerCase()}.`, type: 'activity', duration: '3 hours', cost: Math.round(activitiesCost * 0.5) },
          { time: '17:30', title: 'Rest & Refresh', description: 'Take some time to relax at your accommodation.', type: 'rest', duration: '1 hour', cost: 0 },
          { time: '18:30', title: evening, description: `Enjoy the evening with ${evening.toLowerCase()}.`, type: 'activity', duration: '2 hours', cost: Math.round(activitiesCost * 0.3) },
          { time: '21:00', title: 'Dinner', description: 'End your day with a delightful dinner.', type: 'meal', duration: '1.5 hours', cost: Math.round(mealsCost * 0.5) }
        ];
      }

      const dayCost = dayActivities.reduce((sum, act) => sum + (act.cost || 0), 0);

      aiResponse.days.push({
        dayNumber,
        date: currentDate,
        activities: dayActivities,
        meals: {
          breakfast: isFirstDay ? 'Not included' : mealSuggestions[Math.floor(Math.random() * mealSuggestions.length)],
          lunch: 'Local restaurant',
          dinner: isLastDay ? 'Not included' : 'Recommended dining spot'
        },
        accommodation: isLastDay ? 'Checked out' : accommodationTypes[Math.floor(Math.random() * accommodationTypes.length)],
        transport: transportModes[Math.floor(Math.random() * transportModes.length)],
        estimatedCost: dayCost + accommodationCost
      });

      aiResponse.totalEstimatedCost.accommodation += accommodationCost;
      aiResponse.totalEstimatedCost.activities += dayActivities.filter(a => a.type === 'activity').reduce((sum, a) => sum + (a.cost || 0), 0);
      aiResponse.totalEstimatedCost.meals += dayActivities.filter(a => a.type === 'meal').reduce((sum, a) => sum + (a.cost || 0), 0);
      aiResponse.totalEstimatedCost.transport += transportCost;
    }

    aiResponse.totalEstimatedCost.total = 
      aiResponse.totalEstimatedCost.accommodation +
      aiResponse.totalEstimatedCost.activities +
      aiResponse.totalEstimatedCost.transport +
      aiResponse.totalEstimatedCost.meals +
      aiResponse.totalEstimatedCost.other;

    aiResponse.tips = [
      `Best time to visit ${destination} is during the spring or autumn months.`,
      'Book accommodations in advance for better rates.',
      'Try local street food for authentic culinary experiences.',
      'Carry comfortable walking shoes for exploring.',
      'Keep local currency handy for small purchases.',
      'Respect local customs and dress codes at religious sites.',
      'Stay hydrated and carry sunscreen during outdoor activities.'
    ];

    return aiResponse;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('Failed to generate travel plan');
  }
};

const getRecommendations = async (userPreferences, travelHistory) => {
  try {
    const recommendations = {
      destinations: [],
      activities: [],
      tips: []
    };

    const popularDestinations = [
      { name: 'Paris', country: 'France', type: 'city', highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise'] },
      { name: 'Bali', country: 'Indonesia', type: 'beach', highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Beach Clubs'] },
      { name: 'Tokyo', country: 'Japan', type: 'city', highlights: ['Senso-ji Temple', 'Shibuya Crossing', 'Tsukiji Market'] },
      { name: 'Santorini', country: 'Greece', type: 'beach', highlights: ['Oia Sunset', 'Red Beach', 'Wine Tasting'] },
      { name: 'New York', country: 'USA', type: 'city', highlights: ['Central Park', 'Times Square', 'Statue of Liberty'] },
      { name: 'Dubai', country: 'UAE', type: 'city', highlights: ['Burj Khalifa', 'Desert Safari', 'Gold Souk'] },
      { name: 'Maldives', country: 'Maldives', type: 'beach', highlights: ['Overwater Villas', 'Snorkeling', 'Sunset Cruise'] },
      { name: 'Swiss Alps', country: 'Switzerland', type: 'mountain', highlights: ['Skiing', 'Scenic Train Rides', 'Chocolate Tours'] }
    ];

    const preferredTypes = userPreferences?.travelStyle || ['city', 'beach'];
    
    recommendations.destinations = popularDestinations
      .filter(dest => preferredTypes.some(type => dest.type === type || type === 'all'))
      .slice(0, 5);

    recommendations.activities = [
      'Hot Air Balloon Ride',
      'Local Food Tour',
      'Sunset Cruise',
      'Historical Walking Tour',
      'Adventure Sports',
      'Cooking Class',
      'Wildlife Safari',
      'Spa & Wellness Day'
    ].slice(0, 6);

    recommendations.tips = [
      'Book flights 2-3 months in advance for better prices.',
      'Consider travel insurance for international trips.',
      'Learn basic phrases in the local language.',
      'Pack light and use versatile clothing items.',
      'Download offline maps before traveling.'
    ];

    return recommendations;
  } catch (error) {
    console.error('Recommendations Error:', error);
    throw new Error('Failed to get recommendations');
  }
};

module.exports = {
  generateTravelPlan,
  getRecommendations
};
