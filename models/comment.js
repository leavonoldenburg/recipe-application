const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
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
<<<<<<< Updated upstream

    refRecipe: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Recipe'
    }
  },
  // picture: {
  //   type: String
  // },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'editingDate'
    }
  }
=======
    // ref recipe
    recipeRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    },

    picture: {
      type: String
    }
  },
  { timestamps: true }
>>>>>>> Stashed changes
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
