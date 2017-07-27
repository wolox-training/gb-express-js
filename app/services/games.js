const orm = require('./../orm'),
  errors = require('../errors');

exports.create = (game) => {
  return orm.models.game.create(game).catch((err) => {
    throw errors.defaultError(err.message);
  });
};

exports.listAll = (limit, offset) => {
  return orm.models.game.findAll({ limit, offset }).catch((err) => {
    throw errors.defaultError(err.message);
  });
};
