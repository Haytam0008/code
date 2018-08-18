(function () {
  'use strict';

  angular
    .module('paniers')
    .controller('PaniersListController', PaniersListController);

  PaniersListController.$inject = ['PaniersService'];

  function PaniersListController(PaniersService) {
    var vm = this;

    vm.paniers = PaniersService.query();
  }
}());
