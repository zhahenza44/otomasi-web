# Demo Company Profile — Ruang Rapi (Desain Interior & Renovasi)

Demo landing page/company profile statis untuk portofolio **Job 2: Web Development/Landing Page + Maintenance**.
Konsep: studio desain interior & renovasi rumahan, fokus ke lead konsultasi via WhatsApp.

## Lokasi
`Projects/Freelance-Otomasi-Web/job2-web-landing-maintenance/workspace/demo-company-profile-ruang-rapi/`

## Struktur file
```text
demo-company-profile-ruang-rapi/
├── index.html          # Konten & struktur halaman
├── css/
│   └── styles.css      # Styling, layout, responsive
├── js/
│   └── main.js         # Menu, filter portofolio, before/after slider, form WA
├── assets/
│   ├── after.svg       # Ilustrasi ruang setelah ditata
│   ├── before.svg      # Ilustrasi ruang sebelum ditata
│   └── favicon.svg
└── README.md
```

## Fitur demo
- Responsif untuk mobile, tablet, dan desktop.
- **Before/after slider** yang bisa digeser dengan mouse, sentuhan, atau keyboard (arrow, Home, End).
- **Filter portofolio** berdasarkan jenis ruang.
- **Form konsultasi** yang menyusun pesan WhatsApp otomatis (nama, kebutuhan, area, budget, catatan).
- Menu mobile, header shadow saat scroll, dan animasi reveal sederhana.
- CTA WhatsApp mengambang di kanan bawah.
- Meta description, Open Graph dasar, favicon, dan struktur heading yang rapi.
- Tanpa dependency/build step.

## Yang bisa dikustomisasi cepat
Di `index.html`:
- **Brand/nama usaha:** "Ruang Rapi", inisial "R", tagline.
- **Nomor WhatsApp:** ganti `6281234567890` di semua link `wa.me/...` dan di teks kontak.
- **Email/area/jam kerja:** bagian kontak dan footer.
- **Layanan, paket, testimoni, FAQ:** edit teks di section masing-masing.
- **Form:** tambah/ubah pilihan kebutuhan dan range budget.
- **Portofolio:** ganti judul, kategori (`data-category`), lokasi, tahun, dan deskripsi.

Di `css/styles.css`:
- **Warna:** ubah variabel di `:root` (`--primary`, `--sage`, `--bg`, dll.).
- **Font:** ganti Google Fonts di `<head>` `index.html` dan `font-family` di CSS.
- **Bentuk hero:** atur `border-radius` pada `.hero-frame`.

Di `assets/`:
- Ganti `before.svg` dan `after.svg` dengan foto proyek asli. Pastikan **rasio 4:3** dan sudut pengambilan foto sama supaya slider terlihat meyakinkan.
- Thumbnail portofolio saat ini memakai gradient + ikon. Untuk versi produksi, ganti dengan foto proyek (rasio 4:3) di `.project-media`.

## Catatan
- Ini **demo portofolio**. Data proyek, testimoni, harga, dan nomor WhatsApp adalah contoh.
- Form tidak menyimpan data ke database/backend. Pesan hanya disusun lalu dibuka di WhatsApp.
- Jika popup WhatsApp diblokir browser, halaman menampilkan tautan cadangan.
- Untuk produksi, pertimbangkan:
  - hosting statis (Netlify/Vercel/GitHub Pages/Cloudflare Pages),
  - form backend (Formspree, Google Apps Script, atau API sendiri) bila ingin lead tersimpan,
  - analytics ringan (Plausible/GA4) dan WhatsApp click tracking,
  - optimasi gambar (WebP/AVIF) bila memakai foto asli.

## Sudah diuji
- Struktur HTML, CSS, dan JavaScript dasar.
- Tautan anchor, filter portofolio, slider, dan alur form ke WhatsApp.
- Tampilan responsif pada lebar desktop dan mobile.
