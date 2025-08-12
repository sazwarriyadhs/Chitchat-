# Fitur Aplikasi ChitChat

Dokumen ini memberikan gambaran rinci tentang fitur-fitur yang diimplementasikan dalam aplikasi prototipe ChitChat.

## 1. Komunikasi Inti

- **Obrolan Pribadi:** Pesan pribadi yang aman antara dua pengguna.
- **Obrolan Grup (Toko):** Saluran publik yang dapat diikuti oleh setiap pengguna, yang juga berfungsi sebagai etalase untuk bisnis.
- **Pesan Real-Time:** Pesan muncul secara instan tanpa perlu memuat ulang halaman, didukung oleh Socket.IO.
- **Berbagi Media Kaya:**
  - **Teks:** Pesan teks standar.
  - **Gambar & Dokumen:** Berbagi foto dan file dalam obrolan.
  - **Presentasi:** Jenis file khusus bagi pengguna bisnis untuk berbagi presentasi.
  - **Lokasi:** Berbagi peta interaktif dengan lokasi geografis saat ini.
- **Panggilan Suara & Video:** Melakukan panggilan suara atau video langsung dari dalam obrolan pribadi atau grup.

## 2. Interaksi Sosial & Personalisasi

- **Profil Pengguna:** Nama tampilan, avatar, dan pesan status yang dapat disesuaikan.
- **Status Pengguna:** Melihat apakah pengguna sedang online atau offline.
- **Cerita Sementara (Stories):** Memposting pembaruan foto sementara yang dapat dilihat oleh kontak.
- **Tema Obrolan yang Dapat Disesuaikan:** Pengguna dapat mengubah gambar latar belakang obrolan, dan tema warna UI secara otomatis beradaptasi dengan gambar tersebut.
- **Mode Terang & Gelap:** Pengalih tema di seluruh aplikasi memungkinkan pengguna untuk beralih antara tema visual terang dan gelap.

## 3. Social Commerce & Fitur Bisnis

- **Tingkatan Akun:**
  - **Pengguna Biasa:** Dapat berpartisipasi dalam semua fitur obrolan, melihat toko, dan membeli item.
  - **Pengguna Bisnis:** Memiliki semua kemampuan pengguna biasa ditambah kemampuan untuk membuat toko dan mendaftarkan produk.
- **Manajemen Toko:**
  - Pengguna bisnis dapat membuat obrolan grup publik yang berfungsi sebagai "Toko".
  - Toko memiliki nama dan avatar yang dapat disesuaikan, dan semua pengguna aplikasi secara otomatis ditambahkan.
- **Manajemen Produk:**
  - Pengguna bisnis dapat mendaftarkan, mengedit, atau menghapus produk untuk dijual di dalam toko mereka.
- **Alur Pesanan Interaktif Dalam Obrolan:**
  - **Pemesanan:** Pembeli melakukan "pembelian" produk, yang mengirimkan pesan pesanan ke dalam obrolan.
  - **Konfirmasi Penjual:** Penjual menerima pesanan dan harus mengklik tombol "Konfirmasi Pesanan" di dalam obrolan.
  - **Unggah Bukti:** Setelah dikonfirmasi, pembeli diminta untuk mengunggah bukti pembayaran langsung di dalam obrolan.
  - **Manajemen Pesanan:** Pengguna dapat melihat riwayat pesanan mereka di halaman profil.
- **Notifikasi Real-Time:** Penjual menerima notifikasi toast instan ketika pesanan baru diterima.

## 4. Antarmuka & Pengalaman Pengguna

- **Desain Responsif:** Aplikasi ini sepenuhnya responsif dan dioptimalkan untuk penggunaan mobile-first.
- **Komponen UI Modern:** Dibangun dengan pustaka komponen UI ShadCN yang ramping dan mudah diakses dan ditata dengan Tailwind CSS.
- **Navigasi Intuitif:** Struktur navigasi yang bersih dan sederhana memudahkan perpindahan antara obrolan, toko, dan profil.
