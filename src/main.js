import QRCode from 'qrcode';
import { categories, menu, money, filterMenu, cartTotal } from './menu.js';
import './style.css';

let cart = {};
try {
  const saved = JSON.parse(localStorage.getItem('zeytin-cart') || '{}');
  for (const item of menu) if (Number.isInteger(saved?.[item.id]) && saved[item.id] > 0) cart[item.id] = Math.min(saved[item.id], 99);
} catch { /* Storage can be unavailable in private browsing. */ }
let category = 'Tümü';
let vegetarian = false;
let query = '';
const app = document.querySelector('#app');
app.innerHTML = `
  <header class="topbar"><a class="brand" href="./" aria-label="Zeytin ana sayfa"><span class="brand-icon">❧</span> zeytin<span class="brand-dot">.</span></a><div class="top-actions"><span class="open"><i></i> Mutfağımız açık</span><button class="qr-button" id="qr-open"><span aria-hidden="true">▦</span> QR Menü</button></div></header>
  <main><section class="hero"><div class="hero-copy"><span class="eyebrow">MEVSİMİN EN GÜZEL HALİ</span><h1>İyi yemek.<br>Güzel <em>anlar.</em></h1><p>Mevsiminden, toprağından, içimizden.<br>Özenle hazırladığımız lezzetleri keşfedin.</p><div class="hero-note"><span>✳</span> Taze malzemeler <b>·</b> Günlük hazırlık <b>·</b> Bolca sevgi</div></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><span class="herb herb-one">✦</span><span class="herb herb-two">✳</span><div class="plate"><div class="salad">🥗</div></div><div class="fresh-label">Her tabakta<br><strong>biraz mutluluk.</strong><span>↗</span></div></div></section>
  <section class="menu-section" aria-labelledby="menu-title"><div class="menu-heading"><div><span class="eyebrow">SOFRAMIZA HOŞ GELDİNİZ</span><h2 id="menu-title">Menümüz <span>Özenle, sizin için.</span></h2></div><label class="search"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Canınız ne çekiyor?" aria-label="Menüde ara" /></label></div><div class="filter-row"><nav id="categories" aria-label="Menü kategorileri"></nav><label class="vegetarian"><input type="checkbox" id="vegetarian" /> <span>❧</span> Vejetaryen</label></div><div class="results-line"><span id="result-count"></span><span>Fiyatlara KDV dahildir.</span></div><div id="products" class="products"></div></section>
  <section class="bottom-note"><span>❧</span><div><h3>İyi malzeme, iyi hissettirir.</h3><p>Alerjenler ve özel beslenme ihtiyaçlarınız için ekibimize danışabilirsiniz.</p></div></section></main>
  <footer><a class="brand" href="./">zeytin.</a><span>Güzel anlar sofrada başlar.</span><span>Demo restoran · Dijital menü</span></footer>
  <button class="cart-fab" id="cart-open" hidden><span>Sipariş listem <b id="cart-count">0</b></span><strong id="cart-total"></strong><span>↗</span></button>
  <dialog id="cart-dialog"><div class="dialog-heading"><div><span class="eyebrow">SOFRANIZ İÇİN</span><h2>Sipariş listem</h2></div><button class="close" data-close="cart-dialog" aria-label="Kapat">×</button></div><p class="dialog-info">Bu listeyi garsonunuza gösterin. Buradan sipariş veya ödeme gönderilmez.</p><div id="cart-items"></div><div class="cart-summary"><span>Toplam</span><strong id="dialog-total"></strong></div><button class="secondary" id="cart-clear">Listeyi temizle</button></dialog>
  <dialog id="qr-dialog"><div class="dialog-heading"><h2>Menüyü paylaş</h2><button class="close" data-close="qr-dialog" aria-label="Kapat">×</button></div><p class="dialog-info">Bu menüyü başka bir cihazda açmak için QR kodu okutun.</p><canvas id="qr-canvas"></canvas><p class="qr-warning" id="qr-warning"></p><button class="primary" id="copy-link">Menü bağlantısını kopyala</button><p class="status" id="copy-status" role="status"></p></dialog><div class="toast" role="status" id="toast"></div>`;

function renderProducts() {
  document.querySelector('#categories').innerHTML = categories.map(c => `<button class="category ${c === category ? 'active' : ''}" data-category="${c}" aria-pressed="${c === category}">${c}</button>`).join('');
  const items = filterMenu(category, query, vegetarian);
  document.querySelector('#result-count').textContent = `${items.length} lezzet sizi bekliyor`;
  document.querySelector('#products').innerHTML = items.length ? items.map(item => `<article class="product"><div class="food-art ${item.color}"><span class="food-emoji" aria-hidden="true">${item.emoji}</span>${item.tag ? `<span class="tag">${item.tag === 'Vegan' ? '❧ ' : '✦ '}${item.tag}</span>` : ''}<span class="art-circle"></span></div><div class="product-body"><span class="product-category">${item.category}</span><h3>${item.name}</h3><p>${item.description}</p><details><summary>Alerjen bilgisi</summary><small>${item.allergens}</small></details><div class="product-bottom"><strong>${money(item.price)}</strong><button class="add" data-add="${item.id}" aria-label="${item.name} listeme ekle">+</button></div></div></article>`).join('') : '<div class="empty"><span>⌕</span><h3>Bu lezzeti bulamadık</h3><p>Başka bir kelime deneyin veya filtreleri temizleyin.</p><button class="secondary" id="reset-filters">Filtreleri temizle</button></div>';
}
function renderCart() {
  try { localStorage.setItem('zeytin-cart', JSON.stringify(cart)); } catch { /* Keep in-memory cart. */ }
  const count = Object.values(cart).reduce((sum, n) => sum + n, 0);
  document.querySelector('#cart-open').hidden = count === 0;
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#cart-total').textContent = money(cartTotal(cart));
  document.querySelector('#dialog-total').textContent = money(cartTotal(cart));
  document.querySelector('#cart-items').innerHTML = menu.filter(item => cart[item.id]).map(item => `<div class="cart-item"><span class="cart-emoji">${item.emoji}</span><div class="cart-item-name"><strong>${item.name}</strong><small>${money(item.price * cart[item.id])}</small></div><div class="quantity"><button data-minus="${item.id}" aria-label="${item.name} azalt">−</button><span>${cart[item.id]}</span><button data-add="${item.id}" aria-label="${item.name} artır">+</button></div></div>`).join('') || '<p class="empty-cart">Listeniz boş. Menüden bir lezzet seçin.</p>';
}
let toastTimer;
function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 2000); }
document.addEventListener('click', async event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.category) { category = button.dataset.category; renderProducts(); }
  if (button.dataset.add) { const id = button.dataset.add; if ((cart[id] || 0) >= 99) return; cart[id] = (cart[id] || 0) + 1; renderCart(); toast('Sipariş listenize eklendi'); }
  if (button.dataset.minus) { const id = button.dataset.minus; if (--cart[id] <= 0) delete cart[id]; renderCart(); }
  if (button.dataset.close) document.getElementById(button.dataset.close).close();
  if (button.id === 'cart-open') document.querySelector('#cart-dialog').showModal();
  if (button.id === 'cart-clear') { cart = {}; renderCart(); }
  if (button.id === 'reset-filters') { category = 'Tümü'; query = ''; vegetarian = false; document.querySelector('#search').value = ''; document.querySelector('#vegetarian').checked = false; renderProducts(); }
  if (button.id === 'qr-open') {
    document.querySelector('#qr-dialog').showModal();
    const url = new URL(location.href); url.hash = '';
    document.querySelector('#qr-warning').textContent = ['localhost', '127.0.0.1', '0.0.0.0'].includes(url.hostname) ? 'Bu adres yalnızca bu cihazda çalışır. Paylaşmak için uygulamayı herkese açık bir adreste yayımlayın.' : '';
    try { await QRCode.toCanvas(document.querySelector('#qr-canvas'), url.href, { width: 240, margin: 2, color: { dark: '#153e35', light: '#ffffff' } }); } catch { document.querySelector('#qr-warning').textContent = 'QR kod oluşturulamadı. Menü bağlantısını kopyalayabilirsiniz.'; }
  }
  if (button.id === 'copy-link') { try { await navigator.clipboard.writeText(location.href); document.querySelector('#copy-status').textContent = 'Bağlantı kopyalandı.'; } catch { document.querySelector('#copy-status').textContent = 'Kopyalanamadı. Tarayıcınızın adres çubuğundan bağlantıyı kopyalayın.'; } }
});
document.querySelector('#search').addEventListener('input', event => { query = event.target.value; renderProducts(); });
document.querySelector('#vegetarian').addEventListener('change', event => { vegetarian = event.target.checked; renderProducts(); });
for (const dialog of document.querySelectorAll('dialog')) dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
renderProducts(); renderCart();
