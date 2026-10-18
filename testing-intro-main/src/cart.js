function notImplemented() {
  throw new Error('Корзина ещё не реализована. Сначала прочитайте тесты.');
}

function addToCart(cart, product, quantity) {
  if (quantity <= 0) {
    throw new RangeError('Количество должно быть больше нуля');
  }
  const existingItem = cart.find(item => item.id === product.id);
  const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
  const newQuantity = currentQuantityInCart + quantity;
  if (newQuantity > product.stock) {
    throw new RangeError('Недостаточно товара на складе');
  }
  if (existingItem) {
    return cart.map(item => 
      item.id === product.id 
        ? { ...item, quantity: newQuantity } 
        : item
    );
  } else {
    return [...cart, { ...product, quantity }];
  }
}

function changeQuantity(cart, productId, newQuantity) {
  if (newQuantity <= 0) {
    throw new RangeError('Количество должно быть больше нуля');
  }
  const item = cart.find(product => product.id === productId);
  if (!item) {
    return [...cart];
  }
  if (newQuantity > item.stock) {
    throw new RangeError('Недостаточно товара на складе');
  }
  return cart.map(product =>
    product.id === productId
      ? { ...product, quantity: newQuantity }
      : product
  );
}

function removeFromCart(cart, productId) {
  return cart.filter(product => product.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateOrderTotal(cart, promoCode = '') {
  const subtotal = calculateCartSubtotal(cart);
  let discount = 0;
  if (promoCode === 'SAVE10' && subtotal >= 20000) {
    discount = subtotal * 0.1;
  }
  const delivery = subtotal >= 50000 ? 0 : 30000;
  const total = subtotal - discount + delivery;
  return {
    subtotal,
    discount,
    delivery,
    total
  };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;