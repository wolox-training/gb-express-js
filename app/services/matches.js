'use strict';

const orm = require('./../orm'),
  errors = require('../errors');

exports.create = (match) => {
  return orm.models.match.create(match).catch((err) => {
    throw errors.defaultError(err.message);
  });
};
