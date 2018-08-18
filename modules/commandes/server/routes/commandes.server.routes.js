'use strict';

/**
 * Module dependencies
 */
var commandesPolicy = require('../policies/commandes.server.policy'),
  commandes = require('../controllers/commandes.server.controller');

module.exports = function(app) {
  // Commandes Routes
  app.route('/api/commandes').all(commandesPolicy.isAllowed)
    .get(commandes.list)
    .post(commandes.create);

  app.route('/api/commandes/:commandeId').all(commandesPolicy.isAllowed)
    .get(commandes.read)
    .put(commandes.update)
    .delete(commandes.delete);

  // Finish by binding the Commande middleware
  app.param('commandeId', commandes.commandeByID);
};
