const express = require('express');
const {
  createReport,
  getUserReports,
  getReportById,
  addResponse,
  getAllReports,
  updateReportStatus,
  addAdminResponse
} = require('../controllers/reportController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, createReport);
router.get('/my-reports', authMiddleware, getUserReports);
router.get('/all', authMiddleware, adminMiddleware, getAllReports);
router.get('/:id', authMiddleware, getReportById);
router.post('/:id/response', authMiddleware, addResponse);
router.put('/:id/status', authMiddleware, adminMiddleware, updateReportStatus);
router.post('/:id/admin-response', authMiddleware, adminMiddleware, addAdminResponse);

module.exports = router;
