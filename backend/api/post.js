const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const Auth = require('../api/Auth');

router.post('/upload', Auth.authenticate, async (req, res) => {
    try {
        const { username, title, content, token } = req.body;
        console.log("second");
        const newPost = new Post({ username, title, content });
        await newPost.save();
        res.status(201).json({message: 'Post uploaded successfully'})
      } catch (error) {
        console.error('Error uploading post:', error);
        res.status(500).json({ message: 'Server Error' });
      }
    });

module.exports = router;