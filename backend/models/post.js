const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the Post
const postSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  mediaFile: [{
    type: String,
    sparse: true,
  }],
  likes: {
    type: [String], // Array to store user IDs who liked the post
    default: [] // Default value is an empty array
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'posts' });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
