const errors = require('../errors'),
  orm = require('../orm'),
  sessionManager = require('../services/sessionManager'),
  bcrypt = require('bcrypt'),
  moment = require('moment');

exports.isAuthenticated = (req, res, next) => {
  const usersToken = req.headers[sessionManager.HEADER_NAME];
  if (usersToken) {
    const user = sessionManager.decode(usersToken);
    orm.models.user.findOne({ where: { id: user.id } }).then((foundUser) => {
      if (foundUser && foundUser.authenticationCode === user.authenticationCode && moment().isBefore(user.expirationDate)
        && moment().isBefore(user.maximumUsefulDate)) {
        req.user = foundUser;
        next();
      } else {
        next(errors.defaultError('User is not logged in'));
      }
    }).catch((err) => {
      next(err);
    });
  } else {
    next(errors.defaultError('User is not logged in'));
  }
};
