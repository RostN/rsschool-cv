const products = require('../../src/data/products');
const { getAvailableProducts } = require('../../src/catalog');

describe('getAvailableProducts', () => {
  test('возвращает товар, если он есть в наличии', () => {
    const catalog = [{ id: 1, stock: 1 }];
    expect(getAvailableProducts(catalog)).toEqual([{ id: 1, stock: 1 }]);
  });

  test('исключает товары с нулевым остатком', () => {
    const catalog = [{ id: 1, stock: 2 }, { id: 2, stock: 0 }, { id: 3, stock: 5 }];
    expect(getAvailableProducts(catalog)).toEqual([{ id: 1, stock: 2 }, { id: 3, stock: 5 }]);
  });

  test('сохраняет порядок доступных товаров', () => {
    const catalog = [{ id: 3, stock: 4 }, { id: 1, stock: 2 }, { id: 2, stock: 0 }];
    expect(getAvailableProducts(catalog).map((product) => product.id)).toEqual([3, 1]);
  });

  test('возвращает пустой массив для пустого каталога', () => {
    expect(getAvailableProducts([])).toEqual([]);
  });

  test('возвращает пустой массив, если все товары закончились', () => {
    expect(getAvailableProducts([{ id: 1, stock: 0 }, { id: 2, stock: 0 }])).toEqual([]);
  });

  test('не считает нулевой остаток доступным', () => {
    expect(getAvailableProducts([{ id: 1, stock: 0 }])).toEqual([]);
  });

  test('не меняет исходный массив', () => {
    const catalog = [{ id: 1, stock: 2 }, { id: 2, stock: 0 }];
    getAvailableProducts(catalog);
    expect(catalog).toEqual([{ id: 1, stock: 2 }, { id: 2, stock: 0 }]);
  });

  test('возвращает новый массив', () => {
    const catalog = [{ id: 1, stock: 2 }];
    expect(getAvailableProducts(catalog)).not.toBe(catalog);
  });

  test('находит четыре доступных товара в стартовом каталоге', () => {
    expect(getAvailableProducts(products)).toHaveLength(4);
  });
});
