'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Panier = mongoose.model('Panier'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  panier;

/**
 * Panier routes tests
 */
describe('Panier CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Panier
    user.save(function () {
      panier = {
        name: 'Panier name'
      };

      done();
    });
  });

  it('should be able to save a Panier if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Panier
        agent.post('/api/paniers')
          .send(panier)
          .expect(200)
          .end(function (panierSaveErr, panierSaveRes) {
            // Handle Panier save error
            if (panierSaveErr) {
              return done(panierSaveErr);
            }

            // Get a list of Paniers
            agent.get('/api/paniers')
              .end(function (paniersGetErr, paniersGetRes) {
                // Handle Paniers save error
                if (paniersGetErr) {
                  return done(paniersGetErr);
                }

                // Get Paniers list
                var paniers = paniersGetRes.body;

                // Set assertions
                (paniers[0].user._id).should.equal(userId);
                (paniers[0].name).should.match('Panier name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Panier if not logged in', function (done) {
    agent.post('/api/paniers')
      .send(panier)
      .expect(403)
      .end(function (panierSaveErr, panierSaveRes) {
        // Call the assertion callback
        done(panierSaveErr);
      });
  });

  it('should not be able to save an Panier if no name is provided', function (done) {
    // Invalidate name field
    panier.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Panier
        agent.post('/api/paniers')
          .send(panier)
          .expect(400)
          .end(function (panierSaveErr, panierSaveRes) {
            // Set message assertion
            (panierSaveRes.body.message).should.match('Please fill Panier name');

            // Handle Panier save error
            done(panierSaveErr);
          });
      });
  });

  it('should be able to update an Panier if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Panier
        agent.post('/api/paniers')
          .send(panier)
          .expect(200)
          .end(function (panierSaveErr, panierSaveRes) {
            // Handle Panier save error
            if (panierSaveErr) {
              return done(panierSaveErr);
            }

            // Update Panier name
            panier.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Panier
            agent.put('/api/paniers/' + panierSaveRes.body._id)
              .send(panier)
              .expect(200)
              .end(function (panierUpdateErr, panierUpdateRes) {
                // Handle Panier update error
                if (panierUpdateErr) {
                  return done(panierUpdateErr);
                }

                // Set assertions
                (panierUpdateRes.body._id).should.equal(panierSaveRes.body._id);
                (panierUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Paniers if not signed in', function (done) {
    // Create new Panier model instance
    var panierObj = new Panier(panier);

    // Save the panier
    panierObj.save(function () {
      // Request Paniers
      request(app).get('/api/paniers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Panier if not signed in', function (done) {
    // Create new Panier model instance
    var panierObj = new Panier(panier);

    // Save the Panier
    panierObj.save(function () {
      request(app).get('/api/paniers/' + panierObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', panier.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Panier with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/paniers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Panier is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Panier which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Panier
    request(app).get('/api/paniers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Panier with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Panier if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Panier
        agent.post('/api/paniers')
          .send(panier)
          .expect(200)
          .end(function (panierSaveErr, panierSaveRes) {
            // Handle Panier save error
            if (panierSaveErr) {
              return done(panierSaveErr);
            }

            // Delete an existing Panier
            agent.delete('/api/paniers/' + panierSaveRes.body._id)
              .send(panier)
              .expect(200)
              .end(function (panierDeleteErr, panierDeleteRes) {
                // Handle panier error error
                if (panierDeleteErr) {
                  return done(panierDeleteErr);
                }

                // Set assertions
                (panierDeleteRes.body._id).should.equal(panierSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Panier if not signed in', function (done) {
    // Set Panier user
    panier.user = user;

    // Create new Panier model instance
    var panierObj = new Panier(panier);

    // Save the Panier
    panierObj.save(function () {
      // Try deleting Panier
      request(app).delete('/api/paniers/' + panierObj._id)
        .expect(403)
        .end(function (panierDeleteErr, panierDeleteRes) {
          // Set message assertion
          (panierDeleteRes.body.message).should.match('User is not authorized');

          // Handle Panier error error
          done(panierDeleteErr);
        });

    });
  });

  it('should be able to get a single Panier that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Panier
          agent.post('/api/paniers')
            .send(panier)
            .expect(200)
            .end(function (panierSaveErr, panierSaveRes) {
              // Handle Panier save error
              if (panierSaveErr) {
                return done(panierSaveErr);
              }

              // Set assertions on new Panier
              (panierSaveRes.body.name).should.equal(panier.name);
              should.exist(panierSaveRes.body.user);
              should.equal(panierSaveRes.body.user._id, orphanId);

              // force the Panier to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Panier
                    agent.get('/api/paniers/' + panierSaveRes.body._id)
                      .expect(200)
                      .end(function (panierInfoErr, panierInfoRes) {
                        // Handle Panier error
                        if (panierInfoErr) {
                          return done(panierInfoErr);
                        }

                        // Set assertions
                        (panierInfoRes.body._id).should.equal(panierSaveRes.body._id);
                        (panierInfoRes.body.name).should.equal(panier.name);
                        should.equal(panierInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Panier.remove().exec(done);
    });
  });
});
