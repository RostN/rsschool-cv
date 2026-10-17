const {
  addToCart,
  changeQuantity,
  removeFromCart,
  calculateCartSubtotal,
  calculateOrderTotal,
} = require('../../src/cart');

const headphones = { id: 1, name: 'Наушники', price: 49900, stock: 8 };
const lamp = { id: 4, name: 'Настольная лампа', price: 27900, stock: 3 };

describe('addToCart', () => {
  test('добавляет товар в пустую корзину с указанным количеством', () => {
    expect(addToCart([], headphones, 2)).toEqual([{ ...headphones, quantity: 2 }]);
  });

  test('увеличивает количество уже добавленного товара', () => {
    const cart = [{ ...headphones, quantity: 1 }];
    expect(addToCart(cart, headphones, 2)).toEqual([{ ...headphones, quantity: 3 }]);
  });

  test('не принимает нулевое количество', () => {
    expect(() => addToCart([], headphones, 0)).toThrow(RangeError);
  });

  test('не позволяет добавить больше товара, чем есть на складе', () => {
    expect(() => addToCart([], lamp, 4)).toThrow(RangeError);
  });
});

describe('changeQuantity', () => {
  const cart = [{ ...headphones, quantity: 1 }];

  test('меняет количество товара в корзине', () => {
    expect(changeQuantity(cart, 1, 4)).toEqual([{ ...headphones, quantity: 4 }]);
  });

  test('не принимает нулевое количество', () => {
    expect(() => changeQuantity(cart, 1, 0)).toThrow(RangeError);
  });

  test('не позволяет указать количество больше остатка', () => {
    expect(() => changeQuantity(cart, 1, 9)).toThrow(RangeError);
  });

  test('оставляет корзину без изменений для отсутствующего товара', () => {
    expect(changeQuantity(cart, 999, 2)).toEqual(cart);
  });
});

describe('removeFromCart', () => {
  test('удаляет выбранный товар', () => {
    const cart = [{ ...headphones, quantity: 1 }, { ...lamp, quantity: 2 }];
    expect(removeFromCart(cart, 1)).toEqual([{ ...lamp, quantity: 2 }]);
  });

  test('возвращает пустую корзину после удаления единственного товара', () => {
    expect(removeFromCart([{ ...headphones, quantity: 1 }], 1)).toEqual([]);
  });

  test('не меняет состав корзины, если товара в ней нет', () => {
    const cart = [{ ...headphones, quantity: 1 }];
    expect(removeFromCart(cart, 999)).toEqual(cart);
  });
});

describe('calculateCartSubtotal', () => {
  test('возвращает ноль для пустой корзины', () => {
    expect(calculateCartSubtotal([])).toBe(0);
  });

  test('учитывает количество одного товара', () => {
    expect(calculateCartSubtotal([{ ...lamp, quantity: 2 }])).toBe(55800);
  });

  test('суммирует несколько разных товаров', () => {
    const cart = [{ ...headphones, quantity: 1 }, { ...lamp, quantity: 2 }];
    expect(calculateCartSubtotal(cart)).toBe(105700);
  });
});

describe('calculateOrderTotal', () => {
  test('добавляет доставку к маленькому заказу без промокода', () => {
    expect(calculateOrderTotal([{ ...lamp, quantity: 1 }], '')).toEqual({
      subtotal: 27900, discount: 0, delivery: 30000, total: 57900,
    });
  });

  test('делает доставку бесплатной при сумме от 50 000 копеек', () => {
    expect(calculateOrderTotal([{ ...headphones, quantity: 2 }], '')).toEqual({
      subtotal: 99800, discount: 0, delivery: 0, total: 99800,
    });
  });

  test('применяет SAVE10 к заказу от 20 000 копеек', () => {
    expect(calculateOrderTotal([{ ...headphones, quantity: 1 }], 'SAVE10')).toEqual({
      subtotal: 49900, discount: 4990, delivery: 30000, total: 74910,
    });
  });

  test('не применяет SAVE10 к заказу дешевле 20 000 копеек', () => {
    const product = { id: 9, name: 'Кабель', price: 19900, stock: 10, quantity: 1 };
    expect(calculateOrderTotal([product], 'SAVE10')).toEqual({
      subtotal: 19900, discount: 0, delivery: 30000, total: 49900,
    });
  });

  test('игнорирует неизвестный промокод', () => {
    expect(calculateOrderTotal([{ ...headphones, quantity: 1 }], 'HELLO')).toEqual({
      subtotal: 49900, discount: 0, delivery: 30000, total: 79900,
    });
  });
});
