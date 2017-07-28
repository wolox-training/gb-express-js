const orm = require('./../orm'),
  errors = require('../errors');

exports.create = (match) => {
  return orm.models.match.create(match).catch((err) => {
    throw errors.defaultError(err.message);
  });
};

exports.getHistory = (gameId, limit, offset) => {
  return orm.models.match.findAll({ limit, offset, where: { game_id: gameId } }).catch((err) => {
    throw errors.defaultError(err.message);
  });
};

exports.getUserHistory = (userId) => {
  return orm.models.match.findAll({ where: { user_id: userId } }).catch((err) => {
    throw errors.defaultError(err.message);
  });
};
