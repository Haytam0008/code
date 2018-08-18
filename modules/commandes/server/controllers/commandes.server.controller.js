'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Commande = mongoose.model('Commande'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Commande
 */
exports.create = function(req, res) {
  var commande = new Commande(req.body);
  commande.user = req.user;

  commande.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(commande);
    }
  });
};

/**
 * Show the current Commande
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var commande = req.commande ? req.commande.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  commande.isCurrentUserOwner = req.user && commande.user && commande.user._id.toString() === req.user._id.toString();

  res.jsonp(commande);
};

/**
 * Update a Commande
 */
exports.update = function(req, res) {
  var commande = req.commande;

  commande = _.extend(commande, req.body);

  commande.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(commande);
    }
  });
};

/**
 * Delete an Commande
 */
exports.delete = function(req, res) {
  var commande = req.commande;

  commande.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(commande);
    }
  });
};

/**
 * List of Commandes
 */
exports.list = function(req, res) {
  Commande.find().sort('-created').populate('user', 'displayName').exec(function(err, commandes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(commandes);
    }
  });
};

/**
 * Commande middleware
 */
exports.commandeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Commande is invalid'
    });
  }

  Commande.findById(id).populate('user', 'displayName').exec(function (err, commande) {
    if (err) {
      return next(err);
    } else if (!commande) {
      return res.status(404).send({
        message: 'No Commande with that identifier has been found'
      });
    }
    req.commande = commande;
    next();
  });
};
