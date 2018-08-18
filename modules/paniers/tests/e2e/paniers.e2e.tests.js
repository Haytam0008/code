'use strict';

describe('Paniers E2E Tests:', function () {
  describe('Test Paniers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/paniers');
      expect(element.all(by.repeater('panier in paniers')).count()).toEqual(0);
    });
  });
});
