function filterByCategory(products, category) {
  if (!category || category === 'all') return [...products];
  return products.filter((product) => product.category === category);
}

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [...products];
  return products.filter((product) => product.name.toLowerCase().includes(normalizedQuery));
}

function sortProductsByPrice(products, direction = 'asc') {
  const multiplier = direction === 'desc' ? -1 : 1;
  return [...products].sort((first, second) => (first.price - second.price) * multiplier);
}

function getAvailableProducts(products) {
  return products.filter((product) => product.stock > 0);
}

function getProductById(products, id) {
  return products.find((product) => product.id === id) || null;
}

const catalogApi = { filterByCategory, searchProducts, sortProductsByPrice, getAvailableProducts, getProductById };

if (typeof module !== 'undefined') module.exports = catalogApi;
if (typeof window !== 'undefined') window.catalogApi = catalogApi;
