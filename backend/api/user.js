const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds to use (higher is more secure)
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
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
  
      // Send JWT token to the client
      res.status(200).json({ token });
      console.log("successfully logged in as", user.username);
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

module.exports = router;