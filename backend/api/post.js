const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const Auth = require('../api/Auth');

router.post('/upload', Auth.authenticate, async (req, res) => {
    try {
        const { title, content, token } = req.body;
        const { username } = token;
        console.log("username: " + username);
        console.log(token);
        const newPost = new Post({ username, title, content });
        await newPost.save();
        res.status(201).json({message: 'Post uploaded successfully'});
    } catch (error) {
        console.error('Error uploading post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Fetch all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Like a post
router.post('/posts/:postId/like', Auth.authenticate, async (req, res) => {
    try {
        const { postId } = req.params;
        // Logic to update the post in the database to increment the likes count
        res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Post a comment on a post
router.post('/posts/:postId/comments', Auth.authenticate, async (req, res) => {
    try {
        const { postId } = req.params;
        const { comment } = req.body;
        // Logic to update the post in the database to add the comment
        res.status(200).json({ message: 'Comment posted successfully' });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;