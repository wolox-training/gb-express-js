exports.execute = (db) => {
  db.models.user.create({ firstName: 'test', lastName: 'wolox', password: '123456789', email: 'test@wolox.com.ar' }).then();
};
