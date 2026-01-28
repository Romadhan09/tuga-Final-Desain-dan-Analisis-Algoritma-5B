# Sistem Pencarian Tempat Wisata Indonesia

## Implementasi Algoritma String Matching Berbasis Web

![Tourism Search System](https://img.shields.io/badge/Status-Active-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📖 Deskripsi

Sistem ini merupakan implementasi dari **algoritma string matching** untuk pencarian tempat wisata di Indonesia berbasis web. Aplikasi ini menggunakan dataset "Tourism with ID & Ratings" dari Kaggle yang berisi informasi lengkap tentang tempat-tempat wisata di Indonesia.

### Fitur Utama:

- 🔍 **Pencarian dengan 3 Algoritma String Matching**
  - KMP (Knuth-Morris-Pratt)
  - Boyer-Moore
  - Brute Force
- 📊 **Analisis Performa** - Menampilkan waktu eksekusi dan jumlah perbandingan
- 🏷️ **Filter Pencarian** - Berdasarkan kategori, kota, dan rating
- 📈 **Visualisasi Data** - Chart perbandingan performa algoritma
- 💫 **UI Modern** - Antarmuka yang responsif dan user-friendly

## 🛠️ Algoritma yang Diimplementasi

### 1. KMP (Knuth-Morris-Pratt)

- **Kompleksitas Waktu**: O(n + m)
- **Kelebihan**: Tidak mundur pada teks, preprocessing pattern
- **Cara Kerja**: Menggunakan LPS (Longest Proper Prefix Suffix) array

### 2. Boyer-Moore

- **Kompleksitas Waktu**: Best O(n/m), Worst O(nm)
- **Kelebihan**: Efisien untuk pattern panjang, skip karakter
- **Cara Kerja**: Pencarian dari kanan ke kiri dengan bad character rule

### 3. Brute Force

- **Kompleksitas Waktu**: O(nm)
- **Kelebihan**: Mudah diimplementasi, tidak perlu preprocessing
- **Cara Kerja**: Membandingkan setiap posisi secara berurutan

## 📁 Struktur Proyek

```
TUGAS-ADAM/
├── index.html              # Halaman utama
├── css/
│   └── style.css          # Stylesheet
├── js/
│   ├── algorithms.js      # Implementasi algoritma string matching
│   └── app.js             # Logika aplikasi utama
├── dataset/
│   └── tourism_with_id.csv # Dataset tempat wisata
└── README.md              # Dokumentasi
```

## 🚀 Cara Menjalankan

### Metode 1: Langsung Buka File

1. Buka file `index.html` di browser (Chrome, Firefox, Edge, dll)
2. **Catatan**: Beberapa browser memblokir loading file lokal. Gunakan metode 2 jika mengalami masalah.

### Metode 2: Menggunakan Live Server (Recommended)

1. Install extension **Live Server** di VS Code
2. Klik kanan pada `index.html`
3. Pilih "Open with Live Server"

### Metode 3: Menggunakan Python HTTP Server

```bash
# Python 3
python -m http.server 8000

# Kemudian buka http://localhost:8000 di browser
```

### Metode 4: Menggunakan Node.js

```bash
# Install http-server globally
npm install -g http-server

# Jalankan server
npx http-server

# Buka http://localhost:8080 di browser
```

## 📊 Dataset

Dataset yang digunakan adalah **"Tourism with ID & Ratings"** dari Kaggle dengan kolom:

- `Place_Id` - ID unik tempat wisata
- `Place_Name` - Nama tempat wisata
- `Description` - Deskripsi lengkap
- `Category` - Kategori (Budaya, Taman Hiburan, Bahari, dll)
- `City` - Kota lokasi
- `Price` - Harga tiket masuk
- `Rating` - Rating (1-5)
- `Time_Minutes` - Estimasi waktu kunjungan
- `Lat, Long` - Koordinat lokasi

## 🎯 Cara Penggunaan

1. **Masukkan kata kunci** pencarian di kolom search
2. **Pilih algoritma** yang ingin digunakan (KMP, Boyer-Moore, atau Brute Force)
3. **Gunakan filter** untuk mempersempit hasil (kategori, kota, rating)
4. **Klik tombol Cari** atau tekan Enter
5. **Lihat statistik** pencarian (waktu eksekusi, jumlah hasil, perbandingan)
6. **Klik kartu** tempat wisata untuk melihat detail lengkap

## 📈 Perbandingan Performa

Sistem ini menampilkan:

- ⏱️ **Waktu Eksekusi** - Berapa lama pencarian berlangsung (ms)
- 🔢 **Jumlah Perbandingan** - Berapa kali karakter dibandingkan
- 📊 **Grafik Perbandingan** - Visualisasi performa ketiga algoritma

## 🖥️ Screenshot

### Halaman Utama

- Hero section dengan call-to-action
- Form pencarian dengan pemilihan algoritma
- Filter berdasarkan kategori, kota, dan rating

### Hasil Pencarian

- Kartu tempat wisata dengan highlight pada kata yang cocok
- Statistik pencarian real-time
- Modal detail tempat wisata

### Perbandingan Algoritma

- Penjelasan masing-masing algoritma
- Chart perbandingan performa

## 🔧 Teknologi yang Digunakan

- **HTML5** - Struktur halaman
- **CSS3** - Styling dan animasi
- **JavaScript (ES6+)** - Logika aplikasi dan algoritma
- **Chart.js** - Visualisasi grafik
- **Font Awesome** - Icon
- **Google Fonts (Poppins)** - Typography

## 📝 Catatan Pengembangan

### Implementasi Algoritma

Semua algoritma diimplementasi secara **case-insensitive** untuk pengalaman pencarian yang lebih baik.

### Optimasi

- Pencarian dilakukan di nama dan deskripsi tempat wisata
- Hasil dapat difilter berdasarkan kategori, kota, dan rating minimal
- Highlight otomatis pada kata yang cocok

## 👨‍💻 Pengembang

**ADAM** - Tugas Implementasi Algoritma String Matching

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan tugas akademik.

Dataset: [Tourism with ID & Ratings - Kaggle](https://www.kaggle.com/datasets)
