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
  let sortString, filterString, pageButtons, recipeCount;
  const { sort, filter } = req.query;
  // Set database sort string
  if (sort === undefined) {
    sortString = 'ratings';
  } else {
    sortString = getSortString(sort);
  }
  // Set database filter string
  if (filter === undefined || filter === 'All recipes') {
    filterString = {};
  } else {
    filterString = getFilterString(filter);
  }
  Recipe.find(filterString)
    // Get recipes total
    .then((count) => {
      recipeCount = count.length;
      // Create paging buttons array for hbs
      pageButtons = [...Array(Math.ceil(recipeCount / 12)).keys()].map(
        (el) => el + 1
      );
    })
    // Get first page recipes
    .then(() => {
      return Recipe.find(filterString)
        .sort({ [sortString]: -1 })
        .limit(12)
        .populate('creator', 'username picture');
    })
    .then((recipes) => {
      // Create recipe range string for hbs
      const range = `0 - ${recipes.length}`;
      // Pass Recipes, Recipe total, Page button array, Recipe range, Sort value, Filter value
      res.render('home', {
        recipes,
        recipeCount,
        pageButtons,
        range,
        sort,
        filter
      });
    })
    .catch((error) => {
      next(error);
    });
});

// ### GET page route ###
router.get('/page/:page', (req, res, next) => {
  let sortString, filterString, pageButtons, recipeCount, skipCount;
  const { sort, filter } = req.query;
  const page = Number(req.params.page);
  // Set database sort string
  if (sort === undefined) {
    sortString = 'ratings';
  } else {
    sortString = getSortString(sort);
  }
  // Set database filter string
  if (filter === undefined || filter === 'All recipes') {
    filterString = {};
  } else {
    filterString = getFilterString(filter);
  }
  Recipe.find(filterString)
    // Get recipes total
    .then((count) => {
      recipeCount = count.length;
      // Create page button array
      pageButtons = [...Array(Math.ceil(recipeCount / 12)).keys()].map(
        (el) => el + 1
      );
    })
    // Get recipes according to page
    .then(() => {
      skipCount = (page - 1) * 12;
      return Recipe.find(filterString)
        .sort({ [sortString]: -1 })
        .skip(skipCount)
        .limit(12)
        .populate('creator', 'username picture');
    })
    .then((recipes) => {
      // Create recipe range string for hbs
      const range = `${skipCount + 1} - ${skipCount + recipes.length}`;
      // Pass Recipes, Recipe total, Page button array, Recipe range, Sort value, Filter value
      res.render('home', {
        recipes,
        recipeCount,
        pageButtons,
        range,
        sort,
        filter
      });
    })
    .catch((error) => {
      next(error);
    });
});

// #########################
// ##  Edamam Recipe API  ##
// #########################

const { RecipeSearchClient } = require('edamam-api');

const client = new RecipeSearchClient({
  // appId: process.env.APP_ID,
  // appKey: process.env.API_KEY
});

// ### GET API test route ###
router.get('/apitest', (req, res, next) => {
  res.render('home');
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

// ###########################################
// ##  Get Filter-string from Select-value  ##
// ###########################################

function getFilterString(formValue) {
  const valueMap = {
    Easy: { level: 'Easy' },
    Intermediate: { level: 'Intermediate' },
    Advanced: { level: 'Advanced' },
    Veggie: { diet: 'Vegetarian' },
    Omnivore: { diet: 'Omnivore' },
    Vegan: { diet: 'Vegan' },
    Pescatarian: { diet: 'Pescatarian' },
    Asian: { cuisine: 'Asian' },
    European: { cuisine: 'European' },
    American: { cuisine: 'American' },
    African: { cuisine: 'African' },
    'Appetizers & Starters': { dishType: 'Appetizers & Starters' },
    'Meat dishes': { dishType: 'Meat dishes' },
    'Soups & Stews': { dishType: 'Soups & Stews' },
    'Pasta & Noodles': { dishType: 'Pasta & Noodles' },
    Salads: { dishType: 'Salads' },
    Burgers: { dishType: 'Burgers' },
    'Grains & Legumes': { dishType: 'Beans, Grains & Legumes' },
    'Casseroles & Gratins': { dishType: 'Casseroles & Gratins' },
    Desserts: { dishType: 'Desserts' },
    Pizzas: { dishType: 'Pizzas' },
    'Baked Goods': { dishType: 'Baked Goods' }
  };
  for (const [key, value] of Object.entries(valueMap)) {
    if (key === formValue) return value;
  }
}
