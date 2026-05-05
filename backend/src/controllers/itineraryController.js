const { Itinerary, Destination } = require('../models');
const { generateTravelPlan } = require('../services/aiService');

const createItinerary = async (req, res) => {
  try {
    const { destination, startDate, endDate, travelers, budget, notes } = req.body;

    const destinationData = await Destination.findById(destination);
    if (!destinationData) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const itinerary = new Itinerary({
      user: req.user.id,
      title: `Trip to ${destinationData.name}`,
      destination,
      startDate: start,
      endDate: end,
      duration,
      travelers,
      budget,
      notes,
      days: []
    });

    await itinerary.save();

    await itinerary.populate('destination');

    res.status(201).json({
      message: 'Itinerary created successfully',
      itinerary
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const generateAIItinerary = async (req, res) => {
  try {
    const { destination, startDate, endDate, travelers, budget, preferences, notes } = req.body;

    const destinationData = await Destination.findById(destination);
    if (!destinationData) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const aiPrompt = {
      destination: destinationData.name,
      country: destinationData.location.country,
      duration,
      startDate,
      endDate,
      travelers,
      budget,
      preferences: preferences || [],
      activities: destinationData.activities,
      attractions: destinationData.attractions,
      notes
    };

    const aiResponse = await generateTravelPlan(aiPrompt);

    const itinerary = new Itinerary({
      user: req.user.id,
      title: `AI Planned Trip to ${destinationData.name}`,
      destination,
      startDate: start,
      endDate: end,
      duration,
      travelers,
      budget,
      notes,
      aiGenerated: true,
      aiPrompt: JSON.stringify(aiPrompt),
      aiResponse: JSON.stringify(aiResponse),
      days: aiResponse.days || [],
      totalEstimatedCost: aiResponse.totalEstimatedCost || {}
    });

    await itinerary.save();
    await itinerary.populate('destination');

    res.status(201).json({
      message: 'AI itinerary generated successfully',
      itinerary
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserItineraries = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { user: req.user.id };
    if (status) query.status = status;

    const itineraries = await Itinerary.find(query)
      .populate('destination', 'name location images rating')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Itinerary.countDocuments(query);

    res.json({
      itineraries,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('destination');

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.json({ itinerary });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateItinerary = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.user;

    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).populate('destination');

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.json({
      message: 'Itinerary updated successfully',
      itinerary
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addDayToItinerary = async (req, res) => {
  try {
    const { day } = req.body;

    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    itinerary.days.push(day);
    await itinerary.save();

    res.json({
      message: 'Day added to itinerary',
      itinerary
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateDay = async (req, res) => {
  try {
    const { dayIndex, day } = req.body;

    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    if (dayIndex < 0 || dayIndex >= itinerary.days.length) {
      return res.status(400).json({ message: 'Invalid day index' });
    }

    itinerary.days[dayIndex] = day;
    await itinerary.save();

    res.json({
      message: 'Day updated successfully',
      itinerary
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createItinerary,
  generateAIItinerary,
  getUserItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  addDayToItinerary,
  updateDay
};
