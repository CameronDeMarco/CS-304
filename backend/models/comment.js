const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the User
const commentSchema = new Schema({
  postID: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'posts' });

const comment = mongoose.model("comments", commentSchema);
module.exports = comment;