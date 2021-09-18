const express = require('express');
const Recipe = require('./../models/recipe');
//const upload = require('./../middleware/file-upload');

const routeGuardMiddleware = require('./../middleware/route-guard');
const recipeRouter = express.Router();

recipeRouter.get('/', routeGuardMiddleware, (req, res, next) => {
  res.render('create-recipe');
});

recipeRouter.post('/', routeGuardMiddleware, (req, res, next) => {
  res.render('/create-recipe');
});

module.exports = recipeRouter;
