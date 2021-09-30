'use strict';

const express = require('express');
const Recipe = require('../models/recipe');
const routeGuardMiddleware = require('../middleware/route-guard');
const upload = require('../middleware/file-upload');
const router = express.Router();

const LocalStorage = require('node-localstorage').LocalStorage;
let localStorage = new LocalStorage('./scratch');

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

// ### GET API search route ###
router.get('/api-search', (req, res, next) => {
  const { searchRecipe } = req.query;
  client
    // Search api by hero search field
    .search({ query: searchRecipe, limit: { from: 0, to: 2 } })
    .then((query) => {
      const recipes_api = query.hits;
      if (localStorage.getItem('recipe') !== null) {
        localStorage.removeItem('recipe');
      }
      recipes_api.forEach((recipe) => {
        localStorage.setItem('recipe', JSON.stringify(recipe));
      });
      let localtest = JSON.parse(localStorage.getItem('recipe'));
      console.log(recipes_api);
      console.log(localtest);
      // console.log(recipes_api.length);
      // const recipes_api = JSON.parse(localStorage.getItem('recipe'));
      // Pass first 12 hits to view
      res.render('home', { recipes_api });
      // console.log(recipes_api[0]);
    })
    .catch((error) => {
      next(error);
    });
});

// ### POST API add recipe route ###
router.post(
  '/api/add-recipe',
  routeGuardMiddleware,
  upload.single('picture'),
  (req, res, next) => {
    let level;
    let { cookingTime } = req.body;
    cookingTime = cookingTime < 1 ? 1 : cookingTime;
    req.body.level = getApiLevel(req.body.cookingTime);
    req.body.diet = getApiDiet(req.body.diet);
    req.body.cuisine = getApiCuisine(req.body.cuisine, req.body.title);
    req.body.dishType = getApiDishType(req.body.dishType, req.body.title);
    // console.log(req.body);
    const {
      title,
      servings,
      diet,
      cuisine,
      dishType,
      ingredients,
      instructions,
      picture
    } = req.body;
    Recipe.create({
      title,
      cookingTime,
      servings,
      level,
      diet,
      cuisine,
      dishType,
      ingredients,
      instructions,
      picture,
      creator: req.user._id,
      ratings: 0
    })
      .then((recipe) => {
        res.redirect(`/recipe/${recipe._id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

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

// ###########################
// ##  API Calculate level  ##
// ###########################

function getApiLevel(time) {
  return time <= 30 ? 'Easy' : time <= 90 ? 'Intermediate' : 'Advanced';
}

// ####################
// ##  API Get diet  ##
// ####################

function getApiDiet(dietString) {
  const dietArr = dietString.split(',');
  const result = dietArr.filter(
    (el) =>
      el.toLowerCase() === 'pescatarian' ||
      el.toLowerCase() === 'vegetarian' ||
      el.toLowerCase() === 'vegan'
  );
  return !result.length ? ['Omnivore'] : result;
}

// #######################
// ##  API Get cuisine  ##
// #######################

function getApiCuisine(cuisineString, title) {
  const asian = [
    'asian',
    'chinese',
    'indian',
    'japanese',
    'kosher',
    'south east asian',
    'middle eastern'
  ];
  const american = ['american', 'caribbean', 'mexican', 'south american'];
  const european = [
    'british',
    'central europe',
    'eastern europe',
    'french',
    'italian',
    'mediterranean',
    'nordic'
  ];
  if (title.includes('Africa') || title.includes('Morocc')) return ['African'];
  if (asian.includes(cuisineString)) return ['Asian'];
  if (american.includes(cuisineString)) return ['American'];
  if (european.includes(cuisineString)) return ['European'];
}

// #########################
// ##  API Get dish type  ##
// #########################

function getApiDishType(dishType, title) {
  const appetizersStarters = [
    'alcohol-cocktail',
    'starter',
    'cereals',
    'drinks',
    'condiments and sauces',
    'omelet',
    'sandwiches'
  ];
  const soupsStews = ['soup'];
  const salads = ['salad'];
  const beansGrainsLegumes = ['egg', 'preps', 'preserve'];
  const desserts = ['dessert', 'desserts', 'biscuits and cookies', 'pancake'];
  const bakedGoods = ['bread'];
  // Catchwords dish types
  const casserolesGratins = [
    'gratin',
    'gratins',
    'casserole',
    'cornbake',
    'potpie',
    'souffle'
  ];
  const burgers = ['cheeseburger', 'burger', 'burgers'];
  const pizzas = ['pizza', 'pizzas', 'pizzadillas', 'stromboli', 'pizzagna'];
  const pastaNoodles = [
    'pasta',
    'spaghetti',
    'fettuccine',
    'penne',
    'carbonara',
    'mostaccioli',
    'gnocchi',
    'orecchiette',
    'noodles',
    'lasagna',
    'ziti',
    'ravioli',
    'rigatoni',
    'bolognese',
    'papardelle',
    'bucatini'
  ];
  const meatDishes = [
    'chicken',
    'lamb',
    'meat',
    'steak',
    'turkey',
    'bacon',
    'kebab',
    'legs',
    'chop',
    'duck',
    'pork',
    'ribs',
    'fish',
    'prawn',
    'roast'
  ];
  if (
    title
      .split(' ')
      .map((el) => el.toLowerCase())
      .filter((el) => burgers.includes(el)).length
  )
    return ['Burgers'];
  if (
    title
      .split(' ')
      .map((el) => el.toLowerCase())
      .filter((el) => casserolesGratins.includes(el)).length
  )
    return ['Casseroles & Gratins'];
  if (
    title
      .split(' ')
      .map((el) => el.toLowerCase())
      .filter((el) => pizzas.includes(el)).length
  )
    return ['Pizzas'];
  if (
    title
      .split(' ')
      .map((el) => el.toLowerCase())
      .filter((el) => pastaNoodles.includes(el)).length
  )
    return ['Pasta & Noodles'];
  if (
    title
      .split(' ')
      .map((el) => el.toLowerCase())
      .filter((el) => meatDishes.includes(el)).length
  )
    return ['Meat dishes'];
  if (appetizersStarters.includes(dishType.split(',')[0]))
    return ['Appetizers & Starters'];
  if (soupsStews.includes(dishType.split(',')[0])) return ['Soups & Stews'];
  if (salads.includes(dishType.split(',')[0])) return ['Salads'];
  if (desserts.includes(dishType.split(',')[0])) return ['Desserts'];
  if (bakedGoods.includes(dishType.split(',')[0])) return ['Baked Goods'];
  if (beansGrainsLegumes.includes(dishType.split(',')[0]))
    return ['Beans, Grains & Legumes'];
  return ['Meat dishes'];
}
