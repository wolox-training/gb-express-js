const chai = require('chai'),
  server = require('./../app');

exports.successfulLogin = () => {
  return chai.request(server)
    .post('/users/sessions')
    .send({ email: 'test@wolox.com.ar', password: '123456789' });
};
exports.successfulLoginNotAdmin = () => {
  return chai.request(server)
    .post('/users/sessions')
    .send({ email: '2test2@wolox.com.ar', password: '123456789' });
};
