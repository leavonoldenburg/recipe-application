'use strict';

const express = require('express');
const Recipe = require('../models/recipe');
const router = express.Router();

// #########################
// ##  Edamam Recipe API  ##
// #########################

const { RecipeSearchClient } = require('edamam-api');

const client = new RecipeSearchClient({
  appId: process.env.APP_ID,
  appKey: process.env.API_KEY
});

// ### GET confirmation route ###
router.get('/confirmation', (req, res) => {
  res.render('confirmation');
});

// ### GET root route ###
router.get('/', (req, res, next) => {
  let sortString, sortDirection, filterString, pageButtons, recipeCount;
  const { sort, filter } = req.query;
  // Set database sort string and direction
  if (sort === undefined) {
    sortString = 'ratings';
    sortDirection = -1;
  } else {
    sortString = Object.keys(getSortString(sort))[0];
    sortDirection = Object.values(getSortString(sort))[0];
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
        .sort({ [sortString]: sortDirection })
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
  let sortString,
    sortDirection,
    filterString,
    pageButtons,
    recipeCount,
    skipCount;
  const { sort, filter } = req.query;
  const page = Number(req.params.page);
  // Set database sort string and direction
  if (sort === undefined) {
    sortString = 'ratings';
    sortDirection = -1;
  } else {
    sortString = Object.keys(getSortString(sort))[0];
    sortDirection = Object.values(getSortString(sort))[0];
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
        .sort({ [sortString]: sortDirection })
        .skip(skipCount)
        .limit(12)
        .populate('creator', 'username picture');
    })
    .then((recipes) => {
      // Create recipe range string for hbs
      const range = `${skipCount + 1} - ${skipCount + recipes.length} `;
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

// ### GET API test route ###
router.get('/apitest', (req, res, next) => {
  client
    .search({ query: 'Bread', limit: { from: 0, to: 12 } })
    .then((query) => {
      console.log(query.hits.length);
      const recipes = query.hits;
      recipes.forEach((el) => {
        console.log(el.recipe.label);
      });
    });
  res.render('home');
});

module.exports = router;

// #########################################
// ##  Get Sort-string from Select-value  ##
// #########################################

function getSortString(formValue) {
  const valueMap = {
    'Ratings ▼': { ratings: -1 },
    'Ratings ▲': { ratings: 1 },
    'Cooking Time ▼': { cookingTime: -1 },
    'Cooking Time ▲': { cookingTime: 1 },
    'Date added ▼': { createdAt: -1 },
    'Date added ▲': { createdAt: 1 }
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
