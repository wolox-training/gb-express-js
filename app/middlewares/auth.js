const errors = require('../errors'),
  userService = require('../services/users'),
  sessionManager = require('../services/sessionManager'),
  moment = require('moment');

exports.isAuthenticated = (req, res, next) => {
  const usersToken = req.headers[sessionManager.HEADER_NAME];
  if (usersToken) {
    const user = sessionManager.decode(usersToken);
    userService.getById(user.id).then((foundUser) => {
      if (foundUser && foundUser.authenticationCode === user.authenticationCode && moment().isBefore(user.expirationDate)
        && moment().isBefore(user.maximumUsefulDate)) {
        req.user = foundUser;
        next();
      } else {
        next(errors.noAuthorizationError('User is not logged in'));
      }
    }).catch((err) => {
      next(err);
    });
  } else {
    next(errors.noAuthorizationError('User is not logged in'));
  }
};
