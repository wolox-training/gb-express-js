const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

exports.successfulLogin = (cb) => {
  return chai.request(server)
    .post('/users/sessions')
    .send({ email: 'test@wolox.com.ar', password: '123456789' });
};
exports.successfulLoginNotAdmin = (cb) => {
  return chai.request(server)
    .post('/users/sessions')
    .send({ email: '2test2@wolox.com.ar', password: '123456789' });
};
