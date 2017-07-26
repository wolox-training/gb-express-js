const gameService = require('../services/games'),
  matchesService = require('../services/matches'),
  errors = require('../errors');

const gameValidation = (game) => {
  if (!game.score) {
    throw errors.validationError('Score is missing');
  }
  if (!game.name) {
    throw errors.validationError('Name is missing');
  }
};

const matchValidation = (match) => {
  if (!match.game_id) {
    throw errors.validationError('Game_id is missing');
  }
  if (!match.assertions) {
    throw errors.validationError('Assertions value is missing');
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

exports.createMatch = (req, res, next) => {
  const match = {
    user_id: req.user.id,
    game_id: req.params.game_id,
    assertions: req.body.assertions
  };
  matchValidation(match);
  matchesService.create(match).then((createdMatch) => {
    res.jsonp(createdMatch);
  }).catch((err) => {
    next(err);
  });
};
