const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const familyAuthMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {});

    const { familyCode } = req.params;

    if (!familyCode) {
      return res.status(400).json({ message: 'Family code required' });
    }

    if (req.user.familyCode !== familyCode && !req.user.familyMembers.includes(familyCode)) {
      return res.status(403).json({ message: 'Access denied to this family' });
    }

    next();
  } catch (error) {
    console.error('Family auth middleware error:', error);
    res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = { authMiddleware, familyAuthMiddleware };