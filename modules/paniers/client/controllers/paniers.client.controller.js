(function () {
  'use strict';

  // Paniers controller
  angular
    .module('paniers')
    .controller('PaniersController', PaniersController);

  PaniersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'panierResolve'];

  function PaniersController ($scope, $state, $window, Authentication, panier) {
    var vm = this;

    vm.authentication = Authentication;
    vm.panier = panier;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Panier
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.panier.$remove($state.go('paniers.list'));
      }
    }

    // Save Panier
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.panierForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.panier._id) {
        vm.panier.$update(successCallback, errorCallback);
      } else {
        vm.panier.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('paniers.view', {
          panierId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
