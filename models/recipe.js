const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 300
  },

  ingredients: {
    type: String,
    required: true,
    minlength: 3
  },

  instructions: {
    type: String,
    required: true,
    minlength: 3
  },

  // creator: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: 'User'
  // },

  picture: {
    type: String
  }

  //ref recipe
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
