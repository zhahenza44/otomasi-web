# Design: Portfolio TRON Alan Nawa

## Intent

Satu halaman CV digital untuk Alan Nawa. Harus melakukan dua hal sekaligus: menunjukkan pekerjaan dari dua jasa freelance (otomasi AI/workflow dan web/landing page) dan memberi jalan bagi calon klien untuk menghubungi. Tema visual TRON: gelap, grid, garis cyan, tipografi teknis.

## Goals

- Menampilkan tujuh demo: AI lead capture, servis AC, Ruang Rapi, kedai kopi, rental mobil, Omegamoto, portfolio cyberpunk.
- Menjelaskan dua lini jasa dalam bahasa yang dipahami calon klien.
- Kontak melalui Instagram, GitHub, dan email.
- Responsif di phone/tablet/desktop, tanpa dependency atau build step.

## Non-goals

- WhatsApp tidak dipakai di header, pembuka, maupun kontak.
- projects.co.id tidak dicantumkan.
- Omegamoto tidak di-push ke repo dan kartunya tanpa tautan.
- Tidak ada backend, form yang mengirim data, atau halaman tambahan.

## Constraints

- Lokasi proyek: `/home/asnodt/Projects/Portofolio/` (folder baru, terpisah dari repo `Freelance-Otomasi-Web`).
- Mengikuti pola demo Job 2: HTML/CSS/JS statis, tanpa dependency atau build step.
- Tautan kartu harus benar-benar membuka demo; hanya cyberpunk yang perlu di-push ke repo.
- Data kontak: Instagram `@zhahenzar`, email `zhahenza666@proton.me`, GitHub `https://github.com/zhahenza44`.

## Approaches

1. **Satu halaman statis di `/home/asnodt/Projects/Portofolio/`**: dipilih. Konsisten dengan demo yang ada, bisa langsung dibuka dan di-host tanpa build.
2. **Starter Astro/Next dari folder `resources/`**: ditolak. Perlu build step dan dependency untuk hasil yang masih satu halaman.
3. **Tema GitHub Pages/Jekyll**: ditolak. Menambah konfigurasi tanpa manfaat untuk CV statis.

## Decisions

- Struktur: header → pembuka dengan dua tombol → dua blok jasa → grid project dengan filter (Semua / Job 1 / Job 2) → kontak → footer.
- Kalimat pembuka: "Halo, saya Alan Nawa, not-a-dev :) Saya bisa bantu bikin website yang rapi dan workflow yang otomatis, supaya bisnis Anda lebih cepat merespons pelanggan."
- Dua tombol pembuka: `[Lihat project]` dan `[Instagram]`.
- Header dan kontak: Instagram, GitHub, email.
- Visual: latar near-black, cyan sebagai aksen utama, oranye sebagai aksen sekunder, grid perspektif, scanline halus, font mono untuk label; animasi dihentikan saat `prefers-reduced-motion`.
- File di root proyek: `index.html`, `css/styles.css`, `js/main.js`, `assets/favicon.svg`. Kartu project ditulis statis di HTML supaya tetap terbaca tanpa JavaScript.

## Reasoning on approach

- `js/data.js` tidak dipakai: kartu statis lebih awet untuk CV dan menghindari duplikasi kontak di dua tempat.

## Visual decision record

Design Read: one-page personal CV for prospective clients, in TRON system style, dial ENERGY 2 / RHYTHM 2 / MOTION 1.

- Near-black with cyan and a small orange accent: TRON identity from the brief, cyan for system labels and orange only for the secondary marker.
- Grid and static scanline: the identity motif from the brief, kept behind the content with no movement loop.
- Mono labels with wide tracking: technical voice from the brief, limited to labels and short data lines so body copy stays readable.
- Hero panel instead of a portrait: gives the opening screen one focal point without inventing a photo or asset.
- Two service cards: the two real job lines carry equal weight, so no third filler card was added.
- Uniform project cards: each card is one demo of equal weight, with index and track label carrying the hierarchy.
- Arrows on external demo links only: they signal a jump out of the CV, not decoration on every button.
- Hover and transition motion only: MOTION 1, no loops, and reduced motion removes the transitions.
- Single column below 900px: the grids reflow where two columns stop holding, and every control stays at least 44px.

## Left to builder

- Pastikan tautan project mengarah ke folder demo yang benar di repo `Freelance-Otomasi-Web`, dan kartu Omegamoto tetap tanpa tautan.
