const products = require('../../src/data/products');
const { sortProductsByPrice } = require('../../src/catalog');

describe('sortProductsByPrice', () => {
  test.todo("все товары c 'asc' сортируются как [3, 6, 5, 4, 2, 1]");
  test.todo('все товары без направления сортируются как [3, 6, 5, 4, 2, 1]');
  test.todo("товары [1, 3, 4] c 'asc' сортируются как [3, 4, 1]");
  test.todo("все товары c 'desc' сортируются как [1, 2, 4, 5, 6, 3]");
  test.todo("товары [3, 1, 4] c 'desc' сортируются как [1, 4, 3]");
  test.todo("товары [5, 2, 6] c 'desc' сортируются как [2, 5, 6]");
  test.todo("'asc' не меняет исходный массив [1, 3, 4]");
  test.todo("'desc' не меняет исходный массив [1, 3, 4]");
  test.todo('направление по умолчанию не меняет исходный массив всех товаров');
});
