const WHATSAPP_NUMBER = "6281234567890";

const CARS = [
  {
    id: "avanza",
    name: "Toyota Avanza",
    type: "mpv",
    typeLabel: "MPV",
    price: 350000,
    seats: 7,
    transmission: "Manual",
    fuel: "Bensin",
    luggage: 2,
    rating: 4.8,
    trips: 214,
    badge: "Terlaris",
    image: "assets/car-mpv.svg",
    description: "Pilihan paling populer untuk perjalanan keluarga dan rombongan kecil. Kabin lega, irit, dan mudah dikendarai di dalam kota maupun luar kota.",
    features: ["AC double blower", "Audio Bluetooth", "USB charger", "Kamera belakang"]
  },
  {
    id: "innova",
    name: "Toyota Innova Zenix",
    type: "mpv",
    typeLabel: "MPV",
    price: 550000,
    seats: 7,
    transmission: "Automatic",
    fuel: "Hybrid",
    luggage: 3,
    rating: 4.9,
    trips: 168,
    badge: "Premium",
    image: "assets/car-mpv-blue.svg",
    description: "MPV premium dengan kabin senyap dan konsumsi bahan bakar hybrid. Nyaman untuk perjalanan jauh bersama keluarga.",
    features: ["Kabin hybrid senyap", "Captain seat", "AC otomatis", "Cruise control"]
  },
  {
    id: "xpander",
    name: "Mitsubishi Xpander",
    type: "mpv",
    typeLabel: "MPV",
    price: 400000,
    seats: 7,
    transmission: "Automatic",
    fuel: "Bensin",
    luggage: 2,
    rating: 4.8,
    trips: 143,
    badge: "",
    image: "assets/car-mpv-silver.svg",
    description: "Desain modern dengan kabin fleksibel. Cocok untuk keluarga muda yang butuh kenyamanan ekstra tanpa biaya berlebih.",
    features: ["Ground clearance tinggi", "AC digital", "Audio touchscreen", "Sensor parkir"]
  },
  {
    id: "fortuner",
    name: "Toyota Fortuner",
    type: "suv",
    typeLabel: "SUV",
    price: 750000,
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    luggage: 3,
    rating: 4.9,
    trips: 96,
    badge: "Favorit",
    image: "assets/car-suv.svg",
    description: "SUV tangguh untuk medan jalan yang menantang. Posisi duduk tinggi, tenaga besar, dan tetap nyaman untuk perjalanan dinas.",
    features: ["Mesin diesel bertenaga", "Kabin 7 penumpang", "AC dual zone", "Mode berkendara"]
  },
  {
    id: "crv",
    name: "Honda CR-V",
    type: "suv",
    typeLabel: "SUV",
    price: 650000,
    seats: 5,
    transmission: "Automatic",
    fuel: "Bensin",
    luggage: 3,
    rating: 4.8,
    trips: 88,
    badge: "",
    image: "assets/car-suv-bronze.svg",
    description: "SUV kompak dengan handling halus dan kabin lapang. Pas untuk perjalanan bisnis maupun liburan singkat.",
    features: ["Sunroof", "Kursi kulit", "Honda Sensing", "Bagasi luas"]
  },
  {
    id: "camry",
    name: "Toyota Camry",
    type: "sedan",
    typeLabel: "Sedan",
    price: 800000,
    seats: 5,
    transmission: "Automatic",
    fuel: "Bensin",
    luggage: 3,
    rating: 4.9,
    trips: 54,
    badge: "Premium",
    image: "assets/car-sedan.svg",
    description: "Sedan eksekutif untuk perjalanan bisnis yang berkesan. Interior tenang, suspensi nyaman, dan tampilan elegan.",
    features: ["Kursi elektrik", "JBL audio", "AC dual zone", "Ambient lighting"]
  },
  {
    id: "city",
    name: "Honda City",
    type: "sedan",
    typeLabel: "Sedan",
    price: 450000,
    seats: 5,
    transmission: "Automatic",
    fuel: "Bensin",
    luggage: 2,
    rating: 4.7,
    trips: 121,
    badge: "Hemat",
    image: "assets/car-sedan-red.svg",
    description: "Sedan ringkas yang irit dan lincah di jalanan kota. Pilihan cerdas untuk mobilitas harian dan perjalanan dinas singkat.",
    features: ["Bagasi 519 L", "AC digital", "Audio touchscreen", "Keyless entry"]
  },
  {
    id: "agya",
    name: "Toyota Agya",
    type: "hatchback",
    typeLabel: "Hatchback",
    price: 275000,
    seats: 5,
    transmission: "Manual",
    fuel: "Bensin",
    luggage: 1,
    rating: 4.7,
    trips: 203,
    badge: "Hemat",
    image: "assets/car-hatchback.svg",
    description: "Mobil kecil yang gesit dan sangat irit bahan bakar. Ideal untuk mobilitas dalam kota dengan biaya minimal.",
    features: ["Irit bahan bakar", "Parkir mudah", "AC dingin", "USB charger"]
  }
];

const DRIVER_FEE_PER_DAY = 150000;
const DELIVERY_FEES = { office: 0, city: 50000, airport: 100000 };
const DELIVERY_LABELS = {
  office: "Ambil di kantor",
  city: "Antar dalam kota (+Rp50.000)",
  airport: "Antar bandara (+Rp100.000)"
};

function formatRupiah(value) {
  return "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(value));
}

function getCarById(id) {
  return CARS.find((car) => car.id === id) || null;
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getWhatsAppUrl(message) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

function calcBooking(car, days, withDriver, deliveryKey) {
  const safeDays = Math.max(1, Math.min(30, Number(days) || 1));
  const base = car.price * safeDays;
  const driverFee = withDriver ? DRIVER_FEE_PER_DAY * safeDays : 0;
  const deliveryFee = DELIVERY_FEES[deliveryKey] || 0;
  const discount = safeDays >= 7 ? Math.round(base * 0.1) : 0;
  const total = base + driverFee + deliveryFee - discount;

  return { days: safeDays, base, driverFee, deliveryFee, discount, total };
}

function carCardHtml(car, extraQuery) {
  const suffix = extraQuery ? "&" + extraQuery : "";
  const badgeClass = car.badge === "Terlaris" || car.badge === "Hemat" ? "is-accent" : "";

  return `
    <article class="car-card">
      <div class="car-media">
        ${car.badge ? `<span class="car-badge ${badgeClass}">${car.badge}</span>` : ""}
        <img src="${car.image}" alt="Ilustrasi ${car.name}" loading="lazy">
      </div>
      <div class="car-body">
        <div class="car-top">
          <div>
            <h3 class="car-title">${car.name}</h3>
            <p class="car-type">${car.typeLabel} • ${car.seats} penumpang</p>
          </div>
          <span class="car-rating">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.3l6.5-.9z"/></svg>
            ${car.rating.toFixed(1)}
          </span>
        </div>
        <ul class="car-meta">
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14M12 5v14M18 5v14M6 5h12M6 12h6"/></svg>${car.transmission}</li>
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M2 21h14"/><path d="M13 9h3l3 3v5a2 2 0 0 1-4 0v-3h-2"/></svg>${car.fuel}</li>
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>${car.luggage} bagasi</li>
        </ul>
        <div class="car-foot">
          <p class="car-price">Mulai dari<strong>${formatRupiah(car.price)}<span style="font-size:.72rem;font-weight:600;color:var(--muted)"> /hari</span></strong></p>
          <div class="car-actions">
            <a class="btn btn-ghost btn-sm" href="detail.html?id=${car.id}${suffix}">Detail</a>
            <a class="btn btn-sm" href="booking.html?id=${car.id}${suffix}">Sewa</a>
          </div>
        </div>
      </div>
    </article>`;
}
