import test from 'node:test';
import assert from 'node:assert/strict';
import { menu, filterMenu, cartTotal } from './menu.js';
test('Türkçe arama harf büyüklüğünden etkilenmez', () => {
  assert.equal(filterMenu('Tümü', 'İÇİ', false).some(item => item.id === 'cheesecake'), true);
  assert.equal(filterMenu('Tümü', 'somon', false)[0].id, 'salmon');
});
test('kategori, arama ve vejetaryen filtreleri birlikte uygulanır', () => {
  assert.deepEqual(filterMenu('Ana Yemekler', '', true).map(item => item.id), ['pasta']);
  assert.equal(filterMenu('Tatlılar', 'somon', false).length, 0);
  assert.equal(filterMenu('Tümü', '  ', false).length, menu.length);
});
test('sepet toplamı miktar ve ürün fiyatlarına göre hesaplanır', () => {
  assert.equal(cartTotal({ salmon: 2, lemonade: 1 }), 1280);
  assert.equal(cartTotal({}), 0);
  assert.equal(cartTotal({ unknown: 3 }), 0);
});
test('ürün kimlikleri benzersiz ve fiyatlar geçerlidir', () => {
  assert.equal(new Set(menu.map(item => item.id)).size, menu.length);
  assert.ok(menu.every(item => Number.isFinite(item.price) && item.price > 0));
});
