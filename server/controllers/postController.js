const Post = require('../models/Post');
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { validationResult } = require('express-validator');
const fs = require('fs').promises;

const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one media file is required' });
    }

    const { caption, tags, isPrivate } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user || !user.familyCode) {
      return res.status(400).json({ message: 'User must belong to a family' });
    }

    const mediaUploads = [];

    try {
      for (const file of req.files) {
        const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'image';
        const uploadResult = await uploadToCloudinary(file.path, resourceType);

        mediaUploads.push({
          type: resourceType,
          url: uploadResult.url,
          publicId: uploadResult.publicId
        });

        await fs.unlink(file.path);
      }

      const parsedTags = tags ? JSON.parse(tags) : [];

      const newPost = new Post({
        author: userId,
        caption: caption || '',
        media: mediaUploads,
        tags: parsedTags,
        familyCode: user.familyCode,
        isPrivate: isPrivate === 'true' || false
      });

      await newPost.save();
      await newPost.populate('author', 'firstName lastName profilePicture');

      res.status(201).json({
        message: 'Post created successfully',
        post: newPost
      });
    } catch (uploadError) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting temp file:', unlinkError);
        }
      }

      for (const media of mediaUploads) {
        try {
          await deleteFromCloudinary(media.publicId, media.type);
        } catch (deleteError) {
          console.error('Error deleting from cloudinary:', deleteError);
        }
      }

      throw uploadError;
    }
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFamilyPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user || !user.familyCode) {
      return res.status(400).json({ message: 'User must belong to a family' });
    }

    const posts = await Post.find({ familyCode: user.familyCode })
      .populate('author', 'firstName lastName profilePicture')
      .populate('likes.user', 'firstName lastName')
      .populate('comments.user', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments({ familyCode: user.familyCode });

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get family posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(userId);
    if (post.familyCode !== user.familyCode && !user.familyMembers.some(member => member.familyCode === post.familyCode)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const existingLike = post.likes.find(like => like.user.toString() === userId.toString());

    if (existingLike) {
      post.likes.pull(existingLike._id);
    } else {
      post.likes.push({ user: userId });
    }

    await post.save();
    await post.populate('likes.user', 'firstName lastName');

    res.json({
      message: existingLike ? 'Post unliked' : 'Post liked',
      likes: post.likes
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(userId);
    if (post.familyCode !== user.familyCode && !user.familyMembers.some(member => member.familyCode === post.familyCode)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    post.comments.push({
      user: userId,
      text: text.trim()
    });

    await post.save();
    await post.populate('comments.user', 'firstName lastName profilePicture');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    for (const media of post.media) {
      try {
        await deleteFromCloudinary(media.publicId, media.type);
      } catch (deleteError) {
        console.error('Error deleting media from cloudinary:', deleteError);
      }
    }

    await Post.findByIdAndDelete(postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPost,
  getFamilyPosts,
  likePost,
  addComment,
  deletePost
};