'use strict';

const userService = require('../services/users'),
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
  if (!validateEmail(email)) {
    throw errors.validationError('The requested email is not a valid email');
  } else if (email.indexOf('@wolox.com.ar') < 0) {
    throw errors.validationError('The requested email is not a Wolox email');
  }
};

const passwordValidation = (password) => {
  if (!checkAlphanumeric(password)) {
    throw errors.validationError('The password must be alphanumeric');
  } else if (password.length < 8) {
    throw errors.validationError('The password is too short');
  }
};

exports.signup = (req, res, next) => {
  const newUser = req.body;
  emailValidation(newUser.email);
  passwordValidation(newUser.password);
  userService.create(newUser).then((createdUser) => {
    res.status(201);
    res.send(createdUser);
  }).catch((err) => {
    next(err);
  });
};
