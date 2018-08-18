(function () {
  'use strict';

  angular
    .module('commandes')
    .controller('CommandesListController', CommandesListController);

  CommandesListController.$inject = ['CommandesService'];

  function CommandesListController(CommandesService) {
    var vm = this;

    vm.commandes = CommandesService.query();
  }
}());
