# AGENTS.md

## 1. Project Overview

MFC Monitoring adalah aplikasi web untuk memantau dan mengelola eksperimen
Microbial Fuel Cell (MFC).

Aplikasi digunakan untuk:

- Mengelola data substrat.
- Membuat dan mengontrol sesi eksperimen MFC.
- Menerima data sensor dari ESP32 dan INA219.
- Menampilkan data MFC secara realtime.
- Menyimpan seluruh hasil pengukuran ke database.
- Menampilkan riwayat sesi eksperimen.
- Membandingkan hasil beberapa sesi eksperimen.

Alur utama sistem:

MFC
→ INA219
→ ESP32
→ Wi-Fi
→ Next.js API
→ Supabase PostgreSQL
→ Dashboard Realtime


## 2. Technology Stack

Gunakan teknologi berikut kecuali terdapat alasan teknis yang kuat untuk
mengubahnya:

- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- Supabase
- PostgreSQL
- Recharts
- Lucide React
- next-themes
- Git
- GitHub
- Vercel


## 3. General Development Principles

Prioritaskan:

1. Readability
2. Maintainability
3. Reusability
4. Type safety
5. Security
6. Consistent UI
7. Separation of concerns

Jangan membuat implementasi yang terlalu kompleks jika kebutuhan dapat
diselesaikan dengan solusi yang lebih sederhana.

Jangan membuat abstraction hanya untuk menghindari beberapa baris kode.
Abstraction harus memiliki tujuan yang jelas.

Jangan menduplikasi logic atau UI yang dapat digunakan kembali.


## 4. Project Architecture

Gunakan Next.js App Router.

Struktur utama:

app/
├── (dashboard)/
│   ├── page.tsx
│   ├── substrat/
│   │   └── page.tsx
│   ├── sesi/
│   │   └── page.tsx
│   ├── riwayat/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── perbandingan/
│       └── page.tsx
│
├── api/
│   └── sensor/
│       └── route.ts
│
├── layout.tsx
└── globals.css

components/
├── layout/
├── ui/
├── dashboard/
├── substrat/
├── sesi/
├── riwayat/
└── perbandingan/

lib/
├── supabase/
│   ├── client.ts
│   └── server.ts
├── types/
│   └── database.ts
└── utils.ts

hooks/
├── useRealtimeSession.ts
└── useTheme.ts

public/


## 5. Page Structure

Aplikasi memiliki halaman utama berikut:

### Dashboard

Route:

/

Purpose:

- Menampilkan sesi yang sedang aktif.
- Menampilkan tegangan realtime.
- Menampilkan arus realtime.
- Menampilkan daya realtime.
- Menampilkan waktu berjalan sesi.
- Menampilkan informasi sesi.
- Menampilkan grafik realtime.
- Menampilkan pembacaan sensor terbaru.

Dashboard tidak digunakan untuk membuat sesi baru.


### Substrat

Route:

/substrat

Purpose:

- Create substrat.
- Read substrat.
- Update substrat.
- Delete substrat.

Substrat merupakan master data.

Satu substrat dapat digunakan pada banyak sesi.


### Kontrol Sesi

Route:

/sesi

Purpose:

- Membuat sesi eksperimen.
- Memilih substrat.
- Mengisi pH.
- Mengisi suhu.
- Mengisi volume.
- Mengisi resistor beban.
- Memulai sesi.
- Mengakhiri sesi.

Ketika sesi dimulai:

status = running

Ketika sesi diakhiri:

status = completed


### Riwayat Sesi

Route:

/riwayat

Purpose:

- Menampilkan seluruh sesi.
- Menampilkan substrat yang digunakan.
- Menampilkan waktu mulai.
- Menampilkan durasi.
- Menampilkan status.
- Membuka detail sesi.

Detail sesi:

/riwayat/[id]


### Perbandingan

Route:

/perbandingan

Purpose:

- Memilih beberapa sesi.
- Membandingkan hasil beberapa sesi.
- Menampilkan tabel ringkasan.
- Menampilkan grafik perbandingan tegangan.
- Menampilkan grafik perbandingan arus.
- Menampilkan grafik perbandingan daya.

Perbandingan tidak disimpan sebagai tabel database.

Perbandingan dihitung dari data sesi dan sensor readings yang sudah tersedia.


## 6. Database Architecture

Database menggunakan Supabase PostgreSQL.

Tabel utama:

1. substrates
2. sessions
3. sensor_readings

Relasi:

substrates
    │
    │ 1 : N
    ▼
sessions
    │
    │ 1 : N
    ▼
sensor_readings


## 7. Substrates Table

Table:

substrates

Columns:

- id
- name
- description
- created_at
- updated_at

Purpose:

Menyimpan master data substrat.

Important rule:

Satu substrat dapat memiliki banyak sesi.

Jangan membuat record substrat baru setiap kali eksperimen dilakukan.


## 8. Sessions Table

Table:

sessions

Columns:

- id
- substrate_id
- ph
- temperature
- volume
- load_resistance
- started_at
- ended_at
- status
- created_at
- updated_at

Foreign key:

substrate_id → substrates.id

Status yang diperbolehkan:

- running
- completed

Parameter pH, suhu, volume, dan resistor merupakan parameter eksperimen
pada suatu sesi.

Jangan menyimpan parameter tersebut pada sensor_readings.


## 9. Sensor Readings Table

Table:

sensor_readings

Columns:

- id
- session_id
- voltage
- current
- power
- recorded_at

Foreign key:

session_id → sessions.id

Setiap pembacaan sensor harus terhubung dengan sesi tertentu.

Contoh:

Sesi #1
├── reading #1
├── reading #2
├── reading #3
└── ...

Jangan menyimpan data sensor tanpa session_id.


## 10. Sensor Data

Data sensor berasal dari:

INA219 → ESP32 → API → Supabase

Data utama:

- voltage
- current
- power
- recorded_at

Unit yang digunakan:

- voltage: Volt (V)
- current: milliampere (mA)
- power: milliwatt (mW)

Timestamp menggunakan timestamptz.

Gunakan waktu server/database sebagai sumber timestamp jika memungkinkan.


## 11. Session Duration

Jangan menyimpan duration sebagai kolom database.

Durasi dihitung dari:

ended_at - started_at

Untuk sesi yang sedang berjalan:

current_time - started_at

Dashboard harus menampilkan waktu berjalan secara realtime.


## 12. Comparison Rules

Halaman perbandingan membandingkan SESSION, bukan langsung substrat.

Contoh:

Ekoenzim Jeruk
├── Sesi #01
├── Sesi #05
└── Sesi #08

Sesi #01 dan Sesi #05 tetap dapat dibandingkan meskipun menggunakan
substrat yang sama.

Statistik yang dapat dihitung:

- Maximum Voltage
- Average Voltage
- Maximum Current
- Average Current
- Maximum Power
- Average Power
- Session Duration

Tabel perbandingan harus memiliki format:

Parameter | Sesi #01 | Sesi #02 | Sesi #03

Contoh parameter:

- Substrat
- pH
- Suhu
- Volume
- Resistor Beban
- Durasi
- Max Voltage
- Average Voltage
- Max Current
- Average Current
- Max Power
- Average Power

Jangan membuat tabel database bernama comparisons hanya untuk menyimpan
hasil perbandingan.


## 13. UI / UX Design

Tema utama aplikasi:

GREEN.

Aplikasi wajib mendukung:

- Light mode
- Dark mode

Gunakan next-themes untuk theme switching.

Gunakan design system yang konsisten.

Jangan menentukan warna secara acak pada setiap component.

Gunakan semantic color tokens jika memungkinkan.

Contoh semantic colors:

- background
- foreground
- card
- primary
- primary-foreground
- muted
- border
- destructive
- success
- warning

Primary color menggunakan nuansa hijau.

UI harus:

- Modern
- Clean
- Minimal
- Profesional
- Responsive
- Mudah dibaca
- Tidak terlalu banyak dekorasi


## 14. Layout

Layout utama terdiri dari:

- Sidebar
- Header
- Main content

Sidebar berisi:

- Dashboard
- Substrat
- Kontrol Sesi
- Riwayat Sesi
- Perbandingan

Header berisi:

- Judul halaman
- Theme toggle
- Informasi tambahan jika diperlukan

Sidebar dan Header harus dibuat sebagai reusable components.


## 15. Reusable UI Components

Reusable components berada di:

components/ui/

Contoh:

- Button
- Card
- Input
- Select
- Modal
- Badge
- Table
- Loading
- EmptyState

Feature-specific components berada pada folder masing-masing.

Contoh:

components/dashboard/
components/substrat/
components/sesi/
components/riwayat/
components/perbandingan/


## 16. Component Rules

Gunakan component berdasarkan tanggung jawabnya.

Jangan membuat satu component yang terlalu besar.

Jika sebuah component memiliki banyak tanggung jawab berbeda, pecah menjadi
beberapa component.

Contoh Dashboard:

Dashboard
├── MetricCard
├── RunningTimeCard
├── RealtimeChart
├── SessionInfo
└── LatestReadings

Jangan membuat seluruh Dashboard dalam satu file dengan ratusan baris.


## 17. Naming Convention

React components:

PascalCase

Contoh:

MetricCard.tsx
SessionForm.tsx
ComparisonTable.tsx

Hooks:

camelCase dengan prefix use

Contoh:

useRealtimeSession.ts
useTheme.ts

Utility functions:

camelCase

Contoh:

formatVoltage()
formatDuration()

Database tables:

snake_case

Contoh:

sensor_readings
load_resistance

Database columns:

snake_case

Contoh:

substrate_id
started_at
recorded_at


## 18. TypeScript Rules

Gunakan TypeScript secara konsisten.

Hindari:

any

kecuali benar-benar diperlukan.

Gunakan type atau interface untuk:

- Database records
- API request
- API response
- Component props
- Sensor data
- Session data
- Comparison data

Jangan menggunakan object tanpa tipe jika tipe tersebut dapat didefinisikan
dengan jelas.


## 19. Supabase Rules

Gunakan dua Supabase client:

- Browser/client client
- Server client

Pisahkan konfigurasi Supabase berdasarkan kebutuhan runtime.

Jangan mengekspos secret/service-role key ke client.

Environment variables:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Secret key tidak boleh diberi prefix NEXT_PUBLIC_.


## 20. API Rules

ESP32 mengirim data melalui:

POST /api/sensor

Contoh payload:

{
  "session_id": 1,
  "voltage": 0.821,
  "current": 0.310,
  "power": 0.254
}

API harus melakukan:

1. Validasi payload.
2. Validasi session_id.
3. Memastikan sesi valid.
4. Memastikan sesi sedang berjalan jika diperlukan.
5. Menyimpan data ke sensor_readings.
6. Mengembalikan response yang jelas.

Jangan langsung memasukkan payload ESP32 ke database tanpa validasi.


## 21. Validation

Validasi wajib dilakukan pada:

- Form substrat.
- Form sesi.
- API sensor.

Contoh validasi:

pH:

- Harus berupa angka.
- Harus berada pada range yang masuk akal.

Temperature:

- Harus berupa angka.

Volume:

- Harus lebih besar dari 0.

Load resistance:

- Harus lebih besar dari 0.

Sensor:

- voltage harus berupa angka.
- current harus berupa angka.
- power harus berupa angka.
- session_id harus valid.


## 22. Error Handling

Semua operasi penting harus memiliki:

- Loading state
- Success state
- Error state
- Empty state jika relevan

Jangan membiarkan error database langsung muncul sebagai error mentah
kepada pengguna.

Gunakan pesan yang mudah dipahami.

Contoh:

"Data substrat gagal disimpan."

bukan:

"PostgrestError: 23505..."


## 23. Loading State

Gunakan loading indicator ketika:

- Mengambil data.
- Menyimpan data.
- Menghapus data.
- Memulai sesi.
- Mengakhiri sesi.
- Mengambil data perbandingan.

Hindari halaman terlihat kosong ketika request sedang berlangsung.


## 24. Empty State

Setiap halaman yang menampilkan data harus memiliki empty state.

Contoh:

Jika belum ada substrat:

"Belum ada substrat.
Tambahkan substrat untuk memulai eksperimen."

Jika belum ada sesi:

"Belum ada sesi eksperimen."

Jika belum ada data sensor:

"Belum ada data sensor untuk sesi ini."


## 25. Realtime Rules

Dashboard menggunakan Supabase Realtime untuk menerima sensor readings baru.

Jangan melakukan polling terlalu sering jika Realtime dapat digunakan.

Realtime harus difilter berdasarkan session_id jika memungkinkan.

Ketika sesi berubah menjadi completed:

- Dashboard harus memperbarui status.
- Timer harus berhenti.
- Data terakhir tetap dapat ditampilkan.


## 26. Chart Rules

Gunakan Recharts.

Grafik harus memiliki:

- Label axis yang jelas.
- Unit yang jelas.
- Tooltip.
- Responsive container.
- Empty state jika tidak ada data.

Jenis grafik:

- Line chart untuk data sensor berdasarkan waktu.
- Comparison line chart untuk membandingkan sesi berdasarkan waktu.

Jangan menggunakan chart untuk data yang lebih tepat ditampilkan sebagai tabel.


## 27. Dashboard Metric Rules

Dashboard memiliki empat metric cards:

1. Tegangan
2. Arus
3. Daya
4. Waktu Berjalan

Contoh:

Voltage
0.821 V

Current
0.310 mA

Power
0.254 mW

Running Time
02:34:17

Gunakan formatting yang konsisten.


## 28. Responsive Design

Aplikasi harus dapat digunakan pada:

- Desktop
- Laptop
- Tablet
- Mobile

Sidebar dapat berubah menjadi mobile navigation pada layar kecil.

Tabel yang lebar harus dapat di-scroll secara horizontal.

Chart harus responsive.


## 29. Security

Jangan:

- Menaruh secret key di frontend.
- Menaruh password di source code.
- Commit .env.local.
- Menonaktifkan security hanya untuk mempermudah development.
- Membuka endpoint sensor tanpa validasi.

Supabase Row Level Security (RLS) harus dipertimbangkan dan dikonfigurasi
dengan benar sebelum production.


## 30. Git Rules

Gunakan commit message yang jelas.

Contoh:

feat: add substrate CRUD
feat: add session control
feat: add realtime dashboard
feat: add session comparison

fix: fix realtime sensor update
fix: fix session duration

refactor: improve dashboard components

docs: update project documentation

Jangan menggunakan commit seperti:

"update"
"fix"
"coba"
"test"


## 31. Development Workflow

Development dilakukan secara bertahap:

Phase 1:
Project setup

Phase 2:
Database setup

Phase 3:
Design system

Phase 4:
Layout

Phase 5:
Substrate CRUD

Phase 6:
Session control

Phase 7:
Sensor API

Phase 8:
Realtime dashboard

Phase 9:
Session history

Phase 10:
Session comparison

Phase 11:
Testing

Phase 12:
Deployment


## 32. Implementation Order

Jangan mengimplementasikan fitur secara acak.

Urutan yang disarankan:

1. Setup Next.js.
2. Setup Tailwind.
3. Setup Supabase.
4. Create database.
5. Setup Supabase client/server.
6. Create global theme.
7. Create layout.
8. Create reusable UI components.
9. Implement substrate CRUD.
10. Implement session creation.
11. Implement session start/stop.
12. Implement sensor API.
13. Implement dashboard.
14. Implement realtime.
15. Implement session history.
16. Implement session detail.
17. Implement comparison.
18. Add validation.
19. Add error/loading/empty states.
20. Test.
21. Deploy.


## 33. Do Not Overengineer

Jangan menambahkan:

- Redux
- Zustand
- GraphQL
- Microservices
- Separate backend server
- Unnecessary state management libraries

kecuali kebutuhan project benar-benar mengharuskannya.

Next.js + Supabase sudah cukup untuk kebutuhan aplikasi ini.


## 34. Important Business Rules

1. Satu substrat dapat digunakan oleh banyak sesi.

2. Satu sesi hanya memiliki satu substrat.

3. Satu sesi memiliki banyak sensor readings.

4. Sensor readings harus memiliki session_id.

5. Sesi memiliki status running atau completed.

6. Sesi yang sedang berjalan hanya satu jika sistem MFC menggunakan satu
perangkat eksperimen.

7. Durasi sesi dihitung berdasarkan started_at dan ended_at.

8. Untuk sesi yang sedang berjalan, durasi dihitung dari started_at sampai
waktu sekarang.

9. Comparison merupakan hasil perhitungan dari data yang sudah ada.

10. Jangan menyimpan hasil comparison sebagai data utama di database.

11. Jangan menghapus substrat yang sudah digunakan oleh sesi.

12. Sensor readings tidak boleh dibuat jika session_id tidak valid.

13. Data sensor harus memiliki timestamp.


## 35. Current Database Relationship

Current database schema:

substrates
    |
    | 1 : N
    |
sessions
    |
    | 1 : N
    |
sensor_readings


## 36. Future Extensions

Fitur berikut tidak perlu dibuat sekarang kecuali memang diperlukan:

- Multiple MFC devices.
- User authentication.
- Role-based access.
- Export CSV.
- Export PDF.
- Advanced analytics.
- Sensor pH realtime.
- Sensor temperature realtime.
- Notification system.

Jika fitur tersebut ditambahkan, pastikan tidak merusak architecture yang
sudah ada.


## 37. Definition of Done

Sebuah fitur dianggap selesai jika:

- Berfungsi sesuai requirement.
- TypeScript tidak memiliki error.
- Tidak memiliki console error yang tidak ditangani.
- Responsive.
- Mendukung light dan dark mode.
- Memiliki loading state jika membutuhkan asynchronous operation.
- Memiliki error handling.
- Memiliki empty state jika relevan.
- Tidak menduplikasi logic yang sudah tersedia.
- Tidak melanggar database relationship.
- Tidak mengekspos secret.
- Tidak merusak fitur yang sudah ada.


## 38. Agent Behavior

Sebelum mengubah code:

1. Periksa struktur project yang sudah ada.
2. Periksa component yang sudah tersedia.
3. Gunakan kembali component yang relevan.
4. Jangan membuat file baru jika file yang ada masih dapat digunakan.
5. Pastikan perubahan sesuai dengan architecture.
6. Jangan mengubah database schema tanpa alasan yang jelas.

Ketika diminta membuat fitur:

1. Jelaskan file yang akan dibuat/diubah jika perubahan cukup besar.
2. Implementasikan dengan struktur yang konsisten.
3. Jangan menghapus fitur yang sudah ada tanpa instruksi.
4. Jangan mengubah desain database secara diam-diam.
5. Jika ada keputusan architecture yang penting, jelaskan alasannya.

Prioritaskan perubahan kecil, terukur, dan mudah direview.