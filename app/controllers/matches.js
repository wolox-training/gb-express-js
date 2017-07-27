const matchesService = require('../services/matches'),
  errors = require('../errors');

const matchValidation = (match) => {
  if (!match.game_id) {
    throw errors.validationError('Game_id is missing');
  }
  if (!match.assertions) {
    throw errors.validationError('Assertions value is missing');
  }
};

exports.createMatch = (req, res, next) => {
  const match = {
    user_id: req.user.id,
    game_id: req.params.game_id,
    assertions: req.body.assertions
  };
  matchValidation(match);
  matchesService.create(match).then((createdMatch) => {
    res.status(201);
    res.send(createdMatch);
  }).catch((err) => {
    next(err);
  });
};
