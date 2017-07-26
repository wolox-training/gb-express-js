const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../../app'),
  sessionManager = require('./../../app/services/sessionManager'),
  { successfulLogin, successfulLoginNotAdmin } = require('./../utils'),
  should = chai.should();

describe('games controller', () => {
  describe('/games POST', () => {
    it('should fail because user is not admin', (done) => {
      successfulLoginNotAdmin().then((res) => {
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
      successfulLogin().then((res) => {
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
      successfulLogin().then((res) => {
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
  describe('/games GET', () => {
    it('should be successful getting games list', (done) => {
      successfulLogin().then((res) => {
        chai.request(server)
          .get('/games')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send()
          .then((response) => {
            response.should.have.status(200);
            response.body.should.be.a('array');
            dictum.chai(response);
          })
          .then(() => {
            done();
          });
      });
    });
    it('should be successful getting the list with 3 games', (done) => {
      successfulLogin().then((res) => {
        chai.request(server)
          .get('/games?limit=3')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send()
          .then((response) => {
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.should.have.lengthOf(3);
            dictum.chai(response);
          })
          .then(() => {
            done();
          });
      }).catch((err) => {
        done(err);
      });
    });
    it('should be successful getting the list with only 1 game because of offset', (done) => {
      successfulLogin().then((res) => {
        chai.request(server)
          .get('/games?offset=3')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send()
          .then((response) => {
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.should.have.lengthOf(1);
            dictum.chai(response);
          })
          .then(() => {
            done();
          });
      }).catch((err) => {
        done(err);
      });
    });
    it('should fail because of missing auth token', (done) => {
      successfulLogin().then((res) => {
        chai.request(server)
          .get('/games')
          .send()
          .catch((err) => {
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            err.response.body.error.should.equal('User is not logged in');
            err.should.have.status(401);
          })
          .then((response) => {
            done();
          });
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe('/games/:gameId/match POST', () => {
    it('should fail because of missing assertions attribute', (done) => {
      utils.successfulLogin().then((res) => {
        chai.request(server)
          .post('/games/2/match')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send()
          .catch((err) => {
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            err.response.body.error.should.equal('Assertions value is missing');
            err.should.have.status(400);
          })
          .then((response) => {
            done();
          });
      }).catch((err) => {
        done(err);
      });
    });
    it('should fail because of not being authenticated', (done) => {
      chai.request(server)
        .post('/games/2/match')
        .send()
        .catch((err) => {
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          err.response.body.error.should.equal('User is not logged in');
          err.should.have.status(401);
        })
        .then((response) => {
          done();
        });
    });
    it('should be successful creating a new match', (done) => {
      utils.successfulLogin().then((res) => {
        chai.request(server)
          .post('/games/2/match')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send({
            assertions: '7'
          })
          .then((response) => {
            response.should.have.status(200);
            dictum.chai(response);
          })
          .then(() => {
            done();
          });
      });
    });
  });
});
