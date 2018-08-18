'use strict';

/**
 * Module dependencies
 */
var paniersPolicy = require('../policies/paniers.server.policy'),
  paniers = require('../controllers/paniers.server.controller');

module.exports = function(app) {
  // Paniers Routes
  app.route('/api/paniers').all(paniersPolicy.isAllowed)
    .get(paniers.list)
    .post(paniers.create);

  app.route('/api/paniers/:panierId').all(paniersPolicy.isAllowed)
    .get(paniers.read)
    .put(paniers.update)
    .delete(paniers.delete);

  // Finish by binding the Panier middleware
  app.param('panierId', paniers.panierByID);
};
