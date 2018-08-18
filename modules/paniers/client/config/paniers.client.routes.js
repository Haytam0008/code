(function () {
  'use strict';

  angular
    .module('paniers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('paniers', {
        abstract: true,
        url: '/paniers',
        template: '<ui-view/>'
      })
      .state('paniers.list', {
        url: '',
        templateUrl: 'modules/paniers/views/list-paniers.client.view.html',
        controller: 'PaniersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Paniers List'
        }
      })
      .state('paniers.create', {
        url: '/create',
        templateUrl: 'modules/paniers/views/form-panier.client.view.html',
        controller: 'PaniersController',
        controllerAs: 'vm',
        resolve: {
          panierResolve: newPanier
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Paniers Create'
        }
      })
      .state('paniers.edit', {
        url: '/:panierId/edit',
        templateUrl: 'modules/paniers/views/form-panier.client.view.html',
        controller: 'PaniersController',
        controllerAs: 'vm',
        resolve: {
          panierResolve: getPanier
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Panier {{ panierResolve.name }}'
        }
      })
      .state('paniers.view', {
        url: '/:panierId',
        templateUrl: 'modules/paniers/views/view-panier.client.view.html',
        controller: 'PaniersController',
        controllerAs: 'vm',
        resolve: {
          panierResolve: getPanier
        },
        data: {
          pageTitle: 'Panier {{ panierResolve.name }}'
        }
      });
  }

  getPanier.$inject = ['$stateParams', 'PaniersService'];

  function getPanier($stateParams, PaniersService) {
    return PaniersService.get({
      panierId: $stateParams.panierId
    }).$promise;
  }

  newPanier.$inject = ['PaniersService'];

  function newPanier(PaniersService) {
    return new PaniersService();
  }
}());
