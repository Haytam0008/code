(function () {
  'use strict';

  describe('Commandes Route Tests', function () {
    // Initialize global variables
    var $scope,
      CommandesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CommandesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CommandesService = _CommandesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('commandes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/commandes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CommandesController,
          mockCommande;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('commandes.view');
          $templateCache.put('modules/commandes/client/views/view-commande.client.view.html', '');

          // create mock Commande
          mockCommande = new CommandesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Commande Name'
          });

          // Initialize Controller
          CommandesController = $controller('CommandesController as vm', {
            $scope: $scope,
            commandeResolve: mockCommande
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:commandeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.commandeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            commandeId: 1
          })).toEqual('/commandes/1');
        }));

        it('should attach an Commande to the controller scope', function () {
          expect($scope.vm.commande._id).toBe(mockCommande._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/commandes/client/views/view-commande.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CommandesController,
          mockCommande;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('commandes.create');
          $templateCache.put('modules/commandes/client/views/form-commande.client.view.html', '');

          // create mock Commande
          mockCommande = new CommandesService();

          // Initialize Controller
          CommandesController = $controller('CommandesController as vm', {
            $scope: $scope,
            commandeResolve: mockCommande
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.commandeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/commandes/create');
        }));

        it('should attach an Commande to the controller scope', function () {
          expect($scope.vm.commande._id).toBe(mockCommande._id);
          expect($scope.vm.commande._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/commandes/client/views/form-commande.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CommandesController,
          mockCommande;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('commandes.edit');
          $templateCache.put('modules/commandes/client/views/form-commande.client.view.html', '');

          // create mock Commande
          mockCommande = new CommandesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Commande Name'
          });

          // Initialize Controller
          CommandesController = $controller('CommandesController as vm', {
            $scope: $scope,
            commandeResolve: mockCommande
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:commandeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.commandeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            commandeId: 1
          })).toEqual('/commandes/1/edit');
        }));

        it('should attach an Commande to the controller scope', function () {
          expect($scope.vm.commande._id).toBe(mockCommande._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/commandes/client/views/form-commande.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
