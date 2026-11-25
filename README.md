# Otomasi AI/Workflow + Web Landing Page & Maintenance

Workspace untuk dua fokus jasa freelance:
- **Job 1:** Otomasi & integrasi AI/workflow
- **Job 2:** Web development/landing page + maintenance

## Struktur folder

```text
Otomasi-Web/
├── README.md
├── job1-otomasi-ai-workflow/
│   ├── docs/                  # Catatan, SOP, requirement klien, proposal
│   └── workspace/             # Project/implementasi aktual untuk klien
├── job2-web-landing-maintenance/
│   ├── docs/                  # Brief, checklist maintenance, proposal
│   └── workspace/             # Project website/landing page aktual
└── shared/
    ├── notes/                 # Catatan umum, riset, pricing, ide paket jasa
    └── templates/             # Template proposal, pesan klien, checklist umum
```

## Demo portofolio Job 1

| Demo | Fokus demo |
|---|---|
| `demo-ai-lead-capture` | Workflow n8n lead capture → normalisasi → Google Sheets → klasifikasi AI → notifikasi Slack/email → follow-up H+1. Dilengkapi dokumentasi arsitektur, panduan setup, contoh payload, dan mock dashboard interaktif. |

Workflow siap di-import ke n8n ada di `job1-otomasi-ai-workflow/workspace/demo-ai-lead-capture/workflow/lead-capture-ai-followup.json`. Dashboard demo bisa dibuka lewat `job1-otomasi-ai-workflow/workspace/demo-ai-lead-capture/dashboard/index.html`.

## Demo portofolio Job 2

| Demo | Niche | Fokus demo |
|---|---|---|
| `demo-landingpage-servis-ac` | Jasa servis AC | Landing page lead WhatsApp, daftar layanan, estimasi harga, FAQ |
| `demo-company-profile-ruang-rapi` | Desain interior & renovasi | Company profile, filter portofolio, before/after slider, form konsultasi WhatsApp |
| `demo-landingpage-kedai-kopi` | Kedai kopi | Landing page kedai kopi, menu, profil, suasana tenang, pesan WhatsApp |
| `demo-rental-mobil-multipage` | Rental mobil | Website multi-halaman: katalog dengan filter & search, detail unit, booking dengan kalkulasi harga, FAQ, dan kontak |

Demo Job 2 berupa HTML/CSS/JS statis tanpa dependency. Detail kustomisasi ada di `README.md` tiap demo.

