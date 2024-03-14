const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the User
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'users' });

// Create a Mongoose model for the User schema
const user = mongoose.model("users", userSchema);

module.exports = user;
