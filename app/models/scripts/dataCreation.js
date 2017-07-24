const bcrypt = require('bcrypt');

exports.execute = (db) => {
  return bcrypt.hash('123456789', 10).then((password) => {
    return bcrypt.genSalt(10).then((authenticationCode) => {
      return db.models.user.create({
        firstName: 'test',
        lastName: 'wolox',
        password,
        email: 'test@wolox.com.ar',
        authenticationCode
      }).then();
    });
  });
};
