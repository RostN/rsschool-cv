const products = require('../../src/data/products');
const { sortProductsByPrice } = require('../../src/catalog');

describe('sortProductsByPrice', () => {
  test("все товары c 'asc' сортируются как [3, 6, 5, 4, 2, 1]", () => {
    const result = sortProductsByPrice(products, 'asc');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([3, 6, 5, 4, 2, 1]);
  });
  test('все товары без направления сортируются как [3, 6, 5, 4, 2, 1]', () => {
    const result = sortProductsByPrice(products);
    const ids = result.map(product => product.id);
    expect(ids).toEqual([3, 6, 5, 4, 2, 1]);
  });
  test("товары [1, 3, 4] c 'asc' сортируются как [3, 4, 1]", () => {
    const testProducts = products.filter(p => [1, 3, 4].includes(p.id));
    const result = sortProductsByPrice(testProducts, 'asc');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([3, 4, 1]);
  });
  test("все товары c 'desc' сортируются как [1, 2, 4, 5, 6, 3]", () => {
    const result = sortProductsByPrice(products, 'desc');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([1, 2, 4, 5, 6, 3]);
  });
  test("товары [3, 1, 4] c 'desc' сортируются как [1, 4, 3]", () => {
    const testProducts = products.filter(p => [1, 3, 4].includes(p.id));
    const result = sortProductsByPrice(testProducts, 'desc');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([1, 4, 3]);
  });
  test("товары [5, 2, 6] c 'desc' сортируются как [2, 5, 6]", () => {
    const testProducts = products.filter(p => [2, 5, 6].includes(p.id));
    const result = sortProductsByPrice(testProducts, 'desc');
    const ids = result.map(product => product.id);
    expect(ids).toEqual([2, 5, 6]);
  });
  test("'asc' не меняет исходный массив [1, 3, 4]", () => {
    const testProducts = products.filter(p => [1, 3, 4].includes(p.id));
    const originalIds = testProducts.map(p => p.id);
    sortProductsByPrice(testProducts, 'asc');
    const finalIds = testProducts.map(p => p.id);
    expect(finalIds).toEqual(originalIds);
  });
  test("'desc' не меняет исходный массив [1, 3, 4]", () => {
    const testProducts = products.filter(p => [1, 3, 4].includes(p.id));
    const originalIds = testProducts.map(p => p.id);
    sortProductsByPrice(testProducts, 'desc');
    const finalIds = testProducts.map(p => p.id);
    expect(finalIds).toEqual(originalIds);
  });
  test('направление по умолчанию не меняет исходный массив всех товаров', () => {
    const originalIds = products.map(p => p.id);
    sortProductsByPrice(products);
    const finalIds = products.map(p => p.id);
    expect(finalIds).toEqual(originalIds);
  });
});
