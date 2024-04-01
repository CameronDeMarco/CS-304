const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const Auth = require('../api/Auth');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/'});

// Configure multer storage to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      // Generate a unique filename with .png extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
    }
  });
  
  // Initialize multer with the configured storage
  const upload = multer({ storage: storage });
  
  // Route handler to handle file uploads
  router.post('/upload', [Auth.authenticate, upload.array("image", 4)], async (req, res) => {
      try {
          const { title, content } = req.body;
          const username = req.headers['authorization'].username;
          imageNames = req.files.map(({filename}) => filename);
          console.log(username + " uploaded media: " + imageNames);
          const newPost = new Post({ username, title, content, mediaFile: imageNames });
          await newPost.save();
          res.status(201).json({message: 'Post uploaded successfully'});
      } catch (error) {
          console.error('Error uploading post:', error);
          res.status(500).json({ message: 'Server Error' });
      }
  });


// router.post('/upload', [Auth.authenticate, upload.array("image", 4)], async (req, res) => {
//     try {
//         const { title, content } = req.body;
//         const username = req.headers['authorization'].username;
//         imageNames = req.files.map(({path}) => path);
//         console.log(username + " uploaded media: " + imageNames);
//         const newPost = new Post({ username, title, content, mediaFile: imageNames });
//         await newPost.save();
//         res.status(201).json({message: 'Post uploaded successfully'});
//     } catch (error) {
//         console.error('Error uploading post:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

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
        // Find the post by postId and increment the likes field
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.likes += 1;
        await post.save();
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