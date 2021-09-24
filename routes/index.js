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
  let recipeCount;
  Recipe.find()
    // get recipes total
    .then((count) => {
      recipeCount = count.length;
    })
    // get first page recipes
    .then(() => {
      return Recipe.find()
        .limit(12)
        .populate('creator', 'username picture')
        .then((recipes) => {
          res.render('home', { recipes, recipeCount });
        });
    })
    .catch((error) => {
      next(error);
    });
});

// ### GET page route ###
router.get('/:page', (req, res, next) => {
  const page = Number(req.params.page);
  let recipeCount;
  Recipe.find()
    // get recipes total
    .then((count) => {
      recipeCount = count.length;
    })
    // get recipes according to page
    .then(() => {
      const skipCount = (page - 1) * 12;
      return Recipe.find()
        .skip(skipCount)
        .limit(12)
        .populate('creator', 'username picture')
        .then((recipes) => {
          res.render('home', { recipes, recipeCount });
        });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
