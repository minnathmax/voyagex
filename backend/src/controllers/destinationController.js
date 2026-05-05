const { Destination, Review } = require('../models');

const getAllDestinations = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const { search, category, page = 1, limit = 10 } = req.query;
      let all = await global.localDB.destinations.find({ isActive: true });
      all = await all; // resolve chain
      if (search) {
        const s = search.toLowerCase();
        all = all.filter(d => d.name.toLowerCase().includes(s) || d.description.toLowerCase().includes(s) || d.location.country.toLowerCase().includes(s));
      }
      if (category) {
        const cats = category.split(',');
        all = all.filter(d => d.category.some(c => cats.includes(c)));
      }
      const start = (page - 1) * limit;
      const paged = all.slice(start, start + Number(limit));
      return res.json({ destinations: paged, totalPages: Math.ceil(all.length / limit), currentPage: Number(page), total: all.length });
    }

    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      minBudget, 
      maxBudget, 
      season, 
      country,
      sortBy = 'rating',
      order = 'desc'
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = { $in: category.split(',') };
    }

    if (minBudget || maxBudget) {
      query['budgetRange.min'] = {};
      if (minBudget) query['budgetRange.min'].$gte = Number(minBudget);
      if (maxBudget) query['budgetRange.max'] = { $lte: Number(maxBudget) };
    }

    if (season) {
      query.bestSeason = { $in: season.split(',') };
    }

    if (country) {
      query['location.country'] = country;
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const destinations = await Destination.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'firstName lastName');

    const count = await Destination.countDocuments(query);

    res.json({
      destinations,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDestinationById = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const dest = await global.localDB.destinations.findById(req.params.id);
      if (!dest) return res.status(404).json({ message: 'Destination not found' });
      const reviews = await global.localDB.reviews.find({ destination: req.params.id });
      return res.json({ destination: dest, reviews: await reviews });
    }

    const destination = await Destination.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    destination.visitCount += 1;
    await destination.save();

    const reviews = await Review.find({ destination: destination._id, isPublic: true })
      .populate('user', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ destination, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createDestination = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const dest = await global.localDB.destinations.create({
        ...req.body,
        createdBy: req.user.id,
        isActive: true,
        visitCount: 0,
        rating: { average: 0, count: 0 },
      });
      return res.status(201).json({ message: 'Destination created successfully', destination: dest });
    }

    const destinationData = {
      ...req.body,
      createdBy: req.user.id
    };

    const destination = new Destination(destinationData);
    await destination.save();

    res.status(201).json({
      message: 'Destination created successfully',
      destination
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateDestination = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      const dest = await global.localDB.destinations.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }, { new: true });
      if (!dest) return res.status(404).json({ message: 'Destination not found' });
      return res.json({ message: 'Destination updated successfully', destination: dest });
    }

    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json({
      message: 'Destination updated successfully',
      destination
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteDestination = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      await global.localDB.destinations.findByIdAndUpdate(req.params.id, {
        $set: { isActive: false }
      });
      return res.json({ message: 'Destination deleted successfully' });
    }

    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPopularDestinations = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      let all = await global.localDB.destinations.find({ isActive: true }).sort({ visitCount: -1 }).limit(8);
      return res.json({ destinations: await all });
    }

    const destinations = await Destination.find({ isActive: true })
      .sort({ visitCount: -1, 'rating.average': -1 })
      .limit(8);

    res.json({ destinations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFeaturedDestinations = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      let all = await global.localDB.destinations.find({ isActive: true });
      all = await all;
      all.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
      return res.json({ destinations: all.slice(0, 6) });
    }

    const destinations = await Destination.find({ isActive: true })
      .sort({ 'rating.average': -1 })
      .limit(6);

    res.json({ destinations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDestinationsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (global.USE_LOCAL_DB) {
      let all = await global.localDB.destinations.find({ isActive: true });
      all = await all;
      const filtered = all.filter(d => d.category && d.category.includes(category)).slice(0, 10);
      return res.json({ destinations: filtered });
    }

    const destinations = await Destination.find({ 
      category: { $in: [category] },
      isActive: true 
    })
    .sort({ 'rating.average': -1 })
    .limit(10);

    res.json({ destinations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      let all = await global.localDB.destinations.find({});
      all = await all;
      const cats = [...new Set(all.flatMap(d => d.category || []))];
      return res.json({ categories: cats });
    }
    const categories = await Destination.distinct('category');
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCountries = async (req, res) => {
  try {
    if (global.USE_LOCAL_DB) {
      let all = await global.localDB.destinations.find({});
      all = await all;
      const countries = [...new Set(all.map(d => d.location?.country).filter(Boolean))];
      return res.json({ countries });
    }
    const countries = await Destination.distinct('location.country');
    res.json({ countries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
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
};
