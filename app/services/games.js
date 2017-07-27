const orm = require('./../orm'),
  errors = require('../errors');

exports.create = (game) => {
  return orm.models.game.create(game).catch((err) => {
    throw errors.defaultError(err.message);
  });
};
