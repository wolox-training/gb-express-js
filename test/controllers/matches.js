const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../../app'),
  sessionManager = require('./../../app/services/sessionManager'),
  matchesMailer = require('./../../app/services/matchesMailer'),
  { successfulLogin, successfulLoginNotAdmin } = require('./../utils'),
  sinon = require('sinon'),
  should = chai.should();

describe('matches controller', () => {
  describe('/games/:gameId/match POST', () => {
    it('should fail because of missing assertions attribute', (done) => {
      successfulLogin().then((res) => {
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
      successfulLogin().then((res) => {
        chai.request(server)
          .post('/games/2/match')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send({
            assertions: '7'
          })
          .then((response) => {
            response.body.should.have.property('game_id').and.be.equal(2);
            response.body.should.have.property('user_id').and.be.equal(1);
            response.body.should.have.property('assertions').and.be.equal(7);
            response.should.have.status(201);
            dictum.chai(response);
          })
          .then(() => {
            done();
          });
      });
    });
  });
  describe('/games/:gameId/match GET', () => {
    it('should be successful getting games list', (done) => {
      successfulLogin().then((res) => {
        chai.request(server)
          .get('/games/2/match')
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
    it('should be successful getting the list with 2 matches', (done) => {
      successfulLogin().then((res) => {
        chai.request(server)
          .get('/games/2/match?limit=2')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send()
          .then((response) => {
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.should.have.lengthOf(2);
            dictum.chai(response);
          })
          .then(() => {
            done();
          });
      }).catch((err) => {
        done(err);
      });
    });
    it('should be successful getting the list with only 1 match because of offset', (done) => {
      successfulLogin().then((res) => {
        chai.request(server)
          .get('/games/2/match?offset=1')
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
    it('should fail because of not being authenticated', (done) => {
      chai.request(server)
        .get('/games/2/match')
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
  });
  describe('/users/:userId/matches/emailSummary GET', () => {
    it('should be successful emailing the list of matches by user', (done) => {
      const sendUserHistory = sinon.spy(matchesMailer, 'sendUserHistory');
      successfulLogin().then((res) => {
        chai.request(server)
          .get('/users/1/matches/emailSummary')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send()
          .then((response) => {
            response.should.have.status(200);
            sendUserHistory.restore();
            sinon.assert.calledOnce(sendUserHistory);
            dictum.chai(response);
          })
          .then(() => {
            done();
          });
      }).catch((err) => {
        done(err);
      });
    });
    it('should be successful emailing the requested user history without being admin', (done) => {
      const sendUserHistory = sinon.spy(matchesMailer, 'sendUserHistory');
      successfulLoginNotAdmin().then((res) => {
        chai.request(server)
          .get('/users/2/matches/emailSummary')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send()
          .then((response) => {
            response.should.have.status(200);
            sendUserHistory.restore();
            sinon.assert.calledOnce(sendUserHistory);
            dictum.chai(response);
          })
          .then(() => {
            done();
          });
      }).catch((err) => {
        done(err);
      });
    });
    it('should fail because user is not admin and is requesting for anothed user_id', (done) => {
      const sendUserHistory = sinon.spy(matchesMailer, 'sendUserHistory');
      successfulLoginNotAdmin().then((res) => {
        chai.request(server)
          .get('/users/1/matches/emailSummary')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send()
          .catch((err) => {
            err.response.should.be.json;
            err.response.body.error.should.equal('User is not allowed');
            err.response.body.should.have.property('error');
            sinon.assert.notCalled(sendUserHistory);
            err.should.have.status(401);
          })
          .then(() => {
            done();
          });
      });
    });
  });
});

