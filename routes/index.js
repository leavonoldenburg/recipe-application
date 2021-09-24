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
    // get first page recipes
    .then(() => {
      return Recipe.find()
        .limit(12)
        .populate('creator', 'username picture')
        .then((recipes) => {
          const range = `0 - ${recipes.length}`;
          // pass Recipes, Recipe total, Page button array, Recipe range
          res.render('home', { recipes, recipeCount, pageButtons, range });
        });
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
