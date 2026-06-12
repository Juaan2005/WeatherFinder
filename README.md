# 🌦️ WeatherFinder - Misi 10

Aplikasi pelacak cuaca mobile berbasis React Native yang dibangun menggunakan **Expo Go** dan diintegrasikan dengan **Open-Meteo API** tanpa memerlukan API Key. Tugas ini diselesaikan sebagai bagian dari pemenuhan Praktikum Pertemuan 10.

---

## 🎯 Fitur yang Diimplementasikan

### 🟢 Level 1 — Fitur Wajib (Core)
* **Controlled TextInput**: Sinkronisasi input teks nama kota langsung dengan state aplikasi menggunakan properti `value` dan `onChangeText`.
* **Debounce 500ms**: Menggunakan kombinasi `setTimeout` dan `clearTimeout` di dalam `useEffect` untuk membatasi request jaringan (1 kota = 1 request, bukan menembak API per huruf).
* **Fetch 2 Langkah**: Mengonversi nama kota menjadi koordinat menggunakan Geocoding API terlebih dahulu, kemudian melempar koordinat tersebut ke Forecast API Open-Meteo.
* **4 Kondisi UI**: Menampilkan antarmuka yang adaptif berdasarkan status aplikasi (*Kosong/Hint*, *Loading Spinner*, *Error Card*, dan *Sukses/Kartu Cuaca*).
* **AbortController Cleanup**: Membatalkan request API yang lama jika pengguna mengetik nama kota baru dengan cepat guna menghindari balapan data (*race conditions*).
* **WMO Weather Code Mapping**: Mengonversi kode angka meteorologi dari Open-Meteo menjadi label bahasa Indonesia dan emoji yang akurat (Mendukung hingga 19 variasi kode cuaca).

### 🟡 Level 2 — Fitur Pengembangan (Dipilih)
* **Indikator Siang/Malam**: Memanfaatkan properti `is_day` dari data JSON API untuk mendeteksi kondisi pencahayaan di lokasi tujuan.
* **Background Dinamis & Adaptif**: Mengubah warna dasar tema aplikasi secara keseluruhan menjadi *Ocean Sky Blue* jika lokasi tujuan berada di siang hari, dan *Deep Midnight Blue* jika berada di malam hari.
* **Tombol Refresh Instan**: Menyediakan tombol interaktif "Perbarui Data" di dalam kartu cuaca untuk menembak ulang API pada kota yang sama tanpa perlu mengetik ulang kata kunci.

---

## 🔗 Tautan Proyek
👉 **[LINK EXPO SNACK DI SINI](https://snack.expo.dev/@juantambunan/juan-moses-tambunan)**

---

## 📸 Dokumentasi Uji Coba (Screenshots)


---

## ⚙️ Cara Menjalankan Secara Lokal

1. **Clone repositori ini:**
```bash
   git clone https://github.com/Juaan2005/WeatherFinder
   cd weather-finder