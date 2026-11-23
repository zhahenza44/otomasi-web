# Demo — Rental Mobil Multi-page (Arunika Drive)

Demo portofolio **Job 2: web development / landing page + maintenance**. Website statis multi-halaman untuk bisnis rental mobil, dibuat dengan HTML, CSS, dan JavaScript tanpa framework.

## Halaman

| Halaman | File | Fitur |
|---|---|---|
| Beranda | `index.html` | Hero, form pencarian, mobil unggulan, keunggulan, cara sewa, testimoni, CTA |
| Katalog | `katalog.html` | Pencarian real-time, filter tipe, sorting, sinkronisasi URL |
| Detail mobil | `detail.html?id=...` | Spesifikasi, fasilitas, harga, rekomendasi unit lain |
| Booking | `booking.html?id=...` | Kalkulasi harga otomatis, validasi form, ringkasan, generate pesan WhatsApp |
| FAQ | `faq.html` | Accordion pertanyaan umum |
| Kontak | `kontak.html` | Kartu kontak, form dengan validasi, generate pesan WhatsApp |

## Fitur teknis

- **Data-driven**: katalog dan detail dirender dari `js/data.js`.
- **Kalkulasi booking**: harga sewa × durasi, biaya sopir, antar-jemput, diskon 10% untuk 7 hari ke atas.
- **Validasi form**: nama, nomor WhatsApp Indonesia, tanggal, durasi; pesan error per field.
- **URL state**: filter katalog bisa dibagikan lewat query string (`?type=suv`).
- **Aksesibilitas**: skip link, label form, `aria-pressed`, `aria-expanded`, fokus terlihat, dukungan `prefers-reduced-motion`.
- **Responsif**: layout desktop, tablet, dan mobile; menu hamburger di layar kecil.
- **SEO dasar**: meta description, Open Graph, JSON-LD `AutoRental`, judul per halaman.
- **Tanpa build step**: cukup buka `index.html` atau jalankan static server.

## Cara menjalankan

```bash
cd job2-web-landing-maintenance/workspace/demo-rental-mobil-multipage
python3 -m http.server 8000
```

Buka `http://localhost:8000`.

## Catatan untuk klien

- Nomor WhatsApp, alamat, dan harga adalah contoh. Ganti di `js/data.js` dan HTML terkait.
- Ilustrasi mobil berupa SVG buatan sendiri, aman untuk demo dan mudah diganti dengan foto asli klien.
- Untuk produksi, form booking dapat dihubungkan ke backend, Google Sheets, atau CRM.
