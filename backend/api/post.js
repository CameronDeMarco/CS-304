const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const Auth = require('../api/Auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/'});

router.post('/upload', [Auth.authenticate, upload.array("image", 4)], async (req, res) => {
    try {
        const { title, content } = req.body;
        const username = req.headers['authorization'].username;
        imageNames = req.files.map(({path}) => path);
        console.log(username + " uploaded media: " + imageNames);
        const newPost = new Post({ username, title, content, mediaFile: imageNames });
        await newPost.save();
        res.status(201).json({message: 'Post uploaded successfully'});
    } catch (error) {
        console.error('Error uploading post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;