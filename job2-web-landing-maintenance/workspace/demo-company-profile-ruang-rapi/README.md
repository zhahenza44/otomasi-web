# Demo Company Profile: Ruang Rapi (Desain Interior & Renovasi)

Demo landing page/company profile statis untuk portofolio **Job 2: Web Development/Landing Page + Maintenance**.
Konsep: studio desain interior & renovasi rumahan, fokus ke lead konsultasi via WhatsApp.

Arah desain dan alasan keputusan ada di [`DESIGN.md`](DESIGN.md).

## Struktur file
```text
demo-company-profile-ruang-rapi/
├── index.html          # Konten & struktur halaman
├── css/
│   └── styles.css      # Styling, layout, responsive
├── js/
│   └── main.js         # Menu, filter, lightbox, slider, sticky CTA, form WA
├── assets/
│   └── favicon.svg
├── tests/
│   ├── test_demo.py        # Assertion statis untuk struktur dan kontrak UI
│   └── browser_check.py    # Pemeriksaan perilaku nyata via Firefox BiDi
├── docs/superpowers/plans/
│   └── 2026-11-25-ruang-rapi-polish.md
├── DESIGN.md
└── README.md
```

## Fitur demo
- Responsif untuk mobile, tablet, dan desktop.
- Galeri proyek berfoto dengan satu kart unggulan. Kart bisa dibuka jadi lightbox; Escape, panah kiri/kanan, dan fokus keyboard didukung.
- **Before/after slider** yang bisa digeser dengan mouse, sentuhan, atau keyboard (arrow, Home, End).
- **Filter portofolio** berdasarkan jenis ruang.
- **Form konsultasi** lima field yang menyusun pesan WhatsApp otomatis (nama, WhatsApp, kebutuhan, budget, catatan).
- CTA konsultasi sticky di mobile; otomatis hilang saat section kontak terlihat.
- CTA WhatsApp mengambang di desktop.
- Menu mobile, header shadow saat scroll, dan animasi reveal yang mati dengan `prefers-reduced-motion`.
- Meta description, Open Graph dasar, favicon, dan struktur heading yang rapi.
- Tanpa dependency/build step.

## Yang bisa dikustomisasi cepat
Di `index.html`:
- **Brand/nama usaha:** "Ruang Rapi", inisial "R", tagline.
- **Nomor WhatsApp:** ganti `6281234567890` di link `wa.me/...`, sticky CTA, lightbox, dan teks kontak.
- **Email/area/jam kerja:** bagian kontak dan footer.
- **Layanan, paket, FAQ:** edit teks di section masing-masing.
- **Form:** tambah/ubah pilihan kebutuhan dan range budget.
- **Portofolio:** ganti judul, kategori (`data-category`), dan deskripsi. Perbarui juga `data-image`, `data-title`, dan `data-copy` supaya isi lightbox ikut berubah.
- **Foto:** sembilan URL Pexels tercantum di tabel `DESIGN.md`.

Di `css/styles.css`:
- **Warna:** ubah variabel di `:root` (`--primary`, `--sage`, `--bg`, dll.).
- **Font:** ganti Google Fonts di `<head>` `index.html` dan `font-family` di CSS.
- **Bentuk hero:** atur `border-radius` pada `.hero-frame`.

## Catatan
- Ini **demo portofolio**. Nama proyek, foto, dan harga adalah contoh. Tidak ada testimoni atau angka pencapaian yang diklaim sebagai data klien nyata.
- Foto memakai Pexels sebagai ilustrasi, dengan kredit di footer.
- Form tidak menyimpan data ke database/backend. Pesan hanya disusun lalu dibuka di WhatsApp.
- Jika popup WhatsApp diblokir browser, halaman menampilkan tautan cadangan.
- Untuk produksi, pertimbangkan:
  - hosting statis (Netlify/Vercel/GitHub Pages/Cloudflare Pages),
  - form backend (Formspree, Google Apps Script, atau API sendiri) bila ingin lead tersimpan,
  - analytics ringan (Plausible/GA4) dan WhatsApp click tracking,
  - mengganti foto ilustrasi dengan dokumentasi proyek asli,
  - optimasi gambar (WebP/AVIF).
