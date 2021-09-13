'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,  
    required: true

  },

name: {
    type: String,
    trim: true,
    required: true

  },

  lastName: {
    type: String,
    trim: true,
    required: true

  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },

  picture: {
    type: String
  },

  passwordHashAndSalt: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;



// ref: own recipes

// ref: own comments