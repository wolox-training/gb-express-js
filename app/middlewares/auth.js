const errors = require('../errors'),
  userService = require('../services/users'),
  sessionManager = require('../services/sessionManager'),
  moment = require('moment');

exports.isAuthenticated = (req, res, next) => {
  const usersToken = req.headers[sessionManager.HEADER_NAME];
  if (usersToken) {
    const tokenPayload = sessionManager.decode(usersToken);
    userService.getById(tokenPayload.id).then((foundUser) => {
      if (foundUser && foundUser.authenticationCode === tokenPayload.authenticationCode
        && moment().isBefore(tokenPayload.expirationDate)
        && moment().isBefore(tokenPayload.maximumUsefulDate)) {
        req.token = tokenPayload;
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

exports.isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    next(errors.noAuthorizationError('User is not allowed'));
  }
};
