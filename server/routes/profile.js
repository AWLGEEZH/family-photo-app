const express = require('express');
const { body } = require('express-validator');
const {
  addChild,
  updateChild,
  removeChild,
  getChildren,
  updateProfile,
  getFamilyMembers
} = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/children', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('relationship').optional().isIn(['child', 'pet'])
], addChild);

router.put('/children/:childId', updateChild);

router.delete('/children/:childId', removeChild);

router.get('/children', getChildren);

router.put('/update', [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty()
], updateProfile);

router.get('/family', getFamilyMembers);

module.exports = router;