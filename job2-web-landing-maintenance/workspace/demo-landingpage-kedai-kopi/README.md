# Demo Landing Page — Kedai Kopi Oak

Demo landing page statis untuk portofolio **Job 2: Web Development/Landing Page + Maintenance**.  
Konsep: kedai kopi dengan kopi tubruk, kopi manis, teh susu dan suasana tenang; pesanan tetap menggunakan WhatsApp.

## Lokasi
`Projects/Freelance-Otomasi-Web/job2-web-landing-maintenance/workspace/demo-landingpage-kedai-kopi/`

## Struktur file
```text
demo-landingpage-kedai-kopi/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/            # (kosong — demo varis, pakai SVG/gambar pun udah bisa pakai statis)
└── README.md
```

## Cara menjalankan
HTML/CSS/JS statis, tidak perlu install dependency.

- Buka `index.html` langsung di browser.
- Opsional local server:
  ```bash
  cd /home/asnodt/Projects/Freelance-Otomasi-Web/job2-web-landing-maintenance/workspace/demo-landingpage-kedai-kopi
  python -m http.server 8080
  ```
  Lalu buka `http://localhost:8080`.

## Yang bisa dikustomisasi cepat
Di `index.html`:
- Brand/nama kedai: “Kedai Kopi Oak”
- Pesan WhatsApp: ubah parameter `text=...` di semua link `wa.me/...`
- Nomor WhatsApp di footer, hero, dan menu
- Tambah/hilangkan menu: rubah markup di section `#menu`
- Deskripsi menu, harga, FAQ: edit di section masing-masing
- Domain/alamat kedai di footer

Di `css/styles.css`:
- Warna utama: ubah variabel CSS di `:root` (`--primary`, `--accent`, dll.)
- Font: ganti Google Fonts di `<head>` index.html dan `font-family` body

## Fitur demo
- Responsif (mobile/desktop)
- Hero dengan pesan dan teks
- Section: Menu, Profil/Selainan, Cara Pesan, FAQ
- CTA WhatsApp di setiap section (copilot WhatsApp terbuka dengan teks saran)
- Menu mobile sederhana
- Animasi reveal sederhana
- Tanpa dependency/build step

## Catatan
- Ini adalah **demo portofolio** dengan data konten contoh. Sebelum dipakai klien nyata: ganti nama kedai, menu/harga, testimoni (bagian ini ada sederhana?), ag radiation.
- Menganalisis kedai sederhana: bila perlu pasang foto/GPPRFIC? — pilihan ps NKFIC.
- Untuk versi produksi, bisa diganti dengan mengunggah foto aripi, menambahkan module pesan WhatsApp, menyediakan Google Calendar, atau migrasi ke CMS (WordPress/Astro) bila ingin blog/menu

