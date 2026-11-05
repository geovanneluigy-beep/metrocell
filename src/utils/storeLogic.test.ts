import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isOutOfStock,
  decreaseStock,
  increaseStock,
  updateProductStock,
  formatBRL,
  generateWhatsAppBuyUrl,
  generateWhatsAppRepairUrl,
  filterProducts,
  getRepairEstimate,
} from './storeLogic';
import { Product } from '../types';

const sampleA10s: Product = {
  id: 'a10s-test',
  model: 'Samsung Galaxy A10s 32GB',
  brand: 'Samsung',
  condition: 'Seminovo Revisado',
  storage: '32GB',
  color: 'Azul',
  price: 420,
  stock: 1,
  image: '/src/assets/images/product_samsung_a10s_1793920766814.jpg',
  warranty: '3 meses garantia',
  itemsIncluded: ['Carregador', 'Cabo'],
};

test('isOutOfStock correctly flags 0 or negative stock', () => {
  assert.equal(isOutOfStock(sampleA10s), false);
  const out = { ...sampleA10s, stock: 0 };
  assert.equal(isOutOfStock(out), true);
});

test('decreaseStock reduces stock by 1 and clamps at 0', () => {
  const soldOnce = decreaseStock(sampleA10s, 1);
  assert.equal(soldOnce.stock, 0);
  assert.equal(isOutOfStock(soldOnce), true);

  // Trying to sell again doesn't go below 0
  const soldTwice = decreaseStock(soldOnce, 1);
  assert.equal(soldTwice.stock, 0);
});

test('increaseStock adds stock to product', () => {
  const replenished = increaseStock(sampleA10s, 2);
  assert.equal(replenished.stock, 3);
});

test('updateProductStock updates specific item in array', () => {
  const list = [sampleA10s, { ...sampleA10s, id: 'ip11', stock: 2 }];
  const updated = updateProductStock(list, 'a10s-test', 0);
  assert.equal(updated[0].stock, 0);
  assert.equal(updated[1].stock, 2);
});

test('formatBRL formats Brazilian Real currency', () => {
  const formatted = formatBRL(420);
  assert.match(formatted, /420/);
  assert.match(formatted, /R\$/);
});

test('generateWhatsAppBuyUrl formats message with model, price and stock status', () => {
  const url = generateWhatsAppBuyUrl('55 11 99999-8888', sampleA10s);
  assert.match(url, /https:\/\/wa\.me\/5511999998888/);
  assert.match(url, /Samsung%20Galaxy%20A10s%2032GB/);
});

test('generateWhatsAppRepairUrl formats repair quote with problem and model', () => {
  const url = generateWhatsAppRepairUrl('55 11 99999-8888', {
    brand: 'Samsung',
    model: 'Galaxy A10s',
    problem: 'Troca de Tela / Vidro quebrado',
    serviceType: 'balcao',
  });
  assert.match(url, /https:\/\/wa\.me\/5511999998888/);
  assert.match(url, /Galaxy%20A10s/);
  assert.match(url, /Troca%20de%20Tela/);
});

test('filterProducts filters by brand, search text and stock availability', () => {
  const list: Product[] = [
    sampleA10s,
    { ...sampleA10s, id: 'ip12', brand: 'Apple', model: 'iPhone 12 128GB', stock: 0, price: 2100 },
    { ...sampleA10s, id: 'moto', brand: 'Motorola', model: 'Moto G54 5G', stock: 3, price: 890 },
  ];

  // Brand filter
  const onlyApple = filterProducts(list, { brand: 'Apple' });
  assert.equal(onlyApple.length, 1);
  assert.equal(onlyApple[0].brand, 'Apple');

  // inStockOnly filter
  const inStock = filterProducts(list, { inStockOnly: true });
  assert.equal(inStock.length, 2);
  assert.equal(inStock.some((p) => p.id === 'ip12'), false);

  // Search filter
  const searched = filterProducts(list, { search: 'a10s' });
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'a10s-test');
});

test('getRepairEstimate provides realistic estimates for screen repair', () => {
  const est = getRepairEstimate('Troca de Tela frontal quebrou');
  assert.match(est.range, /R\$/);
  assert.match(est.time, /minutos/);
});
