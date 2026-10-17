const products = require('../../src/data/products');
const { getProductById } = require('../../src/catalog');

describe('getProductById', () => {
  test.todo('ID 1 возвращает products[0]');
  test.todo('ID 4 возвращает products[3]');
  test.todo('ID 6 возвращает products[5]');
  test.todo('ID 0 возвращает null');
  test.todo('ID 999 возвращает null');
  test.todo('ID -1 возвращает null');
  test.todo("строковый ID '1' возвращает null");
  test.todo('ID undefined возвращает null');
  test.todo('ID NaN возвращает null');
});
