'use strict';

const express = require('express');
const router = express.Router();

router.get('/confirmation', (req, res, next) => {
  res.render('confirmation');
});

router.get('/', (req, res, next) => {
  res.render('home', { title: 'Hello World!' });
});

module.exports = router;
