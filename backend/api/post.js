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

module.exports = router;