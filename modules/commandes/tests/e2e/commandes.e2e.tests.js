'use strict';

describe('Commandes E2E Tests:', function () {
  describe('Test Commandes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/commandes');
      expect(element.all(by.repeater('commande in commandes')).count()).toEqual(0);
    });
  });
});
