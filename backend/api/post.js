const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');
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
        console.log("postId: " + postId + " Comment: " + comment);
        const username = req.headers['authorization'].username;
        // Logic to update the post in the database to add the comment
        const newComment = new Comment({ postID: postId, username, comment });
        await newComment.save()
        res.status(200).json({ message: 'Comment posted successfully' });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get a post's comments
router.get('/posts/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({'postID': postId}, 'comment postID');
        console.log("test:" + comments);
        res.json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;