const express = require('express');
const User = require('../models/user');
const routeGuardMiddleware = require('../middleware/route-guard');
//const upload = require('../middleware/file-upload');

const usersRouter = express.Router();

usersRouter.get('/', routeGuardMiddleware, (req, res, next) => {
  User.find()
    .then((users) => {
      res.render('users', { users });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = usersRouter;
