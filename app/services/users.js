'use strict';

const bcrypt = require('bcrypt'),
  orm = require('./../orm'),
  errors = require('../errors'),
  saltRounds = 10;

exports.create = (user) => {
  return bcrypt.hash(user.password, saltRounds).then((hash) => {
    user.password = hash;
    return orm.models.user.create(user).catch((err) => {
      throw errors.defaultError(err.message);
    });
  }).catch((err) => {
    throw errors.defaultError(err);
  });
};

exports.getByEmail = (email) => {
  return orm.models.user.findOne({ where: { email } }).catch((err) => {
    throw errors.defaultError(err.message);
  });
};

exports.signin = (user) => {
  return exports.getByEmail(user.email).then((foundUser) => {
    if (foundUser) {
      return bcrypt.compare(user.password, foundUser.password).then((match) => {
        if (match) {
          return foundUser;
        } else {
          throw errors.validationError('The password is incorrect');
        }
      });
    } else {
      throw errors.validationError('Requested email doesn\'t exist');
    }
  }).catch((err) => {
    throw errors.defaultError(err.message);
  });
};
