# Demo — AI Lead Capture & Auto Follow-up

Demo portofolio **Job 1: otomasi & integrasi AI/workflow**. Menunjukkan alur lengkap dari lead masuk sampai klasifikasi AI, notifikasi sales, balasan otomatis, dan follow-up H+1.

## Isi demo

| Bagian | File | Keterangan |
|---|---|---|
| Workflow n8n | `workflow/lead-capture-ai-followup.json` | 13 node, siap di-import ke n8n |
| Contoh payload | `workflow/sample-payload.json` | Data uji untuk webhook |
| Arsitektur | `docs/arsitektur.md` | Diagram alur, kontrak AI, error handling, metrik |
| Panduan setup | `docs/setup.md` | Import, credential, Google Sheets, uji webhook |
| Dashboard | `dashboard/index.html` | Mock UI untuk memantau lead dan hasil klasifikasi AI |

## Alur singkat

1. Form/landing page mengirim JSON ke webhook n8n.
2. Data dinormalisasi dan divalidasi.
3. Lead disimpan ke Google Sheets.
4. AI mengklasifikasi prioritas, skor, intent, dan draft balasan.
5. Lead `high` memicu notifikasi Slack; `high`/`medium` mendapat email balasan.
6. Follow-up otomatis dikirim 1 hari kemudian dan dicatat di sheet log.

## Menjalankan dashboard

Dashboard adalah mock statis tanpa backend:

```bash
cd job1-otomasi-ai-workflow/workspace/demo-ai-lead-capture
python3 -m http.server 8000
```

Buka `http://localhost:8000/dashboard/`.

Fitur dashboard:

- KPI total lead, lead panas, waktu respons, dan follow-up.
- Grafik lead 7 hari terakhir dan distribusi sumber.
- Tabel lead dengan pencarian, filter prioritas, dan status.
- Panel detail berisi ringkasan AI, draft balasan, dan timeline.
- Simulasi lead baru untuk memperlihatkan klasifikasi otomatis.

## Nilai untuk klien

- Mengurangi waktu respons pertama dari jam ke detik.
- Mencegah lead hilang karena follow-up manual terlewat.
- Memberi prioritas ke lead yang paling berpotensi.
- Menyatukan data dari beberapa channel dalam satu alur.
- Mudah dikembangkan ke CRM, WhatsApp API, dan dashboard analitik.

## Batasan demo

- Workflow memakai credential dan ID spreadsheet placeholder.
- Dashboard memakai data contoh di `dashboard/js/data.js`.
- Klasifikasi pada simulasi dashboard berjalan di browser dengan aturan kata kunci; klasifikasi produksi memakai LLM di n8n.
