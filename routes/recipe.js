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
    // const picture = req.file.path;
    Recipe.create({
      title,
      level,
      cookingTime,
      diet,
      cuisine,
      dishType,
      ingredients,
      instructions,
      // picture,
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

// recipeRouter.get('/newingredient', (req, res, next) => {
//   Ingredient.find({})
//     .then((ingredients) => {
//       res.render('ingredients', { ingredients });
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

// recipeRouter.post('/newingredient', (req, res, next) => {
//   console.log(req.body);
//   const ingredients = req.body.ingredients;
// const id = req.body._id;
// if (id) {
//   Ingredient.findByIdAndUpdate(id, {
//     $push: { name: { ingredients } }
//   });
// } else {
// Ingredient.create({
//   name: ingredients
// })
//   .then(() => {
//     res.redirect('/recipe/newingredient');
//   })
//   .catch((error) => {
//     next(error);
//   });
// }
// });

recipeRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Recipe.findById(id)
    .then((recipe) => {
      console.log(recipe);
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
