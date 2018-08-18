// Paniers service used to communicate Paniers REST endpoints
(function () {
  'use strict';

  angular
    .module('paniers')
    .factory('PaniersService', PaniersService);

  PaniersService.$inject = ['$resource'];

  function PaniersService($resource) {
    return $resource('api/paniers/:panierId', {
      panierId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
