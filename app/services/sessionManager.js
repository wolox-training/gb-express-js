const jwt = require('jwt-simple'),
  bcrypt = require('bcrypt'),
  moment = require('moment'),
  config = require('./../../config');

const SECRET = config.common.session.secret;
const saltRouds = 10;
const maxUsefulDays = 30;
const expirationDate = 2;

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
