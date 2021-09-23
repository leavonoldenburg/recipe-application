'use strict';

const express = require('express');
const Recipe = require('../models/recipe');
const aboutRouter = express.Router();

aboutRouter.get('/', (req, res, next) => {
  res.render('about');
});

aboutRouter.post('/', (req, res, next) => {
  res.render('about');
});

module.exports = aboutRouter;
