const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/admin/login', loginValidation, adminLogin);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
