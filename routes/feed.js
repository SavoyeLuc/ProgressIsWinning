const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const auth = require('../middleware/auth');

// Create a new post
router.post('/posts', auth, feedController.createPost);

// Get all posts with pagination and sorting
router.get('/posts', auth, feedController.getPosts);

// Get a single post by ID
router.get('/posts/:id', auth, feedController.getPostById);

// Get comments for a post
router.get('/posts/:postID/comments', auth, feedController.getComments);

// Add a comment to a post
router.post('/comments', auth, feedController.addComment);

// Add a like to a post or comment
router.post('/likes', auth, feedController.addLike);

// Remove a like
router.delete('/likes', auth, feedController.removeLike);

module.exports = router;
