const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser,
  getAnalytics
} = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/analytics', authMiddleware, adminMiddleware, getAnalytics);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, adminMiddleware, getUserById);
router.put('/users/:id/block', authMiddleware, adminMiddleware, blockUser);
router.put('/users/:id/unblock', authMiddleware, adminMiddleware, unblockUser);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
