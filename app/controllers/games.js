const gameService = require('../services/games'),
  errors = require('../errors');

const gameValidation = (game) => {
  if (!game.score) {
    throw errors.validationError('Score is missing');
  }
  if (!game.name) {
    throw errors.validationError('Name is missing');
  }
};

exports.createGame = (req, res, next) => {
  const game = req.body ? req.body : {};
  gameValidation(game);
  gameService.create(game).then((createdGame) => {
    res.status(201);
    res.send(createdGame);
  }).catch((err) => {
    next(err);
  });
};

exports.list = (req, res, next) => {
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;
  gameService.listAll(limit, offset).then((games) => {
    res.jsonp(games);
  }).catch((err) => {
    next(err);
  });
};
