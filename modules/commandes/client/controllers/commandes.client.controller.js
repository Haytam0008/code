(function () {
  'use strict';

  // Commandes controller
  angular
    .module('commandes')
    .controller('CommandesController', CommandesController);

  CommandesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'commandeResolve'];

  function CommandesController ($scope, $state, $window, Authentication, commande) {
    var vm = this;

    vm.authentication = Authentication;
    vm.commande = commande;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Commande
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.commande.$remove($state.go('commandes.list'));
      }
    }

    // Save Commande
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.commandeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.commande._id) {
        vm.commande.$update(successCallback, errorCallback);
      } else {
        vm.commande.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('commandes.view', {
          commandeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
