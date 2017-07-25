const jwt = require('jwt-simple'),
  moment = require('moment'),
  bcrypt = require('bcrypt'),
  config = require('./../../config');

const SECRET = config.common.session.secret;
const maxUsefulDays = parseInt(config.common.session.maxUsefulDays) || 30;
const expirationDate = parseInt(config.common.session.expirationDate) || 2;
const saltRounds = parseInt(config.common.bcrypt.saltRounds) || 10;

exports.HEADER_NAME = config.common.session.header_name;

const getMaximumUsefulDate = () => {
  return moment().add(maxUsefulDays, 'days');
};

const getExpirationDate = () => {
  return moment().add(expirationDate, 'days');
};

exports.encode = (toEncode) => {
  return jwt.encode(toEncode, SECRET);
};

exports.decode = (toDecode) => {
  return jwt.decode(toDecode, SECRET);
};

exports.generateTokenAccess = (user, maximumUsefulDate = getMaximumUsefulDate()) => {
  const newExpirationDate = getExpirationDate();
  return bcrypt.genSalt(saltRounds).then((renewId) => {
    return {
      token: exports.encode({
        authenticationCode: user.authenticationCode,
        maximumUsefulDate,
        expirationDate: newExpirationDate,
        id: user.id,
        renewId
      }),
      renewId,
      expirationDate: newExpirationDate
    };
  });
};

exports.renewToken = (user, token) => {
  return exports.generateTokenAccess(user, token.maximumUsefulDate);
};
