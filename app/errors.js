
exports.notFound = {
  statusCode: 404,
  message: 'Not found'
};

exports.defaultError = (message) => {
  return {
    statusCode: 500,
    message
  };
};

exports.validationError = (message) => {
  return {
    statusCode: 400,
    message
  };
};

exports.noAuthorizationError = (message) => {
  return {
    statusCode: 401,
    message
  };
};
