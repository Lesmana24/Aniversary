# 💖 Lesmana & Bebe — 2nd Anniversary Interactive Scrapbook Web App

Aplikasi web interactive scrapbook perayaan 2 tahun anniversary (Lesmana & Nafla / Bebe) ber-estetika **Pastel Dream Y2K**. Dibuat menggunakan **React JS (Vite)**, **Node.js (Express API)**, dan **Google Firebase** (dengan fallback otomatis ke penyimpanan lokal JSON).

---

## 🌟 Fitur Utama

1. **🏠 Beranda & Live Love Counter**
   - Counter realtime hitung 730 hari (2 tahun) kebersamaan dalam hari, jam, menit, dan detik.
   - Hero foto polaroid Lesmana & Bebe dengan stiker Y2K dan tape washi.
   - Checklist interaktif **"Impian Tahun Ke-3 Kita"** yang bisa di-centang atau ditambah.

2. **📖 Flip Book Kenangan Kencan (Timeline)**
   - Display kartu polaroid momen kencan berdua dengan filter lokasi/kategori (*Cafe*, *Outdoor*, *Trip*, *Movie*).
   - Lengkap dengan cerita memo manis, lokasi, tanggal, dan rating kebahagiaan.

3. **🎟️ Kartu Gosok Hadiah Rahasia (Interactive Scratch Cards)**
   - 3 Kupon Hadiah Rahasia dengan efek **Scratch Canvas HTML5 Realtime** (bisa digosok langsung dengan jari/mouse).
   - Fitur klaim & reset voucher.

4. **💌 Surat Cinta & Cassette Voice Note Player**
   - **Cassette Tape Player Y2K**: Pemutar kaset pita retro dengan gerak pita berputar, progress bar, timestamp, dan tombol Play/Pause.
   - **Surat Cinta Kertas Bergaris**: Ucapan romantis 2 tahun dari Lesmana untuk Bebe.
   - **Love Sparks Reaction**: Tombol *"Kirim Pelukan Hangat ❤️"* yang melepaskan animasi partikel hati di layar.

5. **💡 Kuis Trivia Cinta (Love Story Quiz)**
   - Kuis interaktif 5 soal seputar perjalanan cinta berdua dengan skor otomatis & selebrasi efek *confetti*.

6. **⚙️ Studio CMS Admin Panel**
   - Floating drawer modal untuk menambah kenangan kencan baru, mengedit isi surat cinta, dan mereset kartu gosok secara realtime.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Jalankan Backend Server (Node.js Express)
```bash
cd server
npm start
```
> Server akan berjalan di `http://localhost:5000`.

### 2. Jalankan Frontend Application (React JS Vite)
```bash
cd client
npm run dev
```
> Aplikasi web akan terbuka di `http://localhost:5173`.

---

## 🔥 Konfigurasi Google Firebase (Opsional)

Aplikasi ini secara otomatis berjalan 100% menggunakan **Penyimpanan Lokal JSON** (`server/data/defaultData.json`) jika credential Firebase tidak diisi, sehingga **langsung bisa dipakai tanpa setup tambahan**.

Jika ingin menghubungkan ke Google Firebase Cloud:
1. Buat project di [Firebase Console](https://console.firebase.google.com/).
2. Buat database **Cloud Firestore**.
3. Masukkan credential ke file `server/.env`:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   ```
4. Tambahkan juga variabel Firebase Client di `client/.env`:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_PROJECT_ID=your-project-id
   ```
