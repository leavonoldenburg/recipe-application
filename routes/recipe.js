const express = require('express');
const Recipe = require('../models/recipe');
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
    const { title, ingredients, instructions } = req.body;
    const picture = req.file.path;
    Recipe.create({
      title,
      ingredients,
      instructions,
      picture
    }).then((recipe) => {
      res.redirect(`/recipe/${recipe._id}`);
    });
  }
);

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
