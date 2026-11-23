# Demo Landing Page — Servis AC (SejukBerkah AC)

Demo landing page statis untuk portofolio **Job 2: Web Development/Landing Page + Maintenance**.  
Konsep: jasa servis AC panggilan lokal, fokus ke lead/booking via WhatsApp.

## Lokasi
`Projects/Freelance-Otomasi-Web/job2-web-landing-maintenance/workspace/demo-landingpage-servis-ac/`

## Struktur file
```text
demo-landingpage-servis-ac/
├── index.html      # Konten & struktur halaman
├── css/
│   └── styles.css  # Styling, layout, responsive
├── js/
│   └── main.js     # Interaksi kecil (mobile menu)
├── assets/         # Tempat gambar/icon jika nanti ditambahkan
└── README.md
```

## Cara menjalankan
Ini project HTML/CSS/JS statis, tidak perlu install dependency.

- **Cara cepat:** buka `index.html` langsung di browser.
- **Opsional (local server):**
  ```bash
  cd /home/asnodt/Projects/Freelance-Otomasi-Web/job2-web-landing-maintenance/workspace/demo-landingpage-servis-ac
  python -m http.server 8080
  ```
  Lalu buka `http://localhost:8080`.

## Yang bisa dikustomisasi cepat
Di `index.html`:
- **Brand/nama usaha:** "SejukBerkah AC", inisial "SB"
- **Nomor WhatsApp:** ganti `6281234567890` di semua link `wa.me/...`
- **Pesan WA template:** ubah parameter `text=...` pada link WhatsApp
- **Kota/area layanan:** "Depok & Sekitarnya", daftar area di hero
- **Layanan, harga, FAQ, testimoni:** edit teks di masing-masing section
- **Kontak & jam operasional:** di footer

Di `css/styles.css`:
- **Warna utama:** ubah variabel CSS di `:root` (`--primary`, `--accent`, dll.)
- **Font:** ganti Google Fonts di `<head>` `index.html` dan `font-family` di `body`

## Fitur demo
- Responsif (mobile/desktop)
- CTA WhatsApp dengan pesan template
- Section: Hero, Layanan, Estimasi Harga, Cara Kerja, Testimoni, FAQ, CTA, Footer
- Meta description + Open Graph dasar
- Menu mobile sederhana
- Tanpa dependency/build step

## Catatan
- Ini **demo portofolio** dengan data/testimoni contoh. Sebelum dipakai klien nyata, ganti dengan info bisnis, harga, area, dan testimoni asli.
- Untuk versi produksi, bisa dimigrasikan ke **Astro/Next.js + Tailwind** bila butuh komponenisasi, CMS, form backend, atau integrasi analytics.