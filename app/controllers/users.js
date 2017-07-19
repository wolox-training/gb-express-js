'use strict';

const userService = require('../services/users'),
  sessionManager = require('../services/sessionManager'),
  bcrypt = require('bcrypt'),
  errors = require('../errors');

const checkAlphanumeric = (string) => {
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(string);
};

const validateEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

const emailValidation = (email) => {
  if (email) {
    if (!validateEmail(email)) {
      throw errors.validationError('The requested email is not a valid email');
    } else if (email.indexOf('@wolox.com.ar') < 0) {
      throw errors.validationError('The requested email is not a Wolox email');
    }
  } else {
    throw errors.validationError('The email is missing');
  }
};

const passwordValidation = (password) => {
  if (password) {
    if (!checkAlphanumeric(password)) {
      throw errors.validationError('The password must be alphanumeric');
    } else if (password.length < 8) {
      throw errors.validationError('The password is too short');
    }
  } else {
    throw errors.validationError('The password is missing');
  }
};

exports.signup = (req, res, next) => {
  const newUser = req.body;
  emailValidation(newUser.email);
  passwordValidation(newUser.password);
  if (!newUser.firstName) {
    throw errors.validationError('The firstName is missing');
  }
  if (!newUser.lastName) {
    throw errors.validationError('The lastName is missing');
  }
  userService.create(newUser).then((createdUser) => {
    res.status(201);
    res.send(createdUser);
  }).catch((err) => {
    next(err);
  });
};

exports.signin = (req, res, next) => {
  const user = req.body ? req.body : {};
  emailValidation(req.body.email);
  userService.getByEmail(user.email).then((foundUser) => {
    if (foundUser) {
      bcrypt.compare(user.password, foundUser.password).then((match) => {
        if (match) {
          const token = sessionManager.encode({ username: foundUser.email });
          res.status(200);
          res.set(sessionManager.HEADER_NAME, token);
          res.send(foundUser);
        } else {
          next(errors.defaultError('The password is incorrect'));
        }
      });
    } else {
      next(errors.defaultError('Requested email doesn\'t exist'));
    }
  }).catch((err) => {
    next(err);
  });
};
