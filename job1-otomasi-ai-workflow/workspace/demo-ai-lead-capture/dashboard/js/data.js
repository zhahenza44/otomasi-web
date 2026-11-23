/* Data contoh untuk dashboard demo. Semua nama, perusahaan, dan kontak bersifat fiktif. */

const NOW = Date.now();
/* Follow-up yang sudah terkirim sebelum periode contoh dashboard. */
const FOLLOWUPS_ARCHIVED = 22;
const hoursAgo = (hours) => new Date(NOW - hours * 3600000).toISOString();

const LEADS = [
  {
    id: "LD-8F2A",
    name: "Rina Kusuma",
    company: "Kopi Senja",
    role: "Owner",
    email: "rina@kopisenja.id",
    whatsapp: "6281234567890",
    source: "Instagram",
    priority: "high",
    score: 92,
    status: "contacted",
    intent: "otomasi_whatsapp",
    summary: "Butuh otomasi follow-up WhatsApp untuk 3 cabang, budget 8 juta, target mulai bulan depan.",
    message: "Kami punya 3 cabang dan butuh otomasi follow-up WhatsApp untuk lead dari Instagram. Target mulai bulan depan, budget sekitar 8 juta. Bisa minta demo?",
    createdAt: hoursAgo(2),
    responseMins: 4,
    reply: "Halo Rina, terima kasih sudah menghubungi kami. Untuk kebutuhan otomasi follow-up WhatsApp di 3 cabang, kami bisa menyiapkan demo alur lead capture + follow-up otomatis dan estimasi biaya sesuai volume chat. Apakah minggu ini ada waktu untuk diskusi 15 menit?",
    timeline: [
      { time: hoursAgo(2), title: "Lead masuk dari Instagram", type: "in" },
      { time: hoursAgo(1.97), title: "AI mengklasifikasi: prioritas tinggi (92/100)", type: "ai" },
      { time: hoursAgo(1.9), title: "Email balasan pertama terkirim", type: "mail" },
      { time: hoursAgo(1.2), title: "Dibalas via WhatsApp oleh tim sales", type: "chat" },
      { time: hoursAgo(0.5), title: "Follow-up H+1 dijadwalkan", type: "clock" }
    ]
  },
  {
    id: "LD-7C1B",
    name: "Bagas Pratama",
    company: "PT Sinar Jaya Logistik",
    role: "Operations Manager",
    email: "bagas@sinarjaya.co.id",
    whatsapp: "6281299887766",
    source: "Landing Page",
    priority: "high",
    score: 88,
    status: "new",
    intent: "integrasi_workflow",
    summary: "Ingin integrasi form pengiriman ke Google Sheets dan notifikasi otomatis ke tim operasional.",
    message: "Kami menerima 200+ order pengiriman per hari lewat form. Sekarang masih copy-paste ke Sheets dan WhatsApp. Butuh integrasi otomatis supaya tim operasional dapat notifikasi tanpa input manual. Budget tersedia.",
    createdAt: hoursAgo(5),
    responseMins: null,
    reply: "Halo Bagas, terima kasih atas detailnya. Untuk 200+ order per hari, kami bisa merancang alur form → validasi → Google Sheets/CRM → notifikasi WhatsApp atau Slack. Kami siap membuat demo alur dengan data contoh dan estimasi waktu pengerjaan. Boleh kami hubungi hari ini?",
    timeline: [
      { time: hoursAgo(5), title: "Lead masuk dari Landing Page", type: "in" },
      { time: hoursAgo(4.98), title: "AI mengklasifikasi: prioritas tinggi (88/100)", type: "ai" },
      { time: hoursAgo(4.9), title: "Notifikasi Slack dikirim ke tim sales", type: "bell" }
    ]
  },
  {
    id: "LD-6A3C",
    name: "Maya Lestari",
    company: "Klinik Sehat Bersama",
    role: "Pemilik",
    email: "maya@sehatbersama.id",
    whatsapp: "6281355667788",
    source: "Referral",
    priority: "high",
    score: 84,
    status: "followup",
    intent: "otomasi_booking",
    summary: "Butuh pengingat jadwal pasien otomatis dan pengurangan pasien yang tidak datang.",
    message: "Kami ingin mengurangi pasien yang tidak datang dengan pengingat jadwal via WhatsApp. Ada 2 klinik dan sekitar 60 jadwal per hari. Bisa integrasi dengan sistem booking yang sudah ada?",
    createdAt: hoursAgo(26),
    responseMins: 11,
    reply: "Halo Maya, terima kasih sudah menghubungi kami. Pengingat otomatis H-1 dan H-2 jam sebelum jadwal bisa membantu menurunkan no-show. Kami perlu melihat format data booking yang sekarang dipakai. Boleh kirim contoh ekspor data (tanpa data pasien asli) untuk kami tinjau?",
    timeline: [
      { time: hoursAgo(26), title: "Lead masuk dari Referral", type: "in" },
      { time: hoursAgo(25.98), title: "AI mengklasifikasi: prioritas tinggi (84/100)", type: "ai" },
      { time: hoursAgo(25.8), title: "Email balasan pertama terkirim", type: "mail" },
      { time: hoursAgo(24), title: "Follow-up H+1 terkirim", type: "clock" }
    ]
  },
  {
    id: "LD-5B4D",
    name: "Fajar Nugroho",
    company: "CV Teknindo",
    role: "Direktur",
    email: "fajar@teknindo.co.id",
    whatsapp: "6281277889900",
    source: "WhatsApp",
    priority: "high",
    score: 81,
    status: "contacted",
    intent: "web_landing",
    summary: "Butuh landing page + katalog produk untuk produk alat industri, target selesai 3 minggu.",
    message: "Kami butuh landing page company profile plus katalog produk alat industri. Target selesai 3 minggu, sudah ada konten dan foto. Bisa kirim proposal dan contoh portfolio?",
    createdAt: hoursAgo(31),
    responseMins: 8,
    reply: "Halo Fajar, terima kasih. Untuk landing page company profile + katalog produk, kami bisa menyiapkan struktur halaman, desain responsif, dan form inquiry. Dengan konten yang sudah siap, target 3 minggu memungkinkan. Kami kirim proposal dan tautan demo portfolio hari ini.",
    timeline: [
      { time: hoursAgo(31), title: "Lead masuk dari WhatsApp", type: "in" },
      { time: hoursAgo(30.98), title: "AI mengklasifikasi: prioritas tinggi (81/100)", type: "ai" },
      { time: hoursAgo(30.8), title: "Email balasan pertama terkirim", type: "mail" },
      { time: hoursAgo(29), title: "Proposal dikirim", type: "doc" }
    ]
  },
  {
    id: "LD-4E5E",
    name: "Dewi Kartika",
    company: "PT Mitra Medika",
    role: "Marketing Lead",
    email: "dewi@mitramedika.id",
    whatsapp: "6281388990011",
    source: "Landing Page",
    priority: "high",
    score: 79,
    status: "won",
    intent: "dashboard_analitik",
    summary: "Butuh dashboard lead terpusat dari 3 channel dan laporan mingguan otomatis.",
    message: "Kami sudah closing untuk pembuatan dashboard lead. Terima kasih, tim sangat responsif. Semoga kerja samanya lancar.",
    createdAt: hoursAgo(70),
    responseMins: 6,
    reply: "Halo Dewi, terima kasih atas kepercayaannya. Kami akan mulai dengan sesi kickoff minggu ini dan menyiapkan akses data dari 3 channel. Update progres akan dikirim setiap Jumat.",
    timeline: [
      { time: hoursAgo(70), title: "Lead masuk dari Landing Page", type: "in" },
      { time: hoursAgo(69.98), title: "AI mengklasifikasi: prioritas tinggi (79/100)", type: "ai" },
      { time: hoursAgo(69.9), title: "Email balasan pertama terkirim", type: "mail" },
      { time: hoursAgo(48), title: "Meeting discovery selesai", type: "chat" },
      { time: hoursAgo(24), title: "Deal ditandai won", type: "won" }
    ]
  },
  {
    id: "LD-3F6F",
    name: "Dimas Anggara",
    company: "Arunika Properti",
    role: "Founder",
    email: "dimas@arunikaproperti.id",
    whatsapp: "6281211223344",
    source: "Landing Page",
    priority: "medium",
    score: 64,
    status: "new",
    intent: "web_landing",
    summary: "Ingin landing page untuk project perumahan baru, tetapi belum menentukan timeline dan konten.",
    message: "Kami mau bikin landing page untuk project perumahan baru. Konten dan foto belum siap, masih tahap konsep. Kira-kira berapa estimasi biaya dan waktunya?",
    createdAt: hoursAgo(8),
    responseMins: null,
    reply: "Halo Dimas, terima kasih. Untuk landing page project perumahan, kami bisa mulai dari struktur halaman dan wireframe sambil menunggu konten. Estimasi biaya tergantung jumlah halaman dan fitur (galeri, form, peta). Kami bisa kirim rentang harga dan contoh setelah tahu target peluncuran.",
    timeline: [
      { time: hoursAgo(8), title: "Lead masuk dari Landing Page", type: "in" },
      { time: hoursAgo(7.98), title: "AI mengklasifikasi: prioritas sedang (64/100)", type: "ai" },
      { time: hoursAgo(7.9), title: "Draft balasan disiapkan untuk tim sales", type: "doc" }
    ]
  },
  {
    id: "LD-2G7H",
    name: "Nadia Putri",
    company: "Studio Foto Lensa",
    role: "Owner",
    email: "nadia@studiolensa.id",
    whatsapp: "6281244556677",
    source: "Instagram",
    priority: "medium",
    score: 58,
    status: "followup",
    intent: "booking_system",
    summary: "Ingin form booking dengan pilihan paket dan pembayaran DP, tetapi masih membandingkan penyedia.",
    message: "Saya sedang cari yang bisa buat form booking paket foto + pembayaran DP. Masih banding-bandingkan beberapa penyedia. Boleh dikirim contoh dan kisaran harga?",
    createdAt: hoursAgo(28),
    responseMins: 19,
    reply: "Halo Nadia, terima kasih sudah mempertimbangkan kami. Kami bisa membuat form booking dengan pilihan paket, jadwal, dan pembayaran DP via Midtrans/Xendit. Saya kirim contoh alur dan kisaran harga agar lebih mudah dibandingkan.",
    timeline: [
      { time: hoursAgo(28), title: "Lead masuk dari Instagram", type: "in" },
      { time: hoursAgo(27.98), title: "AI mengklasifikasi: prioritas sedang (58/100)", type: "ai" },
      { time: hoursAgo(27.7), title: "Email balasan pertama terkirim", type: "mail" },
      { time: hoursAgo(4), title: "Follow-up H+1 terkirim", type: "clock" }
    ]
  },
  {
    id: "LD-1H8I",
    name: "Hendra Wijaya",
    company: "Resto Sambal Ijo",
    role: "Manajer Operasional",
    email: "hendra@sambalijo.id",
    whatsapp: "6281366778899",
    source: "Landing Page",
    priority: "medium",
    score: 55,
    status: "contacted",
    intent: "qr_menu",
    summary: "Butuh menu digital QR dan integrasi pesanan WhatsApp untuk 2 cabang.",
    message: "Kami butuh menu digital QR yang bisa di-update sendiri, plus pesanan masuk ke WhatsApp. Ada 2 cabang. Bisa?",
    createdAt: hoursAgo(46),
    responseMins: 14,
    reply: "Halo Hendra, bisa. Menu digital QR dengan panel admin sederhana memungkinkan tim memperbarui harga dan stok tanpa developer. Pesanan bisa diarahkan ke WhatsApp per cabang. Kami siap demo singkat minggu ini.",
    timeline: [
      { time: hoursAgo(46), title: "Lead masuk dari Landing Page", type: "in" },
      { time: hoursAgo(45.98), title: "AI mengklasifikasi: prioritas sedang (55/100)", type: "ai" },
      { time: hoursAgo(45.8), title: "Email balasan pertama terkirim", type: "mail" }
    ]
  },
  {
    id: "LD-0I9J",
    name: "Rizky Ramadhan",
    company: "Barbershop Rapih",
    role: "Owner",
    email: "rizky@rapih.id",
    whatsapp: "6281177889900",
    source: "Referral",
    priority: "medium",
    score: 52,
    status: "contacted",
    intent: "booking_system",
    summary: "Ingin sistem booking antrean sederhana, masih mempertimbangkan budget.",
    message: "Saya mau sistem booking antrean online untuk barbershop. Budget masih terbatas, mungkin bisa mulai dari yang sederhana dulu.",
    createdAt: hoursAgo(52),
    responseMins: 22,
    reply: "Halo Rizky, terima kasih. Kami bisa mulai dari versi sederhana: form booking, pilihan jadwal, dan notifikasi WhatsApp. Jika budget terbatas, kita bisa buat fase pertama dulu lalu dikembangkan bertahap. Saya kirim opsi paketnya.",
    timeline: [
      { time: hoursAgo(52), title: "Lead masuk dari Referral", type: "in" },
      { time: hoursAgo(51.98), title: "AI mengklasifikasi: prioritas sedang (52/100)", type: "ai" },
      { time: hoursAgo(51.7), title: "Email balasan pertama terkirim", type: "mail" }
    ]
  },
  {
    id: "LD-9J0K",
    name: "Sinta Wulandari",
    company: "Toko Bunga Mekar",
    role: "Owner",
    email: "sinta@bungamekar.id",
    whatsapp: "6281199001122",
    source: "WhatsApp",
    priority: "low",
    score: 38,
    status: "new",
    intent: "general_inquiry",
    summary: "Baru menanyakan apakah bisa buat website toko bunga, belum ada kebutuhan mendesak.",
    message: "Halo, mau tanya saja. Apakah bisa buat website untuk toko bunga? Belum tahu mau mulai kapan, sekadar info dulu.",
    createdAt: hoursAgo(12),
    responseMins: null,
    reply: "Halo Sinta, tentu bisa. Untuk toko bunga, website bisa berisi katalog, galeri, dan form pesanan yang terhubung ke WhatsApp. Jika nanti sudah siap, kami dengan senang hati membantu. Saya kirim contoh sederhana untuk referensi.",
    timeline: [
      { time: hoursAgo(12), title: "Lead masuk dari WhatsApp", type: "in" },
      { time: hoursAgo(11.98), title: "AI mengklasifikasi: prioritas rendah (38/100)", type: "ai" }
    ]
  },
  {
    id: "LD-8K1L",
    name: "Ayu Safitri",
    company: "Sekolah Alam Ceria",
    role: "Admin",
    email: "ayu@alamceria.sch.id",
    whatsapp: "6281255667788",
    source: "Instagram",
    priority: "low",
    score: 31,
    status: "new",
    intent: "general_inquiry",
    summary: "Menanyakan biaya pembuatan website sekolah, belum ada anggaran.",
    message: "Permisi, mau tanya biaya bikin website sekolah. Saat ini belum ada anggaran, hanya ingin tahu kisaran harga.",
    createdAt: hoursAgo(34),
    responseMins: null,
    reply: "Halo Ayu, terima kasih sudah bertanya. Kisaran biaya website sekolah tergantung jumlah halaman dan fitur (profil, berita, pendaftaran). Saya kirim rentang harga dan contoh agar bisa jadi bahan diskusi internal.",
    timeline: [
      { time: hoursAgo(34), title: "Lead masuk dari Instagram", type: "in" },
      { time: hoursAgo(33.98), title: "AI mengklasifikasi: prioritas rendah (31/100)", type: "ai" },
      { time: hoursAgo(33.9), title: "Masuk daftar nurture", type: "clock" }
    ]
  },
  {
    id: "LD-7L2M",
    name: "Yoga Prakoso",
    company: "Bengkel Motor Cepat",
    role: "Owner",
    email: "",
    whatsapp: "6281233445566",
    source: "WhatsApp",
    priority: "low",
    score: 29,
    status: "new",
    intent: "general_inquiry",
    summary: "Hanya mengirim pesan singkat menanyakan alamat dan jam buka.",
    message: "Halo, ini bengkel motor ya? Minta alamat dan jam bukanya. Terima kasih.",
    createdAt: hoursAgo(58),
    responseMins: null,
    reply: "Halo Yoga, sepertinya Anda menghubungi nomor yang kurang tepat. Kami adalah penyedia jasa otomasi dan web development, bukan bengkel. Jika ada kebutuhan website atau otomasi untuk usaha Anda, kami siap membantu.",
    timeline: [
      { time: hoursAgo(58), title: "Lead masuk dari WhatsApp", type: "in" },
      { time: hoursAgo(57.98), title: "AI mengklasifikasi: prioritas rendah (29/100)", type: "ai" },
      { time: hoursAgo(57.9), title: "Ditandai di luar layanan", type: "clock" }
    ]
  }
];

const DAILY_LEADS = [
  { day: "Sen", value: 1 },
  { day: "Sel", value: 2 },
  { day: "Rab", value: 1 },
  { day: "Kam", value: 2 },
  { day: "Jum", value: 3 },
  { day: "Sab", value: 1 },
  { day: "Min", value: 2 }
];

const SOURCES = [
  { name: "Landing Page", percent: 33, color: "#4f46e5" },
  { name: "Instagram", percent: 25, color: "#0ea5e9" },
  { name: "WhatsApp", percent: 25, color: "#10b981" },
  { name: "Referral", percent: 17, color: "#f59e0b" }
];

const STATUS_LABELS = {
  new: "Baru",
  contacted: "Dihubungi",
  followup: "Follow-up",
  won: "Closing"
};

const PRIORITY_LABELS = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah"
};

const SOURCE_ICONS = {
  "Landing Page": "globe",
  Instagram: "camera",
  WhatsApp: "chat",
  Referral: "users"
};
