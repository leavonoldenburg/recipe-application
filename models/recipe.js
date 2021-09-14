const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1000
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  picture: {
    type: String
  }

  //ref recipe
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
