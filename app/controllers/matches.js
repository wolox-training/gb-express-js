const matchesService = require('../services/matches'),
  matchesMailer = require('../services/matchesMailer'),
  errors = require('../errors');

const gameIdValidation = (gameId) => {
  if (!gameId) {
    throw errors.validationError('Game_id is missing');
  }
};

const matchValidation = (match) => {
  gameIdValidation(match.game_id);
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

exports.getMatchHistory = (req, res, next) => {
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;
  const gameId = req.params.game_id;
  gameIdValidation(gameId);
  matchesService.getHistory(gameId, limit, offset).then((history) => {
    res.jsonp(history);
  }).catch((err) => {
    next(err);
  });
};

exports.sendMailOfUserHistory = (req, res, next) => {
  const user = req.user;
  if (!user.isAdmin && parseInt(req.params.user_id) !== user.id) {
    next(errors.noAuthorizationError('User is not allowed'));
  } else {
    matchesMailer.sendUserHistory(user, req.params.user_id);
    res.send('Sending email');
  }
};
