const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../../app'),
  gameService = require('./../../app/services/games'),
  sessionManager = require('./../../app/services/sessionManager'),
  utils = require('./../utils'),
  should = chai.should();

describe('games controller', () => {
  describe('/games POST', () => {
    it('should fail because user is not admin', (done) => {
      utils.successfulLoginNotAdmin().then((res) => {
        chai.request(server)
          .post('/games')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send({
            name: 'Counter strike', score: '50'
          })
          .catch((err) => {
            err.response.should.be.json;
            err.response.body.error.should.equal('User is not allowed');
            err.response.body.should.have.property('error');
            err.should.have.status(401);
          })
          .then(() => {
            done();
          });
      });
    });
    it('should fail because something is missing', (done) => {
      utils.successfulLogin().then((res) => {
        chai.request(server)
          .post('/games')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send({
            name: 'Counter strike'
          })
          .catch((err) => {
            err.response.should.be.json;
            err.response.body.error.should.equal('Score is missing');
            err.response.body.should.have.property('error');
            err.should.have.status(400);
          })
          .then(() => {
            done();
          });
      });
    });
    it('should be successful creating a new game', (done) => {
      utils.successfulLogin().then((res) => {
        chai.request(server)
          .post('/games')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send({
            name: 'Counter strike', score: '50'
          })
          .then((response) => {
            response.should.have.status(201);
            dictum.chai(response);
          })
          .then(() => {
            done();
          });
      });
    });
  });
});
