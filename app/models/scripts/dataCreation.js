const bcrypt = require('bcrypt');

exports.execute = (db) => {
  const data = [];
  return bcrypt.hash('123456789', 10).then((password) => {
    return bcrypt.genSalt(10).then((authenticationCode) => {
      data.push(db.models.user.create({
        firstName: 'test',
        lastName: 'wolox',
        password,
        email: 'test@wolox.com.ar',
        authenticationCode,
        isAdmin: true
      }));
      data.push(db.models.user.create({
        firstName: '2test2',
        lastName: 'wolox2',
        password,
        email: '2test2@wolox.com.ar',
        authenticationCode,
        isAdmin: false
      }));
      data.push(db.models.user.create({
        firstName: '3test3',
        lastName: 'wolox3',
        password,
        email: '3test3@wolox.com.ar',
        authenticationCode,
        isAdmin: false
      }));
      data.push(db.models.user.create({
        firstName: '4test4',
        lastName: 'wolox4',
        password,
        email: '4test4@wolox.com.ar',
        authenticationCode,
        isAdmin: false
      }));
      return Promise.all(data);
    });
  });
};
