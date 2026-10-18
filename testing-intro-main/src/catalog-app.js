const formatPrice = (price) => `${(price / 100).toLocaleString('ru-RU')} ₽`;

const catalogElement = document.querySelector('#catalog');
const statusElement = document.querySelector('#catalog-status');
const searchInput = document.querySelector('#search');
const categorySelect = document.querySelector('#category');
const sortSelect = document.querySelector('#sort');

function renderCatalog() {
  let visibleProducts = catalogApi.filterByCategory(products, categorySelect.value);
  visibleProducts = catalogApi.searchProducts(visibleProducts, searchInput.value);
  visibleProducts = catalogApi.sortProductsByPrice(visibleProducts, sortSelect.value);

  statusElement.textContent = `Найдено товаров: ${visibleProducts.length}`;
  catalogElement.innerHTML = visibleProducts.map((product) => `
    <article class="card">
      <h3>${product.name}</h3>
      <p class="price">${formatPrice(product.price)}</p>
      <p>${product.stock ? `В наличии: ${product.stock}` : 'Нет в наличии'}</p>
    </article>
  `).join('');
}

[searchInput, categorySelect, sortSelect].forEach((element) => element.addEventListener('input', renderCatalog));
renderCatalog();
