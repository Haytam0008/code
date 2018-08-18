(function () {
  'use strict';

  angular
    .module('commandes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('commandes', {
        abstract: true,
        url: '/commandes',
        template: '<ui-view/>'
      })
      .state('commandes.list', {
        url: '',
        templateUrl: 'modules/commandes/views/list-commandes.client.view.html',
        controller: 'CommandesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Commandes List'
        }
      })
      .state('commandes.create', {
        url: '/create',
        templateUrl: 'modules/commandes/views/form-commande.client.view.html',
        controller: 'CommandesController',
        controllerAs: 'vm',
        resolve: {
          commandeResolve: newCommande
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Commandes Create'
        }
      })
      .state('commandes.edit', {
        url: '/:commandeId/edit',
        templateUrl: 'modules/commandes/views/form-commande.client.view.html',
        controller: 'CommandesController',
        controllerAs: 'vm',
        resolve: {
          commandeResolve: getCommande
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Commande {{ commandeResolve.name }}'
        }
      })
      .state('commandes.view', {
        url: '/:commandeId',
        templateUrl: 'modules/commandes/views/view-commande.client.view.html',
        controller: 'CommandesController',
        controllerAs: 'vm',
        resolve: {
          commandeResolve: getCommande
        },
        data: {
          pageTitle: 'Commande {{ commandeResolve.name }}'
        }
      });
  }

  getCommande.$inject = ['$stateParams', 'CommandesService'];

  function getCommande($stateParams, CommandesService) {
    return CommandesService.get({
      commandeId: $stateParams.commandeId
    }).$promise;
  }

  newCommande.$inject = ['CommandesService'];

  function newCommande(CommandesService) {
    return new CommandesService();
  }
}());
