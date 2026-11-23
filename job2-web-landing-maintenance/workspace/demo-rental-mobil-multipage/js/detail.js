(function () {
  "use strict";

  const root = document.querySelector("#detail-root");
  if (!root) return;

  const car = getCarById(getParam("id"));
  const crumb = document.querySelector("#crumb-name");

  if (!car) {
    if (crumb) crumb.textContent = "Tidak ditemukan";
    root.innerHTML = `
      <div class="not-found">
        <h1>Mobil tidak ditemukan</h1>
        <p>Unit yang kamu cari mungkin sudah tidak tersedia. Silakan lihat katalog untuk pilihan lain.</p>
        <a class="btn" href="katalog.html">Lihat katalog mobil</a>
      </div>`;
    return;
  }

  document.title = `${car.name} — Arunika Drive`;
  if (crumb) crumb.textContent = car.name;

  const days = getParam("days");
  const start = getParam("start");
  const bookingParams = new URLSearchParams({ id: car.id });
  if (days) bookingParams.set("days", days);
  if (start) bookingParams.set("start", start);

  const waMessage = getWhatsAppUrl(`Halo Arunika Drive, saya ingin bertanya tentang ${car.name}.`);
  const starIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.3l6.5-.9z"/></svg>';

  const specs = [
    { icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 19v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V19"/><circle cx="9" cy="7" r="3.2"/><path d="M22 19v-1.5a4 4 0 0 0-3-3.87"/><path d="M16 3.6a3.2 3.2 0 0 1 0 6.2"/></svg>', label: "Kapasitas", value: `${car.seats} penumpang` },
    { icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14M12 5v14M18 5v14M6 5h12M6 12h6"/></svg>', label: "Transmisi", value: car.transmission },
    { icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M2 21h14"/><path d="M13 9h3l3 3v5a2 2 0 0 1-4 0v-3h-2"/></svg>', label: "Bahan bakar", value: car.fuel },
    { icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>', label: "Bagasi", value: `${car.luggage} koper` }
  ];

  const includes = [
    "Asuransi dasar selama masa sewa",
    "Pemeriksaan unit sebelum serah terima",
    "Bantuan darurat 24 jam",
    ...car.features
  ];

  root.innerHTML = `
    <div class="detail-grid">
      <div class="detail-media-col">
        <div class="detail-visual">
          ${car.badge ? `<span class="car-badge is-accent">${car.badge}</span>` : ""}
          <img src="${car.image}" alt="Ilustrasi ${car.name}">
        </div>
        <div class="detail-support">
          <div class="support-head">
            <span class="support-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v6h6M8.5 13h7M8.5 17h5"/></svg></span>
            <h2>Syarat sewa singkat</h2>
          </div>
          <ul class="check-list">
            <li>KTP dan SIM A untuk sewa lepas kunci</li>
            <li>Deposit Rp500.000, dikembalikan setelah unit dicek</li>
            <li>BBM, tol, dan parkir ditanggung penyewa</li>
          </ul>
          <p class="support-note">Butuh antar-jemput? Tambah Rp50.000 dalam kota atau Rp100.000 bandara.</p>
        </div>
        <div class="detail-facts">
          <div class="detail-fact"><strong>2023</strong><span>Tahun unit</span></div>
          <div class="detail-fact"><strong>24/7</strong><span>Bantuan darurat</span></div>
          <div class="detail-fact"><strong>Gratis</strong><span>Ambil di kantor</span></div>
        </div>
      </div>
      <div class="detail-info">
        <p class="eyebrow">${car.typeLabel} • ${car.trips} perjalanan</p>
        <div class="detail-title-row">
          <h1>${car.name}</h1>
          <span class="car-rating">${starIcon}${car.rating.toFixed(1)}</span>
        </div>
        <p style="color: var(--muted); margin-bottom: 0;">${car.description}</p>
        <div class="detail-price"><strong>${formatRupiah(car.price)}</strong><span>/ hari</span></div>
        <div class="spec-grid">
          ${specs.map((spec) => `
            <div class="spec-item">
              ${spec.icon}
              <div><small>${spec.label}</small><strong>${spec.value}</strong></div>
            </div>`).join("")}
        </div>
        <h2 style="font-size: 1.05rem; margin-bottom: 0.7rem;">Yang termasuk</h2>
        <ul class="check-list">
          ${includes.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <div class="detail-actions">
          <a class="btn" href="booking.html?${bookingParams.toString()}">Sewa mobil ini</a>
          <a class="btn btn-ghost" href="${waMessage}" target="_blank" rel="noopener">Tanya via WhatsApp</a>
        </div>
        <p class="detail-note">Harga belum termasuk BBM, tol, dan parkir. Sewa 7 hari atau lebih mendapat diskon 10%.</p>
      </div>
    </div>
    <div class="related">
      <h2>Pilihan lain yang mungkin cocok</h2>
      <div class="cars-grid" id="related-grid"></div>
    </div>`;

  const related = CARS.filter((item) => item.id !== car.id)
    .sort((a, b) => (a.type === car.type ? -1 : 0) - (b.type === car.type ? -1 : 0))
    .slice(0, 3);

  document.querySelector("#related-grid").innerHTML = related.map((item) => carCardHtml(item)).join("");
})();
