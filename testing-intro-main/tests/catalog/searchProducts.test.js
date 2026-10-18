const products = require('../../src/data/products');
const { searchProducts } = require('../../src/catalog');

describe('searchProducts', () => {
  test("'Наушники' возвращает товар с ID 1", () => {
    const result = searchProducts(products, 'Наушники');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([1]);
  });
  test("'Чистый код' возвращает товар с ID 6", () => {
    const result = searchProducts(products, 'Чистый код');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([6]);
  });
  test("'Настольная лампа' возвращает товар с ID 4", () => {
    const result = searchProducts(products, 'Настольная лампа');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([4]);
  });
  test("'javascript' возвращает товар с ID 3", () => {
    const result = searchProducts(products, 'javascript');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([3]);
  });
  test("'ЧЕХОЛ' возвращает товар с ID 5", () => {
    const result = searchProducts(products, 'ЧЕХОЛ');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([5]);
  });
  test("'наушники' возвращает товар с ID 1", () => {
    const result = searchProducts(products, 'наушники');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([1]);
  });
  test("пустая строка возвращает товары с ID [1, 2, 3, 4, 5, 6]", () => {
    const result = searchProducts(products, '');
    expect(result).toEqual(products);
  });
  test("строка из пробелов возвращает товары с ID [1, 2, 3, 4, 5, 6]", () => {
    const result = searchProducts(products, '   ');
    expect(result).toEqual(products);
  });
  test("'\\t\\n' возвращает товары с ID [1, 2, 3, 4, 5, 6]", () => {
    const result = searchProducts(products, '\t\n');
    expect(result).toEqual(products);
  });
});
