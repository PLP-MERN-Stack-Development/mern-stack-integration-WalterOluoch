// posts.js - Post-related routes

const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', protect, validatePost, createPost);
router.put('/:id', protect, validatePost, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/comments', protect, addComment);

module.exports = router;
