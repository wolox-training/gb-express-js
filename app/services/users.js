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
    throw errors.defaultError(err.detail);
  });
};
