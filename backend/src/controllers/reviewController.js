const { Review, Destination, Booking } = require('../models');

const createReview = async (req, res) => {
  try {
    const { destination, booking, rating, title, review, visitDate, travelerType } = req.body;

    const existingReview = await Review.findOne({
      user: req.user.id,
      destination
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this destination' });
    }

    if (booking) {
      const bookingData = await Booking.findOne({
        _id: booking,
        user: req.user.id
      });

      if (!bookingData) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (bookingData.status !== 'completed') {
        return res.status(400).json({ message: 'Can only review completed bookings' });
      }
    }

    const newReview = new Review({
      user: req.user.id,
      destination,
      booking,
      rating,
      title,
      review,
      visitDate,
      travelerType,
      isVerified: !!booking
    });

    await newReview.save();

    await updateDestinationRating(destination);

    await newReview.populate('user', 'firstName lastName avatar');

    res.status(201).json({
      message: 'Review submitted successfully',
      review: newReview
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDestinationReviews = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

    const query = { destination: destinationId, isPublic: true };

    const sortOptions = {};
    if (sortBy === 'helpful') {
      sortOptions['helpful.count'] = -1;
    } else {
      sortOptions[sortBy] = -1;
    }

    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName avatar')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments(query);

    const ratingStats = await Review.aggregate([
      { $match: { destination: new require('mongoose').Types.ObjectId(destinationId) } },
      { 
        $group: { 
          _id: null, 
          averageRating: { $avg: '$rating.overall' },
          totalReviews: { $sum: 1 },
          fiveStar: { $sum: { $cond: [{ $eq: ['$rating.overall', 5] }, 1, 0] } },
          fourStar: { $sum: { $cond: [{ $eq: ['$rating.overall', 4] }, 1, 0] } },
          threeStar: { $sum: { $cond: [{ $eq: ['$rating.overall', 3] }, 1, 0] } },
          twoStar: { $sum: { $cond: [{ $eq: ['$rating.overall', 2] }, 1, 0] } },
          oneStar: { $sum: { $cond: [{ $eq: ['$rating.overall', 1] }, 1, 0] } }
        } 
      }
    ]);

    res.json({
      reviews,
      ratingStats: ratingStats[0] || null,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: req.user.id })
      .populate('destination', 'name location images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments({ user: req.user.id });

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, title, review } = req.body;

    const existingReview = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { rating, title, review, updatedAt: new Date() },
      { new: true }
    );

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await updateDestinationRating(existingReview.destination);

    res.json({
      message: 'Review updated successfully',
      review: existingReview
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await updateDestinationRating(review.destination);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const userIndex = review.helpful.users.indexOf(req.user.id);

    if (userIndex > -1) {
      review.helpful.users.splice(userIndex, 1);
      review.helpful.count--;
    } else {
      review.helpful.users.push(req.user.id);
      review.helpful.count++;
    }

    await review.save();

    res.json({
      message: userIndex > -1 ? 'Helpful mark removed' : 'Marked as helpful',
      helpfulCount: review.helpful.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    if (global.USE_LOCAL_DB) {
      let reviews = global.localDB.reviews._read();
      if (status) reviews = reviews.filter(r => (status === 'public') ? r.isPublic !== false : r.isPublic === false);
      const total = reviews.length;
      const paged = reviews.slice((page - 1) * limit, page * limit);
      return res.json({ reviews: paged, totalPages: Math.ceil(total / limit), currentPage: Number(page), total });
    }

    const query = {};
    if (status) query.isPublic = status === 'public';

    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName email')
      .populate('destination', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const adminResponse = async (req, res) => {
  try {
    const { response } = req.body;

    if (global.USE_LOCAL_DB) {
      const review = await global.localDB.reviews.findByIdAndUpdate(req.params.id, {
        $set: { adminResponse: { response, respondedAt: new Date().toISOString(), respondedBy: req.user.id } }
      }, { new: true });
      if (!review) return res.status(404).json({ message: 'Review not found' });
      return res.json({ message: 'Response added successfully', review });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        'adminResponse.response': response,
        'adminResponse.respondedAt': new Date(),
        'adminResponse.respondedBy': req.user.id
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      message: 'Response added successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateDestinationRating = async (destinationId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { destination: new require('mongoose').Types.ObjectId(destinationId) } },
      { 
        $group: { 
          _id: null, 
          averageRating: { $avg: '$rating.overall' },
          count: { $sum: 1 }
        } 
      }
    ]);

    if (stats.length > 0) {
      await Destination.findByIdAndUpdate(destinationId, {
        'rating.average': Math.round(stats[0].averageRating * 10) / 10,
        'rating.count': stats[0].count
      });
    }
  } catch (error) {
    console.error('Error updating destination rating:', error);
  }
};

module.exports = {
  createReview,
  getDestinationReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markHelpful,
  getAllReviews,
  adminResponse
};
