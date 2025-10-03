const User = require('../models/User');
const { validationResult } = require('express-validator');

const addChild = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, birthDate, relationship } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newChild = {
      name: name.trim(),
      birthDate: birthDate ? new Date(birthDate) : undefined,
      relationship: relationship || 'child',
      profilePicture: ''
    };

    user.children.push(newChild);
    await user.save();

    res.status(201).json({
      message: `${relationship === 'pet' ? 'Pet' : 'Child'} added successfully`,
      child: user.children[user.children.length - 1]
    });
  } catch (error) {
    console.error('Add child error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const { name, birthDate, profilePicture } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const child = user.children.id(childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    if (name) child.name = name.trim();
    if (birthDate) child.birthDate = new Date(birthDate);
    if (profilePicture !== undefined) child.profilePicture = profilePicture;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      child
    });
  } catch (error) {
    console.error('Update child error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const child = user.children.id(childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    user.children.pull(childId);
    await user.save();

    res.json({ message: 'Profile removed successfully' });
  } catch (error) {
    console.error('Remove child error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getChildren = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('children');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ children: user.children });
  } catch (error) {
    console.error('Get children error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, profilePicture } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFamilyMembers = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate('familyMembers', 'firstName lastName email profilePicture children')
      .select('familyCode children firstName lastName');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allChildren = [];

    user.children.forEach(child => {
      allChildren.push({
        ...child.toObject(),
        parentName: `${user.firstName} ${user.lastName}`
      });
    });

    user.familyMembers.forEach(member => {
      member.children.forEach(child => {
        allChildren.push({
          ...child.toObject(),
          parentName: `${member.firstName} ${member.lastName}`
        });
      });
    });

    res.json({
      familyCode: user.familyCode,
      familyMembers: user.familyMembers,
      allChildren
    });
  } catch (error) {
    console.error('Get family members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addChild,
  updateChild,
  removeChild,
  getChildren,
  updateProfile,
  getFamilyMembers
};