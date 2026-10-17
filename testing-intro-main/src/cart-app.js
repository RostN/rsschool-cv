const formatPrice = (price) => `${(price / 100).toLocaleString('ru-RU')} ₽`;
let cart = [];

const productsToAdd = document.querySelector('#products-to-add');
const cartItems = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const promoInput = document.querySelector('#promo-code');
const cartStatus = document.querySelector('#cart-status');

function showError(error) { cartStatus.textContent = error.message; }

function render() {
  productsToAdd.innerHTML = products.map((product) => `
    <article class="card"><h3>${product.name}</h3><p class="price">${formatPrice(product.price)}</p>
    <button data-add="${product.id}" ${product.stock ? '' : 'disabled'}>${product.stock ? 'Добавить' : 'Нет в наличии'}</button></article>
  `).join('');

  cartItems.innerHTML = cart.length ? cart.map((item) => `
    <div class="cart-row"><div><strong>${item.name}</strong><p>${formatPrice(item.price)} × ${item.quantity}</p></div>
    <div class="cart-actions"><button data-decrease="${item.id}">−</button><button data-increase="${item.id}">+</button><button data-remove="${item.id}">Удалить</button></div></div>
  `).join('') : '<p>Корзина пуста.</p>';

  try {
    const total = cartApi.calculateOrderTotal(cart, promoInput.value);
    cartTotal.innerHTML = `Товары: ${formatPrice(total.subtotal)}<br>Скидка: −${formatPrice(total.discount)}<br>Доставка: ${formatPrice(total.delivery)}<br><strong>Итого: ${formatPrice(total.total)}</strong>`;
  } catch (error) { cartTotal.textContent = 'Итог появится после реализации функций корзины.'; }
}

document.addEventListener('click', (event) => {
  const id = Number(event.target.dataset.add || event.target.dataset.increase || event.target.dataset.decrease || event.target.dataset.remove);
  if (!id) return;
  const product = products.find((item) => item.id === id);
  try {
    cartStatus.textContent = '';
    if (event.target.dataset.add) cart = cartApi.addToCart(cart, product, 1);
    if (event.target.dataset.increase) cart = cartApi.changeQuantity(cart, id, cart.find((item) => item.id === id).quantity + 1);
    if (event.target.dataset.decrease) cart = cartApi.changeQuantity(cart, id, cart.find((item) => item.id === id).quantity - 1);
    if (event.target.dataset.remove) cart = cartApi.removeFromCart(cart, id);
    render();
  } catch (error) { showError(error); }
});

promoInput.addEventListener('input', render);
render();
