const matchesService = require('../services/matches'),
  emailSender = require('../services/emailSender'),
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

const matchesArrayToHtml = (array) => {
  let html = '';
  array.forEach((element) => {
    html += `<ul>
    <li> <b>user_id:</b> ${element.user_id} </li>
    <li> <b>game_id:</b> ${element.game_id} </li>
    <li> <b>assertions:</b> ${element.assertions} </li>
    </ul>
    </hr>`;
  });
  return html;
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

exports.getUserHistory = (req, res, next) => {
  const user = req.user;
  if (!user.isAdmin && parseInt(req.params.user_id) !== user.id) {
    next(errors.noAuthorizationError('User is not allowed'));
  } else {
    matchesService.getUserHistory(req.params.user_id).then((history) => {
      const mailOptions = {
        from: '"WoloxLand-Dev" <431fd78de2-a99c67@inbox.mailtrap.io>',
        to: user.email,
        subject: `Matches list for user_id: ${req.params.user_id}`,
        html: matchesArrayToHtml(history)
      };
      emailSender.sendMail(mailOptions);
      res.send(history);
    }).catch((err) => {
      next(err);
    });
  }
};
