const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds to use (higher is more secure)
const multer = require('multer');
const User = require('../models/user');

// Hash the password before saving it
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, dob } = req.body;
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create a new user document with hashed password
    const newUser = new User({ firstName, lastName, username, email, password: hashedPassword, dob });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/login', async (req, res) => {
    try {
      // Extract username/email and password from request body
      const { username, password } = req.body;
  
      // Find user by username/email in the database
      const user = await User.findOne({ username });
  
      // Check if user exists
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });
  
      // Send JWT token to the client
      console.log("successfully logged in as", user.username);
      console.log(token);
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  const extractToken = (req, res, next) => {
    // Check if Authorization header exists
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token)
        if (token) {
            // Set token in req object
            req.token = token;
        } else {
          console.log("Token doesnt exist")
        }
    } else {
      console.log("Authorization Header doesnt exist")
    }
    next();
};

  const verifyUser = (req, res, next) => {
    const token = req.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    }
    else {
        jwt.verify(token, "your-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not correct" });
            }
            else {
                req.userId = decoded.userId;
                req.username = decoded.username
                next();
            }
        })
    }
}

router.get('/', extractToken, verifyUser, (req, res) => {
    return res.json({ Status: "Success", userId: req.userId, username: req.username })
})

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../uploads/'); // Destination directory for storing uploaded files
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for each uploaded file
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/:userId/upload-profile-picture', upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const userId = req.params.userId;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Find the user document by ID and update or insert fields
    await User.updateOne(
      { _id: userId },
      {
        $setOnInsert: {
          profilePicture: req.file.path
        }
      },
      { upsert: true }
    );

    res.json({ message: 'Profile picture uploaded successfully' });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/:userId/upload-background-picture', upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const userId = req.params.userId;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Find the user document by ID and update or insert fields
    await User.updateOne(
      { _id: userId },
      {
        $setOnInsert: {
          backgroundPicture: req.file.path
        }
      },
      { upsert: true }
    );

    res.json({ message: 'Background picture uploaded successfully' });
  } catch (error) {
    console.error('Error uploading background picture:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:userId/profile-picture', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    res.sendFile(user.profilePicture);
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Background picture endpoint
router.get('/:userId/background-picture', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user || !user.backgroundPicture) {
      return res.status(404).json({ message: 'Background picture not found' });
    }

    res.sendFile(user.backgroundPicture);
  } catch (error) {
    console.error('Error fetching background picture:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;