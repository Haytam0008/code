'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Panier = mongoose.model('Panier'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Panier
 */
exports.create = function(req, res) {
  var panier = new Panier(req.body);
  panier.user = req.user;

  panier.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(panier);
    }
  });
};

/**
 * Show the current Panier
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var panier = req.panier ? req.panier.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  panier.isCurrentUserOwner = req.user && panier.user && panier.user._id.toString() === req.user._id.toString();

  res.jsonp(panier);
};

/**
 * Update a Panier
 */
exports.update = function(req, res) {
  var panier = req.panier;

  panier = _.extend(panier, req.body);

  panier.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(panier);
    }
  });
};

/**
 * Delete an Panier
 */
exports.delete = function(req, res) {
  var panier = req.panier;

  panier.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(panier);
    }
  });
};

/**
 * List of Paniers
 */
exports.list = function(req, res) {
  Panier.find().sort('-created').populate('user', 'displayName').exec(function(err, paniers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paniers);
    }
  });
};

/**
 * Panier middleware
 */
exports.panierByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Panier is invalid'
    });
  }

  Panier.findById(id).populate('user', 'displayName').exec(function (err, panier) {
    if (err) {
      return next(err);
    } else if (!panier) {
      return res.status(404).send({
        message: 'No Panier with that identifier has been found'
      });
    }
    req.panier = panier;
    next();
  });
};
