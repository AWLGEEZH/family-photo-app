const express = require('express');
const { body } = require('express-validator');
const {
  createPost,
  getFamilyPosts,
  likePost,
  addComment,
  deletePost
} = require('../controllers/postController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(authMiddleware);

router.post('/', upload.array('media', 10), createPost);

router.get('/', getFamilyPosts);

router.post('/:postId/like', likePost);

router.post('/:postId/comments', [
  body('text').trim().notEmpty().withMessage('Comment text is required')
    .isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
], addComment);

router.delete('/:postId', deletePost);

module.exports = router;