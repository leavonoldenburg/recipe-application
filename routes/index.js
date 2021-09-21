'use strict';

const express = require('express');
const Recipe = require('../models/recipe');
const router = express.Router();

router.get('/confirmation', (req, res, next) => {
  res.render('confirmation');
});

router.get('/', (req, res, next) => {
  Recipe.find()
    .then((recipes) => {
      console.log(recipes);
      res.render('home', { recipes });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
