const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('../../app'),
  userService = require('../../app/services/users'),
  should = chai.should();

describe('users controller', () => {
  describe('/users POST', () => {
    it('should fail because the password is too short', (done) => {
      chai.request(server)
        .post('/users')
        .send({
          firstName: 'xxxxxx', lastName: 'zzzzzzzzz',
          password: '1234', email: '123456@wolox.com.ar'
        })
        .catch((err) => {
          err.response.should.be.json;
          err.response.body.error.should.equal('The password is too short');
          err.response.body.should.have.property('error');
          err.should.have.status(400);
        })
        .then(() => {
          done();
        });
    });
    it('should fail because something is missing', (done) => {
      chai.request(server)
        .post('/users')
        .send({
          firstName: 'xxxxxx',
          password: '123456789', email: '123456@wolox.com.ar'
        })
        .catch((err) => {
          err.response.should.be.json;
          err.response.body.error.should.equal('The lastName is missing');
          err.response.body.should.have.property('error');
          err.should.have.status(400);
        })
        .then(() => {
          done();
        });
    });
    it('should fail because of existing email', (done) => {
      chai.request(server)
        .post('/users')
        .send({
          firstName: 'xxxxxx', lastName: 'yyyyyyy',
          password: '123456789', email: 'test@wolox.com.ar'
        })
        .catch((err) => {
          err.response.should.be.json;
          err.response.body.error.message.should.equal('Validation error');
          err.response.body.should.have.property('error');
          err.should.have.status(500);
        })
        .then(() => done());
    });
    it('should be successful', (done) => {
      chai.request(server)
        .post('/users')
        .send({
          firstName: 'aaaaa', lastName: 'bbbbb',
          password: '123456789', email: '12345@wolox.com.ar'
        })
        .then((res) => {
          res.should.have.status(201);
          dictum.chai(res);
        })
        .then(() => done());
    });
  });
  describe('/users/sessions POST', () => {
    it('should be successful signing in', (done) => {
      chai.request(server)
        .post('/users/sessions')
        .send({
          password: '123456789', email: 'test@wolox.com.ar'
        })
        .then((res) => {
          res.should.have.status(200);
          dictum.chai(res);
        })
        .then(() => done());
    });
    it('should fail signing in because of incorrect password', (done) => {
      chai.request(server)
        .post('/users/sessions')
        .send({
          password: 'abcdefghijk', email: 'test@wolox.com.ar'
        })
        .catch((err) => {
          err.response.should.be.json;
          err.response.body.error.should.equal('The password is incorrect');
          err.response.body.should.have.property('error');
          err.should.have.status(500);
        })
        .then(() => {
          done();
        });
    });
  });
});

