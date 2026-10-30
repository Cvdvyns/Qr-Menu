# Zeytin · QR Menü

Mobil uyumlu, Türkçe dijital restoran menüsü. Vite ve vanilla JavaScript ile hazırlanmıştır.

## Geliştirme

Node.js 22 veya üzeri gerekir. Ortamda Node.js 24 ile doğrulanmıştır.

```sh
npm ci
npm run dev
```

Geliştirme sunucusu 5173 portunu kullanır. `npm run build` üretim dosyalarını `dist/` içine çıkarır; `npm run preview` üretim derlemesini 4173 portunda çalıştırır. `npm test` filtreleme ve sepet hesaplamalarını doğrular.

## Özellikler

- Türkçe arama, kategori ve vejetaryen filtresi
- Ürün fiyatları ve alerjen bilgileri
- Tarayıcıda saklanan, miktarı değiştirilebilen sipariş listesi
- Geçerli sayfa adresi için QR kodu ve bağlantı kopyalama
- Mobil düzen, klavye odağı ve yerleşik erişilebilir diyaloglar

Bu bir demo restoran menüsüdür. Ürünleri, fiyatları ve alerjenleri `src/menu.js` içinde düzenleyin. Gerçek restoran verileriyle kullanmadan önce alerjen bilgilerini doğrulayın. Görseller sistem emojileridir; harici görsel veya font servisi gerekmez.

Sipariş listesi yalnızca ziyaretçinin cihazında tutulur. Sunucuya sipariş göndermez, ödeme almaz ve yönetim paneli içermez. QR kodunun başka cihazlarda çalışması için `dist/` içeriğini herkese açık HTTPS destekli bir statik barındırma hizmetinde yayımlayın. QR kodu açık sayfanın adresini kullanır.
