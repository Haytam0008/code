(function () {
  'use strict';

  angular
    .module('paniers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Paniers',
      state: 'paniers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'paniers', {
      title: 'List Paniers',
      state: 'paniers.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'paniers', {
      title: 'Create Panier',
      state: 'paniers.create',
      roles: ['user']
    });
  }
}());
