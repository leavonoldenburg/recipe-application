const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 300
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // ref recipe
  picture: {
    type: String
  },
  timestamps: {
    createdAt: 'creationDate',
    updatedAt: 'editingDate'
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
