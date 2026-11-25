# Ruang Rapi: arah polesan demo

## Tujuan

Demo company profile ini harus terasa seperti studio desain interior yang sedang menerima klien, bukan sekadar contoh layout. Pengunjung perlu melihat ruang nyata, memahami alur kerja, dan bisa langsung membuka WhatsApp.

## Keputusan arah

Arah yang dipilih: **B + sedikit C**.

- B: visual dan cerita. Foto nyata, galeri proyek, konten demo yang jujur, ritme section divariasi.
- C: sedikit konversi. Form lebih pendek dan CTA mobile yang mudah dijangkau.

## Yang tidak berubah

- HTML, CSS, dan JS statis. Tanpa framework, backend, atau database.
- Palet hangat yang sudah ada. Kontras teks utama sudah lolos AA (5,23:1), jadi tidak diubah.
- Nama, area layanan Jabodetabek, nomor WhatsApp demo, dan email demo.
- Slider sebelum/sesudah tetap ada dan tetap bisa dipakai dengan keyboard.
- Filter portofolio tetap ada.

## Perubahan desain

### 1. Hero

- Foto ruang tamu nyata menggantikan `assets/after.svg`.
- Teks utama tetap `Rumah yang rapi, terasa lebih lapang.`
- Satu CTA utama ke form konsultasi. CTA sekunder ke portofolio tetap ada.
- Kart palet warna dan kart `12+` dihapus. Angka itu tidak punya sumber.
- `eyebrow` tanpa dot dekoratif. Informasi Jabodetabek masuk ke paragraf pembuka.
- Gambar hero memakai `width`, `height`, dan `fetchpriority="high"`. Tidak lazy.

### 2. Portofolio

- Enam media gradasi + ikon diganti foto interior dari Pexels.
- Satu proyek unggulan ditampilkan lebih besar, lima proyek lain lebih kecil.
- Kart bisa dibuka menjadi lightbox: foto besar, keterangan, dan CTA `Tanya proyek serupa`.
- Lightbox bisa ditutup dengan Escape, tombol close, dan klik di luar foto. Panah kiri/kanan berpindah proyek.
- Label `Contoh portofolio, foto ilustrasi` terlihat dekat filter, bukan hanya di footer.

### 3. Sebelum/sesudah

- Slider tetap dipakai, tetapi foto diganti pasangan foto nyata: ruang kosong dan ruang yang sudah ditata.
- Teks di section menjelaskan bahwa ini ilustrasi perbandingan, bukan klaim satu proyek klien.
- Tag `Sebelum` dan `Sesudah` tetap ada.

### 4. Ritme dan konten

- Section testimoni dihapus. Kutipan dengan nama orang dibuat-buat dan melemahkan kredibilitas.
- Bagian proses tetap empat langkah, tanpa kart tambahan.
- Paket disederhanakan menjadi dua pilihan: `Desain & RAB` dan `Renovasi terpadu`. Konsultasi awal menjadi pintu masuk, bukan tier berbayar.
- Catatan harga contoh dipindah ke dekat judul paket supaya terbaca sebelum harga.
- FAQ tetap lima pertanyaan.

### 5. Form dan CTA

- Field form jadi lima: nama, WhatsApp, kebutuhan, budget, cerita singkat. Field area dihapus karena area layanan sudah dinyatakan di halaman.
- Setiap label memakai `for` yang sesuai dengan input.
- CTA mobile sticky muncul di layar sempit: teks `Konsultasi gratis` + ikon WA.
- CTA sticky menghilang saat form konsultasi terlihat, dan tidak menutupi konten. Ruang bawah ditambahkan di body/footer.
- Tombol dan target interaktif minimal 44 x 44 px.

### 6. Gerak dan aksesibilitas

- Foto proyek zoom 1.03 di dalam frame saat hover dan focus.
- Kart naik 2 px saat hover. Tombol memberi respons press saat diklik.
- Reveal on scroll tetap ada, tetapi tidak berjalan pada `prefers-reduced-motion: reduce`.
- Lightbox mengunci fokus saat terbuka dan mengembalikan fokus ke kart asal saat ditutup.
- Semua gambar bersized. Hero tidak lazy.
- Fokus terlihat di semua kontrol, termasuk di dark section dan lightbox.

## Aset

- Foto: Pexels, dipilih sesuai peran (hero, enam proyek, dua foto sebelum/sesudah).
- Satu baris kredit di footer: `Foto ilustrasi: Pexels`.
- Tidak ada foto klien nyata yang diklaim sebagai hasil proyek.

| Peran | URL |
| --- | --- |
| hero | https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop |
| project-1 | https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop |
| project-2 | https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop |
| project-3 | https://images.pexels.com/photos/6186815/pexels-photo-6186815.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop |
| project-4 | https://images.pexels.com/photos/4409366/pexels-photo-4409366.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop |
| project-5 | https://images.pexels.com/photos/8288956/pexels-photo-8288956.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop |
| project-6 | https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop |
| before | https://images.pexels.com/photos/16641359/pexels-photo-16641359.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop |
| after | https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop |

## di luar cakupan

- Deploy, domain, hosting, Google indexing.
- Data klien asli, testimoni asli, atau harga final.
- Perubahan struktur folder Project selain file demo ini.

## Verifikasi

- Buka lewat `python3 -m http.server` dan cek di 1440, 1024, 768, dan 390 px.
- Cek tidak ada horizontal scroll dan tidak ada teks terpotong.
- Cek keyboard-only: menu, slider, filter, lightbox, form, skip link.
- Cek pesan WA yang terbentuk dari form.
- Jalankan `contrast-check.py` untuk pasangan warna yang berubah.
- Cek `prefers-reduced-motion` dan pastikan fokus kembali ke kart asal saat lightbox ditutup dengan Escape.

## Status

Menunggu persetujuan sebelum dibuat rencana implementasi dan dieksekusi.
