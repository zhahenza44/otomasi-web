# Freelance: Otomasi AI/Workflow + Web Landing Page & Maintenance

Workspace terpadu untuk dua fokus jasa freelance:
- **Job 1:** Otomasi & integrasi AI/workflow
- **Job 2:** Web development/landing page + maintenance

## Struktur folder

```text
Freelance-Otomasi-Web/
├── README.md
├── job1-otomasi-ai-workflow/
│   ├── docs/                  # Catatan, SOP, requirement klien, proposal
│   ├── resources/             # Repo referensi/template dari GitHub
│   └── workspace/             # Project/implementasi aktual untuk klien
├── job2-web-landing-maintenance/
│   ├── docs/                  # Brief, checklist maintenance, proposal
│   ├── resources/             # Template/starter landing page dari GitHub
│   └── workspace/             # Project website/landing page aktual
└── shared/
    ├── notes/                 # Catatan umum, riset, pricing, ide paket jasa
    └── templates/             # Template proposal, pesan klien, checklist umum
```

## Resource GitHub yang sudah di-clone

### Job 1 — `job1-otomasi-ai-workflow/resources/`
| Repo | Sumber | Kegunaan |
|---|---|---|
| `awesome-n8n-templates/` | https://github.com/enescingoz/awesome-n8n-templates | Kumpulan template workflow n8n (otomasi, AI agent, RAG, integrasi layanan). |
| `n8n-ai-automations/` | https://github.com/lucaswalter/n8n-ai-automations | Contoh workflow & automasi AI berbasis n8n. |
| `Hexabot/` | https://github.com/hexabot-ai/Hexabot | Platform/workflow automation & conversational/agent runtime sebagai referensi arsitektur. |
| `awesome-ai-agent-platforms/` | https://github.com/Agenta-AI/awesome-ai-agent-platforms | Kurasi platform/framework agent & workflow automation open-source. |
| `patchwork/` | https://github.com/patched-codes/patchwork | Referensi framework agentic workflow automation. |

### Job 2 — `job2-web-landing-maintenance/resources/`
| Repo | Sumber | Kegunaan |
|---|---|---|
| `tailwind-landing-page-template/` | https://github.com/cruip/tailwind-landing-page-template | Template landing page (React/Next.js + Tailwind). |
| `Next-JS-Landing-Page-Starter-Template/` | https://github.com/ixartz/Next-JS-Landing-Page-Starter-Template | Starter Next.js + TypeScript + Tailwind siap pakai. |
| `shadcn-landing-page/` | https://github.com/nobruf/shadcn-landing-page | Landing page Next.js + shadcn/ui + Tailwind. |
| `astro-cloudflare-landing-starter/` | https://github.com/adcuelloa/astro-cloudflare-landing-starter | Starter Astro untuk Cloudflare Pages (SEO, i18n, content collections). |
| `astro-stefan-starter/` | https://github.com/stefanbobrowski/astro-stefan-starter | Starter Astro + TypeScript dengan fokus komponen & SEO. |

## Demo portofolio Job 2

| Demo | Niche | Fokus demo | Lokasi |
|---|---|---|---|
| `demo-landingpage-servis-ac` | Jasa servis AC | Landing page lead WhatsApp, daftar layanan, estimasi harga, FAQ | `job2-web-landing-maintenance/workspace/demo-landingpage-servis-ac/` |
| `demo-company-profile-ruang-rapi` | Desain interior & renovasi | Company profile, filter portofolio, before/after slider, form konsultasi WhatsApp | `job2-web-landing-maintenance/workspace/demo-company-profile-ruang-rapi/` |
| `demo-landingpage-kedai-kopi` | Kedai kopi | Landing page kedai kopi, menu, profil, suasana tenang, pesan WhatsApp | `job2-web-landing-maintenance/workspace/demo-landingpage-kedai-kopi/` |

Keduanya berupa HTML/CSS/JS statis tanpa dependency. Buka `index.html` langsung di browser, atau jalankan local server dari folder masing-masing. Detail kustomisasi ada di `README.md` tiap demo.

## Saran alur kerja
1. **Job 1:** pilih platform utama (mis. n8n) dan gunakan `resources/` sebagai referensi template/pola, lalu kerjakan implementasi klien di `job1-otomasi-ai-workflow/workspace/`.
2. **Job 2:** pilih base stack (Next.js atau Astro) dari `resources/`, salin/duplikasi ke `job2-web-landing-maintenance/workspace/<nama-project-klien>/`, lalu kustomisasi.
3. Simpan brief, requirement, kredensial non-rahasia (catatan akses), dan checklist di folder `docs/` masing-masing job.
4. Gunakan `shared/` untuk materi lintas job (proposal, pricing, template komunikasi klien).

> Catatan: repo di `resources/` di-clone sebagai referensi (shallow clone). Untuk project klien, buat salinan terpisah di `workspace/` agar riwayat dan perubahan tetap rapi.
