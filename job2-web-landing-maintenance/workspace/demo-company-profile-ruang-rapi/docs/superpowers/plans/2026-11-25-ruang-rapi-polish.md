# Ruang Rapi Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ubah demo Ruang Rapi menjadi company profile statis yang memperlihatkan foto ruang nyata, galeri proyek yang bisa dibuka, konten contoh yang jujur, dan CTA WhatsApp yang mudah dipakai di mobile.

**Architecture:** Satu halaman HTML statis dengan CSS dan JS vanilla yang sudah ada. Konten dan struktur diubah di `index.html`, perilaku lightbox dan sticky CTA ditambahkan di `js/main.js`, tampilan dan reflow diatur di `css/styles.css`. Foto memakai URL Pexels langsung, tanpa file lokal baru dan tanpa build step.

**Tech Stack:** HTML5, CSS custom properties, vanilla JavaScript, Python 3 untuk static assertion test, curl untuk HTTP check.

**Spec:** `DESIGN.md` di root demo.

## Global Constraints

- Nama brand tetap `Ruang Rapi`.
- Hero copy tetap `Rumah yang rapi,<br><em>terasa lebih lapang.</em>`.
- CTA utama tetap `Mulai konsultasi`. CTA sekunder tetap `Lihat portofolio`.
- Label portofolio tetap `Contoh portofolio, foto ilustrasi`.
- Kredit footer tetap `Foto ilustrasi: Pexels`.
- Nomor WhatsApp demo tetap `6281234567890` dan email demo tetap `halo@ruangrapi.id`.
- Area layanan tetap `Jabodetabek`.
- Field form tetap lima: `nama`, `wa`, `layanan`, `budget`, `pesan`.
- Jumlah kart proyek tetap enam.
- Slider sebelum/sesudah tetap memakai `role="slider"`, `aria-valuemin="0"`, `aria-valuemax="100"`, dan keyboard arrow, Home, End.
- Tidak ada framework, backend, database, atau build step.
- Semua foto memakai URL `https://images.pexels.com/photos/...` dengan query `auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop`.
- Hero image wajib `fetchpriority="high"` dan tidak `loading="lazy"`.
- Semua target interaktif minimal 44 x 44 px di layar sempit.
- Teks tidak boleh memakai em dash.

## Review Focus

- Jaringan lambat: hero image harus segera dimuat. Pin ke Task 2 test `test_hero_image_is_prioritized`.
- Keyboard lightbox: Escape harus menutup, panah harus berpindah, fokus harus kembali ke kart asal. Pin ke Task 4 test `test_lightbox_keyboard_and_focus_contract`.
- Layar 390 px dan zoom 200 persen: tidak boleh horizontal scroll atau teks terpotong. Pin ke Task 5 verification step `viewport_and_zoom_check`.
- Popup WhatsApp diblokir: harus ada fallback link. Pin ke Task 4 test `test_wa_popup_fallback_preserved`.
- Reduced motion: reveal, zoom, dan transisi harus mati saat `prefers-reduced-motion: reduce`. Pin ke Task 3 test `test_reduced_motion_guard`.

---

### Task 1: Static test harness dan asset map

**Files:**
- Create: `tests/test_demo.py`
- Modify: `DESIGN.md` (tambah tabel URL foto di bawah bagian Aset)

**Interfaces:**
- Consumes: `DESIGN.md` yang sudah disetujui.
- Produces: `python3 -m unittest discover -s tests -v` sebagai gate untuk semua task. Konstanta `IMAGE_URLS` dipakai ulang oleh test Task 2.

- [ ] **Step 1: Tulis test yang gagal untuk harness dan asset map**

Buat `tests/test_demo.py` dengan struktur ini:

```python
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "main.js").read_text(encoding="utf-8")

IMAGE_URLS = {
    "hero": "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "project-1": "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "project-2": "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "project-3": "https://images.pexels.com/photos/6186815/pexels-photo-6186815.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "project-4": "https://images.pexels.com/photos/4409366/pexels-photo-4409366.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "project-5": "https://images.pexels.com/photos/8288956/pexels-photo-8288956.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "project-6": "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "before": "https://images.pexels.com/photos/16641359/pexels-photo-16641359.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "after": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
}

class AssetMapTest(unittest.TestCase):
    def test_design_doc_lists_every_asset_role(self):
        doc = (ROOT / "DESIGN.md").read_text(encoding="utf-8")
        for role, url in IMAGE_URLS.items():
            with self.subTest(role=role):
                self.assertIn(role, doc)
                self.assertIn(url, doc)
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `cd demo-company-profile-ruang-rapi && python3 -m unittest discover -s tests -v`
Expected: FAIL karena `DESIGN.md` belum memuat URL.

- [ ] **Step 3: Tambah tabel asset ke DESIGN.md**

Di bagian `## Aset`, tambahkan tabel dua kolom `Peran` dan `URL` dengan sembilan pasangan dari `IMAGE_URLS`. Teks kredit footer tetap persis `Foto ilustrasi: Pexels`.

- [ ] **Step 4: Jalankan test dan pastikan lolos**

Run: `cd demo-company-profile-ruang-rapi && python3 -m unittest discover -s tests -v`
Expected: PASS `AssetMapTest.test_design_doc_lists_every_asset_role`.

- [ ] **Step 5: Commit**

```bash
git add DESIGN.md tests/test_demo.py
git commit -m "test: pin Ruang Rapi photo assets"
```

### Task 2: Struktur dan copy index.html

**Files:**
- Modify: `index.html`
- Test: `tests/test_demo.py`

**Interfaces:**
- Consumes: `IMAGE_URLS` dari Task 1.
- Produces: markup `.project[data-project-id][data-image][data-title][data-copy][data-category]`, `#project-lightbox`, `#sticky-consult`, form dengan lima field bernama.

- [ ] **Step 1: Tambah test untuk struktur HTML**

Tambahkan class berikut ke `tests/test_demo.py`:

```python
class HtmlStructureTest(unittest.TestCase):
    def test_hero_image_is_prioritized(self):
        self.assertIn(IMAGE_URLS["hero"], HTML)
        hero_img = next(line for line in HTML.splitlines() if IMAGE_URLS["hero"] in line)
        self.assertIn('fetchpriority="high"', hero_img)
        self.assertNotIn('loading="lazy"', hero_img)
        self.assertIn('width="1200"', hero_img)
        self.assertIn('height="900"', hero_img)

    def test_six_project_cards_with_lightbox_data(self):
        self.assertEqual(HTML.count('class="project '), 6)
        for attr in ("data-project-id", "data-image", "data-title", "data-copy", "data-category"):
            self.assertEqual(HTML.count(attr), 6)

    def test_lightbox_and_sticky_cta_exist(self):
        for marker in (
            'id="project-lightbox"',
            'role="dialog"',
            'aria-modal="true"',
            'id="lightbox-image"',
            'id="lightbox-title"',
            'id="lightbox-copy"',
            'id="lightbox-close"',
            'id="lightbox-prev"',
            'id="lightbox-next"',
            'id="lightbox-wa"',
            'id="sticky-consult"',
        ):
            self.assertIn(marker, HTML)

    def test_placeholder_claims_are_removed(self):
        for phrase in ("12+", "Rina &amp; Adit", "Dewi, Kemang", "Yoga, Bekasi", "Contoh testimoni"):
            self.assertNotIn(phrase, HTML)
        self.assertIn("Contoh portofolio, foto ilustrasi", HTML)
        self.assertIn("Foto ilustrasi: Pexels", HTML)

    def test_form_has_exactly_five_fields(self):
        for name in ("nama", "wa", "layanan", "budget", "pesan"):
            self.assertIn(f'name="{name}"', HTML)
        self.assertNotIn('name="area"', HTML)
        self.assertEqual(HTML.count("<label"), 5)
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `cd demo-company-profile-ruang-rapi && python3 -m unittest discover -s tests -v`
Expected: FAIL pada `test_hero_image_is_prioritized` dan struktur baru.

- [ ] **Step 3: Rewrite hero dan portofolio di index.html**

- Hero: ganti `<img src="assets/after.svg" ...>` dengan URL `IMAGE_URLS["hero"]`, `width="1200"`, `height="900"`, `fetchpriority="high"`, dan alt `Ruang tamu minimalis dengan sofa, meja kayu, dan pencahayaan alami`.
- Hapus `.swatch-card` dan `.stat-card`.
- Hapus `<span class="dot"></span>` dari eyebrow hero.
- Portofolio: enam artikel tetap dengan kategori `tamu`, `dapur`, `kamar`, `kantor`, `dapur`, `tamu`. Ganti `.project-media` gradient+icon dengan `<img loading="lazy" width="1200" height="900" alt="...">` sesuai `IMAGE_URLS`.
- Tambahkan atribut `data-project-id="1"` sampai `"6"`, `data-image`, `data-title`, `data-copy`, dan `data-category` di setiap `.project`.
- Tambahkan teks `Contoh portofolio, foto ilustrasi` tepat di bawah filter.
- Tandai kart pertama dengan kelas tambahan `is-featured`.

- [ ] **Step 4: Tambah markup lightbox dan sticky CTA**

Sebelum `</main>` atau setelah `</main>`, tambahkan:

```html
<div class="lightbox" id="project-lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" hidden>
  <div class="lightbox-backdrop" data-close-lightbox></div>
  <div class="lightbox-panel">
    <button class="lightbox-close" id="lightbox-close" type="button" aria-label="Tutup galeri">×</button>
    <img id="lightbox-image" src="" alt="" width="1200" height="900">
    <div class="lightbox-body">
      <p class="eyebrow">Contoh proyek</p>
      <h2 id="lightbox-title"></h2>
      <p id="lightbox-copy"></p>
      <a class="btn" id="lightbox-wa" href="https://wa.me/6281234567890" target="_blank" rel="noopener">Tanya proyek serupa</a>
    </div>
    <button class="lightbox-nav lightbox-prev" id="lightbox-prev" type="button" aria-label="Proyek sebelumnya">‹</button>
    <button class="lightbox-nav lightbox-next" id="lightbox-next" type="button" aria-label="Proyek berikutnya">›</button>
  </div>
</div>

<a class="sticky-cta" id="sticky-consult" href="#konsultasi">
  <svg aria-hidden="true"><use href="#i-wa"/></svg>
  <span>Konsultasi gratis</span>
</a>
```

- [ ] **Step 5: Sesuaikan slider, paket, testimoni, form, dan footer**

- Slider: ganti `assets/before.svg` dengan `IMAGE_URLS["before"]` dan `assets/after.svg` dengan `IMAGE_URLS["after"]`. Ubah hint menjadi `Geser garis untuk melihat ilustrasi perbandingan ruang.`
- Hapus seluruh `<section class="section">` yang berisi `.quotes` dan `.demo-note`.
- Paket: hapus kart `Konsultasi & moodboard`. Ubah judul section menjadi `Dua cara mulai`. Teks pembuka menyebut konsultasi awal sebagai pintu masuk. Tambahkan `Harga contoh untuk demo. Penawaran final menyesuaikan ukuran ruang, material, dan tingkat pengerjaan.` tepat di bawah judul, lalu hapus `.pricing-note` lama.
- Form: hapus field `Area`. Tambah `for` pada setiap label yang sesuai dengan `id` input/select/textarea.
- Footer: ganti baris `Dibuat untuk portofolio web development.` dengan `Foto ilustrasi: Pexels`.

- [ ] **Step 6: Jalankan test dan pastikan lolos**

Run: `cd demo-company-profile-ruang-rapi && python3 -m unittest discover -s tests -v`
Expected: PASS semua test di Task 1 dan Task 2.

- [ ] **Step 7: Commit**

```bash
git add index.html tests/test_demo.py
git commit -m "feat: rebuild Ruang Rapi content around real project photos"
```

### Task 3: Styling, reflow, dan state interaksi

**Files:**
- Modify: `css/styles.css`
- Test: `tests/test_demo.py`

**Interfaces:**
- Consumes: markup dari Task 2.
- Produces: selector `.project.is-featured`, `.lightbox`, `.sticky-cta`, `.project-media img`.

- [ ] **Step 1: Tambah test CSS**

```python
class CssContractTest(unittest.TestCase):
    def test_new_components_are_styled(self):
        for marker in (
            ".project.is-featured",
            ".project-media img",
            ".lightbox[hidden]",
            ".lightbox-panel",
            ".lightbox-close",
            ".lightbox-nav",
            ".sticky-cta",
        ):
            self.assertIn(marker, CSS)

    def test_hover_and_focus_zoom_guard(self):
        self.assertIn(".project:hover .project-media img", CSS)
        self.assertIn(".project:focus-within .project-media img", CSS)
        self.assertIn("scale(1.03)", CSS)

    def test_mobile_states_are_defined(self):
        for marker in ("@media (max-width: 1024px)", "@media (max-width: 720px)", "@media (max-width: 420px)"):
            self.assertIn(marker, CSS)

    def test_reduced_motion_guard(self):
        self.assertIn("@media (prefers-reduced-motion: reduce)", CSS)
        self.assertNotIn("animation: pulse", CSS)
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `cd demo-company-profile-ruang-rapi && python3 -m unittest discover -s tests -v`
Expected: FAIL pada `CssContractTest`.

- [ ] **Step 3: Implementasi style baru**

- `.hero-frame img`: `aspect-ratio: 4/3`, `object-fit: cover`, radius mengikuti frame.
- `.project-grid`: desktop 3 kolom, kart pertama `.is-featured` span 2 kolom dan 2 baris, media image `object-fit: cover`, `transition: transform .35s ease`.
- `.project:hover .project-media img` dan `.project:focus-within .project-media img`: `transform: scale(1.03)`.
- `.lightbox[hidden] { display: none; }`. `.lightbox` fixed inset 0, z-index 80, grid place-items center, background rgba gelap. `.lightbox-panel` max-width 960px, max-height 88vh, overflow auto, background `--surface`, radius 24px.
- `.lightbox-close`, `.lightbox-nav`: minimal 44 x 44 px, `cursor: pointer`, focus ring terlihat.
- `.sticky-cta`: default `display: none`. Muncul hanya di `@media (max-width: 720px)` sebagai `display: flex`, fixed bottom `calc(1rem + env(safe-area-inset-bottom))`, kanan 1rem, min-height 48px, background `--primary`, color putih, shadow. Tambah `body { padding-bottom: 5.5rem; }` hanya di breakpoint itu.
- Hapus selector lama `.thumb-tamu`, `.thumb-dapur`, `.thumb-kamar`, `.thumb-kantor`, `.thumb-tamu-alt`, `.thumb-dapur-alt`, dan `.project-icon`.
- Pada `@media (max-width: 420px)`, `.project.is-featured { grid-column: auto; grid-row: auto; }` supaya tidak menyisakan kolom kosong.
- Pastikan `@media (prefers-reduced-motion: reduce)` tetap mematikan transition dan reveal.

- [ ] **Step 4: Jalankan test dan pastikan lolos**

Run: `cd demo-company-profile-ruang-rapi && python3 -m unittest discover -s tests -v`
Expected: PASS semua.

- [ ] **Step 5: Cek kontras pasangan yang dipakai**

Run:

```bash
python3 /home/asnodt/.config/opencode/skills/antislop-human/contrast-check.py '#ffffff' '#b4552d'
python3 /home/asnodt/.config/opencode/skills/antislop-human/contrast-check.py '#6f665b' '#faf6ef'
python3 /home/asnodt/.config/opencode/skills/antislop-human/contrast-check.py '#6f665b' '#f3ece1'
```

Expected: ketiga pasangan PASS untuk normal text (`4.5:1` ke atas).

- [ ] **Step 6: Commit**

```bash
git add css/styles.css tests/test_demo.py
git commit -m "feat: style Ruang Rapi gallery, lightbox, and mobile CTA"
```

### Task 4: Perilaku lightbox, sticky CTA, dan form WA

**Files:**
- Modify: `js/main.js`
- Test: `tests/test_demo.py`

**Interfaces:**
- Consumes: selector dari Task 2 dan Task 3.
- Produces: `openProject(index)`, `closeProject()`, `moveProject(direction)`, variabel `activeProjectIndex` dan `lastFocusedElement`.

- [ ] **Step 1: Tambah test kontrak JavaScript**

```python
class JsContractTest(unittest.TestCase):
    def test_lightbox_keyboard_and_focus_contract(self):
        for marker in (
            "function openProject(index)",
            "function closeProject()",
            "function moveProject(direction)",
            "activeProjectIndex",
            "lastFocusedElement",
            "event.key === 'Escape'",
            "event.key === 'ArrowLeft'",
            "event.key === 'ArrowRight'",
            "lightboxClose.focus()",
        ):
            self.assertIn(marker, JS)

    def test_wa_popup_fallback_preserved(self):
        self.assertIn("window.open(url, '_blank')", JS)
        self.assertIn("Buka WhatsApp manual", JS)
        self.assertIn('name="pesan"', HTML)

    def test_sticky_cta_observer(self):
        self.assertIn("IntersectionObserver", JS)
        self.assertIn("sticky-consult", JS)
        self.assertIn("is-hidden", JS)
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `cd demo-company-profile-ruang-rapi && python3 -m unittest discover -s tests -v`
Expected: FAIL pada `JsContractTest`.

- [ ] **Step 3: Implementasi lightbox**

Di `js/main.js`, setelah kode filter, tambahkan:

- `const lightbox = document.querySelector('#project-lightbox')` dan konstanta `lightboxImage`, `lightboxTitle`, `lightboxCopy`, `lightboxClose`, `lightboxPrev`, `lightboxNext`, `lightboxWa`.
- `let activeProjectIndex = -1; let lastFocusedElement = null;`
- `openProject(index)`: simpan `document.activeElement` ke `lastFocusedElement`, isi konten dari `projects[index].dataset`, set href WA dengan pesan `Halo Ruang Rapi, saya tertarik dengan contoh {title}. Bisa dibantu?`, hapus `hidden` dari lightbox, set `document.body.style.overflow = 'hidden'`, beri fokus ke `#lightbox-close`.
- `closeProject()`: tambah `hidden`, kembalikan overflow, fokus ke `lastFocusedElement` bila masih ada di DOM.
- `moveProject(direction)`: hitung index melingkar `(index + direction + projects.length) % projects.length`, lalu panggil `openProject` tanpa mengganti `lastFocusedElement`.
- Klik pada `.project` atau tombol di dalamnya memanggil `openProject(Number(project.dataset.projectId) - 1)`.
- Klik `#lightbox-close`, backdrop dengan `[data-close-lightbox]`, atau Escape memanggil `closeProject()`.
- Klik `#lightbox-prev` dan `#lightbox-next` memanggil `moveProject(-1)` dan `moveProject(1)`.
- `keydown` di lightbox menangani Escape, ArrowLeft, ArrowRight, dan Tab. Untuk Tab, jaga fokus tetap di dalam `.lightbox-panel`.

- [ ] **Step 4: Implementasi sticky CTA**

- Amati `#konsultasi` dengan `IntersectionObserver`. Saat section terlihat, tambah kelas `is-hidden` ke `#sticky-consult`. Saat tidak terlihat, hapus kelas itu.
- Pastikan fungsi tidak error bila `IntersectionObserver` tidak tersedia, cukup sembunyikan sticky CTA.

- [ ] **Step 5: Update pesan WA form**

- Hapus `Area:` dari array `message`.
- Pertahankan `Budget:` dengan fallback `Belum ditentukan`.
- Pertahankan blok `window.open` dan fallback link `Buka WhatsApp manual`.

- [ ] **Step 6: Jalankan test dan pastikan lolos**

Run: `cd demo-company-profile-ruang-rapi && python3 -m unittest discover -s tests -v`
Expected: PASS semua.

- [ ] **Step 7: Commit**

```bash
git add js/main.js tests/test_demo.py
git commit -m "feat: add keyboard-safe project lightbox and mobile CTA"
```

### Task 5: Bersihkan aset lama dan verifikasi akhir

**Files:**
- Delete: `assets/after.svg`, `assets/before.svg`
- Modify: `README.md`
- Test: `tests/test_demo.py`

**Interfaces:**
- Consumes: semua task sebelumnya.
- Produces: demo siap dibuka lewat local server.

- [ ] **Step 1: Tambah test tidak ada referensi SVG lama**

```python
class CleanupTest(unittest.TestCase):
    def test_no_old_svg_references(self):
        for source in (HTML, CSS, JS):
            self.assertNotIn("assets/after.svg", source)
            self.assertNotIn("assets/before.svg", source)
```

- [ ] **Step 2: Jalankan test dan pastikan gagal atau lolos tergantung sisa referensi**

Run: `cd demo-company-profile-ruang-rapi && python3 -m unittest discover -s tests -v`
Expected: gagal bila masih ada referensi lama.

- [ ] **Step 3: Hapus aset lama dan update README**

- Hapus `assets/after.svg` dan `assets/before.svg`.
- Di `README.md`, hapus dua baris `after.svg` dan `before.svg` dari struktur file, tambah `DESIGN.md` dan `tests/test_demo.py`.
- Tambah catatan bahwa foto memakai Pexels dan kredit ada di footer.

- [ ] **Step 4: Jalankan seluruh test**

Run: `cd demo-company-profile-ruang-rapi && python3 -m unittest discover -s tests -v`
Expected: PASS semua test.

- [ ] **Step 5: Cek semua URL foto**

Run:

```bash
for url in \
'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop' \
'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop' \
'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop' \
'https://images.pexels.com/photos/6186815/pexels-photo-6186815.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop' \
'https://images.pexels.com/photos/4409366/pexels-photo-4409366.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop' \
'https://images.pexels.com/photos/8288956/pexels-photo-8288956.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop' \
'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop' \
'https://images.pexels.com/photos/16641359/pexels-photo-16641359.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop' \
'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop'; do
  curl -s -o /dev/null -w '%{http_code} %{url_effective}\n' --max-time 15 "$url"
done
```

Expected: sembilan baris diawali `200`.

- [ ] **Step 6: viewport_and_zoom_check**

Jalankan server lokal:

```bash
cd demo-company-profile-ruang-rapi && python3 -m http.server 8766
```

Lalu buka `http://127.0.0.1:8766` dan cek manual di 1440, 1024, 768, dan 390 px. Pada 390 px, zoom ke 200 persen. Expected:

- Tidak ada horizontal scroll.
- Hero foto terlihat penuh, tidak ada box kosong.
- Kart unggulan tidak menyisakan kolom kosong.
- Sticky CTA tidak menutupi field terakhir atau footer.
- Lightbox bisa dibuka dengan klik, ditutup dengan Escape, dan fokus kembali ke kart asal.
- Slider bisa digeser dan diatur dengan ArrowLeft, ArrowRight, Home, End.
- Form WA menghasilkan pesan tanpa baris `Area:`.
- Saat section kontak terlihat, sticky CTA menghilang.

- [ ] **Step 7: Commit akhir**

```bash
git add -A
git commit -m "chore: finish Ruang Rapi demo polish"
```

## Self-review

- Semua bagian `DESIGN.md` punya task: hero (Task 2/3), portofolio dan lightbox (Task 2/3/4), slider (Task 2), ritme dan harga (Task 2), form dan CTA (Task 2/3/4), aksesibilitas (Task 3/4/5), aset (Task 1/5), verifikasi (Task 5).
- Review Focus memiliki test atau langkah verifikasi yang pins, tidak ada yang mengambang.
- Nama konsisten: `openProject`, `closeProject`, `moveProject`, `activeProjectIndex`, `lastFocusedElement`, `#project-lightbox`, `#sticky-consult`.
- Rencana lebih pendek dari hasil implementasi yang diperkirakan, karena sebagian besar perubahan adalah penghapusan dan penggantian markup, bukan logika baru.
