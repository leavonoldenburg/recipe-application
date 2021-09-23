const express = require('express');
const Recipe = require('../models/recipe');
// const Ingredient = require('../models/ingredient');
const upload = require('../middleware/file-upload');

const routeGuardMiddleware = require('../middleware/route-guard');
const recipeRouter = express.Router();

recipeRouter.get('/create', routeGuardMiddleware, (req, res, next) => {
  res.render('recipe-create');
});

recipeRouter.post(
  '/create',
  routeGuardMiddleware,
  upload.single('picture'),
  (req, res, next) => {
    const {
      title,
      level,
      cookingTime,
      diet,
      cuisine,
      dishType,
      ingredients,
      instructions
    } = req.body;
    const picture = req.file.path;
    Recipe.create({
      title,
      level,
      cookingTime,
      diet,
      cuisine,
      dishType,
      ingredients,
      instructions,
      picture,
      creator: req.user._id
    })
      .then((recipe) => {
        res.redirect(`/recipe/${recipe._id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

recipeRouter.get('/:id/edit', (req, res, next) => {
  const { id } = req.params;
  let ingredients;
  Recipe.findById(id)
    .then((document) => {
      ingredients = document.ingredients;
      return Recipe.findById(id);
    })
    .then((recipe) => {
      res.render('recipe-edit', {
        recipe,
        ingredients
      });
    })
    .catch((error) => {
      next(error);
    });
});

recipeRouter.post('/:id/edit', (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    level,
    cookingTime,
    diet,
    cuisine,
    dishType,
    ingredients,
    instructions
  } = req.body;
  const picture = req.file.path;
  Recipe.findByIdAndUpdate(id, {
    title,
    level,
    cookingTime,
    diet,
    cuisine,
    dishType,
    ingredients,
    instructions,
    picture,
    creator: req.user._id
  })
    .then((recipe) => {
      res.redirect(`/recipe/${recipe._id}`);
    })
    .catch((error) => {
      next(error);
    });
});

recipeRouter.post('/:id/delete', (req, res, next) => {
  const { id } = req.params;
  Recipe.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

recipeRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Recipe.findById(id)
    .then((recipe) => {
      // const ownRecipe =
      //   req.user && String(req.user._id) === String(recipe._id);
      res.render('recipe-detail', {
        recipe
        // ownRecipe
      });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = recipeRouter;
