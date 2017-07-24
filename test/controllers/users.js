const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../../app'),
  sessionManager = require('./../../app/services/sessionManager'),
  utils = require('./../utils'),
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
          err.response.body.error.should.equal('Validation error');
          err.response.body.should.have.property('error');
          err.should.have.status(500);
        })
        .then(() => done());
    });
    it('should be successful signing up', (done) => {
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
  describe('/users/sessions/renew POST', () => {
    it('should fail because header is not being sent', (done) => {
      chai.request(server)
        .post('/users/sessions/renew')
        .send()
        .catch((err) => {
          err.response.should.be.json;
          err.response.body.error.should.equal('User is not logged in');
          err.should.have.status(401);
        }).then(() => {
          done();
        });
    });
    it('should fail because renew_id is not being sent', (done) => {
      utils.successfulLogin().then((res) => {
        chai.request(server)
          .post('/users/sessions/renew')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send()
          .catch((err) => {
            err.response.body.error.should.equal('Invalid renewId');
            err.response.should.be.json;
            err.should.have.status(400);
          }).then(() => {
            done();
          });
      }).catch((err) => {
        done(err);
      });
    });
    it('should be successful getting a renewed id', (done) => {
      utils.successfulLogin().then((res) => {
        chai.request(server)
          .post('/users/sessions/renew')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send({ renew_id: res.headers.renewid })
          .then((response) => {
            response.should.be.status(200);
            response.headers.renewid.should.not.be.equal(res.headers.renewid);
            dictum.chai(response);
          }).then(() => {
            done();
          });
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe('/users GET', () => {
    it('should be successful getting the users list logged in', (done) => {
      utils.successfulLogin().then((res) => {
        chai.request(server)
          .get('/users/')
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
      }).catch((err) => {
        done(err);
      });
    });
    it('should be successful getting the list with 3 users', (done) => {
      utils.successfulLogin().then((res) => {
        chai.request(server)
          .get('/users?limit=3')
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
    it('should fail because of missing auth token', (done) => {
      utils.successfulLogin().then((res) => {
        chai.request(server)
          .get('/users/')
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
  describe('/admin/users POST', () => {
    it('should fail because the user is not an admin', (done) => {
      utils.successfulLoginNotAdmin().then((res) => {
        chai.request(server)
          .post('/admin/users/')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send({
            firstName: 'xxxxxx', lastName: 'zzzzzzzzz',
            password: '1234', email: '123456@wolox.com.ar'
          })
          .catch((err) => {
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            err.response.body.error.should.equal('User is not allowed');
            err.should.have.status(401);
          })
          .then((response) => {
            done();
          });
      }).catch((err) => {
        done(err);
      });
    });
    it('should be successful creating a new admin', (done) => {
      utils.successfulLogin().then((res) => {
        chai.request(server)
          .post('/admin/users/')
          .set(sessionManager.HEADER_NAME, res.headers.authorization)
          .send({
            firstName: 'xxxxxx', lastName: 'zzzzzzzzz',
            password: '12345678910', email: '123456@wolox.com.ar'
          })
          .then((response) => {
            response.body.isAdmin.should.be.true;
            response.should.have.status(201);
            dictum.chai(response);
          })
          .then(() => {
            done();
          });
      }).catch((err) => {
        done(err);
      });
    });
  });
});

