const jwt = require('jwt-simple'),
  moment = require('moment'),
  config = require('./../../config');

const SECRET = config.common.session.secret;
const maxUsefulDays = config.common.session.maxUsefulDays;
const expirationDate = config.common.session.expirationDate;

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

exports.generateTokenAccess = (user) => {
  return exports.encode({
    authenticationCode: user.authenticationCode,
    maximumUsefulDate: getMaximumUsefulDate(),
    expirationDate: getExpirationDate(),
    id: user.id
  });
};
