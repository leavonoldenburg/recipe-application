const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: [
    {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 120
    }
  ]
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
