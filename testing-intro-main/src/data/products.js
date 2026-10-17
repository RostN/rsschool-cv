const products = [
  { id: 1, name: 'Наушники', category: 'electronics', price: 49900, stock: 8 },
  { id: 2, name: 'Клавиатура', category: 'electronics', price: 35900, stock: 0 },
  { id: 3, name: 'JavaScript для начинающих', category: 'books', price: 18900, stock: 14 },
  { id: 4, name: 'Настольная лампа', category: 'home', price: 27900, stock: 3 },
  { id: 5, name: 'Чехол для ноутбука', category: 'home', price: 24900, stock: 6 },
  { id: 6, name: 'Чистый код', category: 'books', price: 21900, stock: 0 },
];

if (typeof module !== 'undefined') module.exports = products;
if (typeof window !== 'undefined') window.products = products;
