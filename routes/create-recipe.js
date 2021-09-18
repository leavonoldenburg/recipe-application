const express = require('express');
const Recipe = require('./../models/recipe');
const upload = require('./../middleware/file-upload');

const routeGuardMiddleware = require('./../middleware/route-guard');
const recipeRouter = express.Router();

recipeRouter.get('/', routeGuardMiddleware, (req, res, next) => {
  res.render('create-recipe');
});

recipeRouter.post(
  '/',
  routeGuardMiddleware,
  upload.single('picture'),
  (req, res, next) => {
    const { title, ingredients, instructions } = req.body;
    let picture = req.file;
    Recipe.create({
      title,
      ingredients,
      instructions
    }).then(() => {
      res.redirect('/');
    });
  }
);

module.exports = recipeRouter;
