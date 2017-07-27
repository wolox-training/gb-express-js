'use strict';

const bcrypt = require('bcrypt'),
  orm = require('./../orm'),
  errors = require('../errors'),
  config = require('./../../config');

const saltRounds = parseInt(config.common.bcrypt.saltRounds) || 10;

exports.create = (user) => {
  return bcrypt.genSalt(saltRounds).then((authenticationCode) => {
    user.authenticationCode = authenticationCode;
    return bcrypt.hash(user.password, saltRounds).then((hash) => {
      user.password = hash;
      return orm.models.user.create(user).catch((err) => {
        throw errors.defaultError(err.message);
      });
    });
  }).catch((err) => {
    throw errors.defaultError(err);
  });
};

const getByEmail = (email) => {
  return orm.models.user.findOne({ where: { email } }).catch((err) => {
    throw errors.defaultError(err.message);
  });
};

exports.signin = (user) => {
  return getByEmail(user.email).then((foundUser) => {
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

const update = (user, newData) => {
  return user.update(newData).catch((err) => {
    throw errors.defaultError(err.errors);
  });
};

exports.getById = (id) => {
  return orm.models.user.findOne({ where: { id } }).catch((err) => {
    throw errors.defaultError(err.message);
  });
};

exports.signout = (user) => {
  return bcrypt.genSalt(saltRounds).then((authenticationCode) => {
    return update(user, { authenticationCode }).then((updatedUser) => {
      return updatedUser;
    });
  }).catch((err) => {
    throw errors.defaultError(err.message);
  });
};

exports.listAll = (limit, offset) => {
  return orm.models.user.findAll({ limit, offset }).catch((err) => {
    throw errors.defaultError(err.detail);
  });
};

exports.createOrUpdate = (user, newData) => {
  return getByEmail(user.email).then((foundUser) => {
    if (foundUser) {
      return update(foundUser, newData);
    } else {
      Object.assign(user, newData);
      return exports.create(user);
    }
  }).catch((err) => {
    throw errors.defaultError(err.message);
  });
};
