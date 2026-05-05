const { Report } = require('../models');

const createReport = async (req, res) => {
  try {
    const { type, category, subject, description, relatedBooking, relatedDestination } = req.body;

    const reportId = `REP${Date.now()}`;

    const report = new Report({
      reportId,
      user: req.user.id,
      type,
      category,
      subject,
      description,
      relatedBooking,
      relatedDestination,
      status: 'open'
    });

    await report.save();

    res.status(201).json({
      message: 'Report submitted successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Report.countDocuments(query);

    res.json({
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ report });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addResponse = async (req, res) => {
  try {
    const { message } = req.body;

    const report = await Report.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        $push: {
          responses: {
            from: 'user',
            message,
            respondedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({
      message: 'Response added successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const { status, priority, type, page = 1, limit = 20 } = req.query;

    if (global.USE_LOCAL_DB) {
      let reports = global.localDB.reviews._read(); // Using reviews as reports placeholder
      // Return empty reports array for admin
      return res.json({ reports: [], totalPages: 0, currentPage: 1, total: 0 });
    }

    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (type) query.type = type;

    const reports = await Report.find(query)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Report.countDocuments(query);

    res.json({
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { status, priority, resolution } = req.body;

    const updateData = { status, priority };
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = req.user.id;
      updateData.resolution = resolution;
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addAdminResponse = async (req, res) => {
  try {
    const { message } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          responses: {
            from: 'admin',
            message,
            respondedBy: req.user.id,
            respondedAt: new Date()
          }
        },
        status: 'in-progress'
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({
      message: 'Response added successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createReport,
  getUserReports,
  getReportById,
  addResponse,
  getAllReports,
  updateReportStatus,
  addAdminResponse
};
