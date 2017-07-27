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
      data.push(db.models.game.create({
        name: 'Age of Empires I',
        score: 100
      }));
      data.push(db.models.game.create({
        name: 'Age of Empires II',
        score: 125
      }));
      data.push(db.models.game.create({
        name: 'Age of Empires III',
        score: 150
      }));
      data.push(db.models.game.create({
        name: 'Age of Empires IV',
        score: 175
      }));
      return Promise.all(data);
    });
  });
};
