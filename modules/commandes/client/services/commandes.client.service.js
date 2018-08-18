// Commandes service used to communicate Commandes REST endpoints
(function () {
  'use strict';

  angular
    .module('commandes')
    .factory('CommandesService', CommandesService);

  CommandesService.$inject = ['$resource'];

  function CommandesService($resource) {
    return $resource('api/commandes/:commandeId', {
      commandeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
