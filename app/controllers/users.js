'use strict';

const userService = require('../services/users'),
  sessionManager = require('../services/sessionManager'),
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

const userValidation = (user) => {
  emailValidation(user.email);
  passwordValidation(user.password);
  if (!user.firstName) {
    throw errors.validationError('The firstName is missing');
  }
  if (!user.lastName) {
    throw errors.validationError('The lastName is missing');
  }
};

exports.signup = (req, res, next) => {
  const newUser = req.body;
  userValidation(newUser);
  userService.create(newUser).then((createdUser) => {
    res.status(201);
    res.send(createdUser);
  }).catch((err) => {
    next(err);
  });
};

exports.signin = (req, res, next) => {
  const user = req.body ? req.body : {};
  emailValidation(user.email);
  userService.signin(user).then((signedInUser) => {
    sessionManager.generateTokenAccess(signedInUser).then((tokenAccess) => {
      res.status(200);
      res.set('renewId', tokenAccess.renewId);
      res.set('expirationDate', tokenAccess.expirationDate);
      res.set(sessionManager.HEADER_NAME, tokenAccess.token);
      res.end();
    });
  }).catch((err) => {
    next(err);
  });
};

exports.renew = (req, res, next) => {
  const user = req.user;
  const token = req.token;
  if (req.body.renew_id === token.renewId) {
    sessionManager.renewToken(user, token).then((tokenAccess) => {
      res.status(200);
      res.set('renewId', tokenAccess.renewId);
      res.set('expirationDate', tokenAccess.expirationDate);
      res.set(sessionManager.HEADER_NAME, tokenAccess.token);
      res.end();
    });
  } else {
    next(errors.validationError('Invalid renewId'));
  }
};

exports.list = (req, res, next) => {
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;
  userService.listAll(limit, offset).then((users) => {
    res.jsonp(users);
  }).catch((err) => {
    next(err);
  });
};

exports.signout = (req, res, next) => {
  userService.signout(req.user).then((signedOutUser) => {
    res.status(200);
    res.end();
  }).catch((err) => {
    next(err);
  });
};

exports.createAdmin = (req, res, next) => {
  const newUser = req.body;
  userValidation(newUser);
  userService.createOrUpdate(newUser, { isAdmin: true }).then((user) => {
    res.status(201);
    res.send(user);
  }).catch((err) => {
    next(err);
  });
};
