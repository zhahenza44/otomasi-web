# Setup — AI Lead Capture & Auto Follow-up

## Yang dibutuhkan

- n8n (cloud atau self-hosted, versi 1.60+ disarankan)
- Akun Google dengan akses Google Sheets
- OpenAI API key
- Slack workspace (opsional, untuk notifikasi sales)
- Akun Gmail (atau SMTP) untuk pengiriman email

## Langkah import

1. Buka n8n → **Workflows** → **Import from File**.
2. Pilih `workflow/lead-capture-ai-followup.json`.
3. Simpan workflow.

## Konfigurasi credential

| Node | Credential |
|---|---|
| `Simpan Lead ke Sheets`, `Catat Follow-up` | Google Sheets OAuth2 |
| `AI Klasifikasi Lead` | OpenAI API |
| `Notifikasi Slack Sales` | Slack OAuth2 |
| `Email Balasan Pertama`, `Email Balasan Medium`, `Email Follow-up H+1` | Gmail OAuth2 |

## Konfigurasi Google Sheets

1. Buat spreadsheet baru.
2. Buat dua sheet: **Leads** dan **Follow-up Log**.
3. Isi header `Leads`:

   ```text
   lead_id | created_at | name | email | whatsapp | company | source | budget | message | consent | status
   ```

4. Isi header `Follow-up Log`:

   ```text
   lead_id | name | priority | followup_sent_at | channel | status
   ```

5. Ganti `PASTE_GOOGLE_SHEET_ID` pada kedua node Google Sheets dengan ID spreadsheet.
6. Sesuaikan nama sheet jika berbeda.

## Environment variable

Tambahkan di n8n:

```bash
SALES_EMAIL=sales@perusahaan.com
```

`SALES_EMAIL` dipakai sebagai fallback ketika lead tidak mencantumkan email.

## Aktifkan workflow

1. Klik **Active** di kanan atas.
2. Salin **Production URL** dari node Webhook, contoh:

   ```text
   https://n8n.domain.com/webhook/lead-capture
   ```

3. Kirim payload uji:

   ```bash
   curl -X POST "https://n8n.domain.com/webhook/lead-capture" \
     -H "Content-Type: application/json" \
     -d @workflow/sample-payload.json
   ```

4. Cek:
   - baris baru di sheet **Leads**,
   - notifikasi Slack (jika lead high),
   - email balasan terkirim,
   - eksekusi sukses di n8n.

## Uji tanpa mengirim email

Matikan sementara node Gmail dan Slack (klik kanan → **Deactivate**), lalu jalankan **Test workflow**. Periksa output `Parse Hasil AI` untuk memastikan klasifikasi masuk akal.

## Kustomisasi

- **Ganti bahasa balasan** → ubah prompt di node `AI Klasifikasi Lead`.
- **Ganti channel** → tukar node Gmail dengan WhatsApp Business API/HTTP Request.
- **Ubah aturan prioritas** → sesuaikan prompt dan kondisi `Switch Prioritas`.
- **Ganti CRM** → ganti node Google Sheets dengan HubSpot, Airtable, atau Notion.
- **Tambahkan deduplikasi** → sisipkan node `Remove Duplicates` setelah `Normalisasi Lead`.

## Catatan demo

- Workflow ini disiapkan sebagai **template portofolio**. Credential, ID spreadsheet, dan channel Slack harus diisi sendiri.
- Nomor WhatsApp, email, dan data pada `sample-payload.json` adalah fiktif.
- Untuk produksi, tambahkan logging, retry, monitoring, dan mekanisme opt-out.
