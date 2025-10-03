const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  joinFamily,
  getProfile
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty()
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], login);

router.post('/join-family', authMiddleware, joinFamily);

router.get('/profile', authMiddleware, getProfile);

module.exports = router;