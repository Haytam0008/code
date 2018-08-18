'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Commande = mongoose.model('Commande'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  commande;

/**
 * Commande routes tests
 */
describe('Commande CRUD tests', function () {

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

    // Save a user to the test db and create new Commande
    user.save(function () {
      commande = {
        name: 'Commande name'
      };

      done();
    });
  });

  it('should be able to save a Commande if logged in', function (done) {
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

        // Save a new Commande
        agent.post('/api/commandes')
          .send(commande)
          .expect(200)
          .end(function (commandeSaveErr, commandeSaveRes) {
            // Handle Commande save error
            if (commandeSaveErr) {
              return done(commandeSaveErr);
            }

            // Get a list of Commandes
            agent.get('/api/commandes')
              .end(function (commandesGetErr, commandesGetRes) {
                // Handle Commandes save error
                if (commandesGetErr) {
                  return done(commandesGetErr);
                }

                // Get Commandes list
                var commandes = commandesGetRes.body;

                // Set assertions
                (commandes[0].user._id).should.equal(userId);
                (commandes[0].name).should.match('Commande name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Commande if not logged in', function (done) {
    agent.post('/api/commandes')
      .send(commande)
      .expect(403)
      .end(function (commandeSaveErr, commandeSaveRes) {
        // Call the assertion callback
        done(commandeSaveErr);
      });
  });

  it('should not be able to save an Commande if no name is provided', function (done) {
    // Invalidate name field
    commande.name = '';

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

        // Save a new Commande
        agent.post('/api/commandes')
          .send(commande)
          .expect(400)
          .end(function (commandeSaveErr, commandeSaveRes) {
            // Set message assertion
            (commandeSaveRes.body.message).should.match('Please fill Commande name');

            // Handle Commande save error
            done(commandeSaveErr);
          });
      });
  });

  it('should be able to update an Commande if signed in', function (done) {
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

        // Save a new Commande
        agent.post('/api/commandes')
          .send(commande)
          .expect(200)
          .end(function (commandeSaveErr, commandeSaveRes) {
            // Handle Commande save error
            if (commandeSaveErr) {
              return done(commandeSaveErr);
            }

            // Update Commande name
            commande.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Commande
            agent.put('/api/commandes/' + commandeSaveRes.body._id)
              .send(commande)
              .expect(200)
              .end(function (commandeUpdateErr, commandeUpdateRes) {
                // Handle Commande update error
                if (commandeUpdateErr) {
                  return done(commandeUpdateErr);
                }

                // Set assertions
                (commandeUpdateRes.body._id).should.equal(commandeSaveRes.body._id);
                (commandeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Commandes if not signed in', function (done) {
    // Create new Commande model instance
    var commandeObj = new Commande(commande);

    // Save the commande
    commandeObj.save(function () {
      // Request Commandes
      request(app).get('/api/commandes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Commande if not signed in', function (done) {
    // Create new Commande model instance
    var commandeObj = new Commande(commande);

    // Save the Commande
    commandeObj.save(function () {
      request(app).get('/api/commandes/' + commandeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', commande.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Commande with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/commandes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Commande is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Commande which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Commande
    request(app).get('/api/commandes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Commande with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Commande if signed in', function (done) {
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

        // Save a new Commande
        agent.post('/api/commandes')
          .send(commande)
          .expect(200)
          .end(function (commandeSaveErr, commandeSaveRes) {
            // Handle Commande save error
            if (commandeSaveErr) {
              return done(commandeSaveErr);
            }

            // Delete an existing Commande
            agent.delete('/api/commandes/' + commandeSaveRes.body._id)
              .send(commande)
              .expect(200)
              .end(function (commandeDeleteErr, commandeDeleteRes) {
                // Handle commande error error
                if (commandeDeleteErr) {
                  return done(commandeDeleteErr);
                }

                // Set assertions
                (commandeDeleteRes.body._id).should.equal(commandeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Commande if not signed in', function (done) {
    // Set Commande user
    commande.user = user;

    // Create new Commande model instance
    var commandeObj = new Commande(commande);

    // Save the Commande
    commandeObj.save(function () {
      // Try deleting Commande
      request(app).delete('/api/commandes/' + commandeObj._id)
        .expect(403)
        .end(function (commandeDeleteErr, commandeDeleteRes) {
          // Set message assertion
          (commandeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Commande error error
          done(commandeDeleteErr);
        });

    });
  });

  it('should be able to get a single Commande that has an orphaned user reference', function (done) {
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

          // Save a new Commande
          agent.post('/api/commandes')
            .send(commande)
            .expect(200)
            .end(function (commandeSaveErr, commandeSaveRes) {
              // Handle Commande save error
              if (commandeSaveErr) {
                return done(commandeSaveErr);
              }

              // Set assertions on new Commande
              (commandeSaveRes.body.name).should.equal(commande.name);
              should.exist(commandeSaveRes.body.user);
              should.equal(commandeSaveRes.body.user._id, orphanId);

              // force the Commande to have an orphaned user reference
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

                    // Get the Commande
                    agent.get('/api/commandes/' + commandeSaveRes.body._id)
                      .expect(200)
                      .end(function (commandeInfoErr, commandeInfoRes) {
                        // Handle Commande error
                        if (commandeInfoErr) {
                          return done(commandeInfoErr);
                        }

                        // Set assertions
                        (commandeInfoRes.body._id).should.equal(commandeSaveRes.body._id);
                        (commandeInfoRes.body.name).should.equal(commande.name);
                        should.equal(commandeInfoRes.body.user, undefined);

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
      Commande.remove().exec(done);
    });
  });
});
