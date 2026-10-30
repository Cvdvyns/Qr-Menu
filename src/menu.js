export const categories = ['Tümü', 'Başlangıçlar', 'Ana Yemekler', 'Salatalar', 'Tatlılar', 'İçecekler'];
export const menu = [
  { id: 'burrata', name: 'Burrata & Domates', category: 'Başlangıçlar', description: 'Kremamsı burrata, mevsim domatesleri, fesleğen ve sızma zeytinyağı.', price: 320, emoji: '🍅', color: 'peach', tag: 'Şefin seçimi', allergens: 'Süt', vegetarian: true },
  { id: 'humus', name: 'Pancar Humus', category: 'Başlangıçlar', description: 'Fırınlanmış pancar, tahin, nohut ve sıcacık ekşi mayalı ekmek.', price: 210, emoji: '🧆', color: 'pink', tag: 'Vegan', allergens: 'Susam, gluten', vegetarian: true },
  { id: 'salmon', name: 'Izgara Somon', category: 'Ana Yemekler', description: 'Limonlu ot sosu, mevsim sebzeleri ve ipeksi patates püresi.', price: 580, emoji: '🍣', color: 'sage', tag: 'En sevilen', allergens: 'Balık, süt' },
  { id: 'pasta', name: 'Trüflü Mantarlı Makarna', category: 'Ana Yemekler', description: 'Taze tagliatelle, orman mantarları, parmesan ve trüf yağı.', price: 390, emoji: '🍝', color: 'cream', allergens: 'Gluten, süt, yumurta', vegetarian: true },
  { id: 'chicken', name: 'Limonlu Köy Tavuğu', category: 'Ana Yemekler', description: 'Otlarla marine edilmiş tavuk, fırın patates ve roka.', price: 420, emoji: '🍗', color: 'peach', allergens: 'Hardal' },
  { id: 'salad', name: 'Akdeniz Kasesi', category: 'Salatalar', description: 'Kinoa, avokado, taze yeşillikler, nar ve limon sosu.', price: 290, emoji: '🥗', color: 'sage', tag: 'Vegan', allergens: 'Yok', vegetarian: true },
  { id: 'cheesecake', name: 'San Sebastian', category: 'Tatlılar', description: 'İçi yumuşacık, üzeri karamelize. Belçika çikolatasıyla.', price: 240, emoji: '🍰', color: 'cream', allergens: 'Süt, yumurta, gluten', vegetarian: true },
  { id: 'lemonade', name: 'Ev Yapımı Limonata', category: 'İçecekler', description: 'Taze sıkılmış limon, nane ve tam kararında tatlılık.', price: 120, emoji: '🍋', color: 'yellow', allergens: 'Yok', vegetarian: true },
  { id: 'coffee', name: 'Flat White', category: 'İçecekler', description: 'Çift shot espresso ve kadifemsi süt. Günün küçük molası.', price: 140, emoji: '☕', color: 'pink', allergens: 'Süt', vegetarian: true }
];
export const money = value => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
export function filterMenu(category, query, vegetarian) {
  const term = query.toLocaleLowerCase('tr-TR').trim();
  return menu.filter(item => (category === 'Tümü' || item.category === category) && (!vegetarian || item.vegetarian) && `${item.name} ${item.description}`.toLocaleLowerCase('tr-TR').includes(term));
}
export function cartTotal(cart) {
  return menu.reduce((total, item) => total + item.price * (cart[item.id] || 0), 0);
}
