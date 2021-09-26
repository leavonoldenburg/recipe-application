'use strict';

const express = require('express');
const Recipe = require('../models/recipe');
const router = express.Router();

// ### GET confirmation route ###
router.get('/confirmation', (req, res) => {
  res.render('confirmation');
});

// ### GET root route ###
router.get('/', (req, res, next) => {
  let sortString, pageButtons, recipeCount;
  const { sort } = req.query;
  // Set database sort string
  if (sort === undefined) {
    sortString = 'ratings';
  } else {
    sortString = getSortString(sort);
  }
  Recipe.find()
    // Create paging buttons array for hbs
    .then((count) => {
      recipeCount = count.length;
      pageButtons = [...Array(Math.ceil(recipeCount / 12)).keys()]
        .map((el) => el + 1)
        .slice(1);
    })
    // Get first page recipes
    .then(() => {
      return Recipe.find()
        .sort({ [sortString]: -1 })
        .limit(12)
        .populate('creator', 'username picture');
    })
    .then((recipes) => {
      // Create recipe range string for hbs
      const range = `0 - ${recipes.length}`;
      // Pass Recipes, Recipe total, Page button array, Recipe range, Sort value
      res.render('home', { recipes, recipeCount, pageButtons, range, sort });
      console.log(recipeCount);
    })
    .catch((error) => {
      next(error);
    });
});

// ### GET page route ###
router.get('/page/:page', (req, res, next) => {
  const page = Number(req.params.page);
  let recipeCount, pageButtons;
  Recipe.find()
    // get recipes total
    .then((count) => {
      recipeCount = count.length;
      // create page button array
      pageButtons = [...Array(Math.ceil(recipeCount / 12)).keys()]
        .map((el) => el + 1)
        .slice(1);
    })
    // get recipes according to page
    .then(() => {
      const skipCount = (page - 1) * 12;
      return Recipe.find()
        .skip(skipCount)
        .limit(12)
        .populate('creator', 'username picture')
        .then((recipes) => {
          const range = `${skipCount + 1} - ${skipCount + recipes.length}`;
          // pass Recipes, Recipe total, Page button array, Recipe range
          res.render('home', { recipes, recipeCount, pageButtons, range });
        });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;

// #########################################
// ##  Get Sort-string from Select-value  ##
// #########################################

function getSortString(formValue) {
  const valueMap = {
    Ratings: 'ratings',
    'Cooking Time': 'cookingTime',
    'Date added': 'createdAt'
  };
  for (const [key, value] of Object.entries(valueMap)) {
    if (key === formValue) return value;
  }
}
