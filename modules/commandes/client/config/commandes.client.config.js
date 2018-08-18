(function () {
  'use strict';

  angular
    .module('commandes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Commandes',
      state: 'commandes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'commandes', {
      title: 'List Commandes',
      state: 'commandes.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'commandes', {
      title: 'Create Commande',
      state: 'commandes.create',
      roles: ['user']
    });
  }
}());
