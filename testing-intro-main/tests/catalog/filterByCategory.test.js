const products = require('../../src/data/products');
const { filterByCategory } = require('../../src/catalog');

describe('filterByCategory', () => {
  test("'all' возвращает товары с ID [1, 2, 3, 4, 5, 6]", () => {
    const result = filterByCategory(products, 'all');
    expect(result).toEqual(products);
  });
  test("undefined возвращает товары с ID [1, 2, 3, 4, 5, 6]", () => {
    const result = filterByCategory(products, undefined);
    expect(result).toEqual(products);
  });
  test("пустая строка возвращает товары с ID [1, 2, 3, 4, 5, 6]",() => {
    const result = filterByCategory(products, '');
    expect(result).toEqual(products);
  });
  test("'electronics' возвращает товары с ID [1, 2]",() => {
    const result = filterByCategory(products, 'electronics');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([1, 2]);
  });
  test("'books' возвращает товары с ID [3, 6]",() => {
    const result = filterByCategory(products, 'books');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([3, 6]);
  });
  test("'home' возвращает товары с ID [4, 5]", () => {
    const result = filterByCategory(products, 'home');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([4, 5]);
  });
  test("'clothes' возвращает пустой массив", () => {
    const result = filterByCategory(products, 'clothes');
    expect(result).toEqual([]);
  });
  test("'toys' возвращает пустой массив", () => {
    const result = filterByCategory(products, 'toys');
    expect(result).toEqual([]);
  });
  test("'sports' возвращает пустой массив", () => {
    const result = filterByCategory(products, 'sports');
    expect(result).toEqual([]);
  });
});