# Fitur Aplikasi ChitChat

Dokumen ini memberikan gambaran rinci tentang fitur-fitur yang diimplementasikan dalam aplikasi ChitChat.

## 1. Komunikasi Inti

- **Chat Pribadi:** Pesan pribadi yang aman antara dua pengguna.
- **Chat Grup (Toko):** Saluran publik yang dapat diikuti oleh setiap pengguna. Ini juga berfungsi sebagai etalase untuk pengguna bisnis.
- **Pesan Real-Time:** Pesan muncul secara instan tanpa perlu memuat ulang halaman.
- **Pesan Media Kaya:**
  - **Teks:** Pesan teks standar.
  - **Gambar:** Berbagi foto dalam obrolan.
  - **File:** Berbagi dokumen (misalnya, PDF).
  - **Presentasi:** Jenis file khusus bagi pengguna bisnis untuk berbagi presentasi.
  - **Lokasi:** Berbagi peta dengan lokasi geografis Anda saat ini.

## 2. Sosial & Interaksi

- **Profil Pengguna:**
  - Nama tampilan, avatar, dan pesan status yang dapat disesuaikan.
  - Melihat profil pengguna lain.
- **Status Pengguna:** Melihat apakah pengguna sedang online atau offline.
- **Cerita Sementara (Stories):**
  - Memposting cerita berbasis gambar sementara yang terlihat oleh kontak.
  - Melihat cerita dari pengguna lain di reel khusus di halaman beranda.

## 3. Social Commerce & Fitur Bisnis

- **Tingkatan Akun:**
  - **Pengguna Biasa:** Dapat berpartisipasi dalam semua fitur obrolan, melihat toko, dan membeli item.
  - **Pengguna Bisnis:** Memiliki semua fitur pengguna biasa ditambah kemampuan untuk membuat toko dan mendaftarkan produk.
- **Toko:**
  - Pengguna bisnis dapat membuat obrolan grup publik yang berfungsi sebagai toko.
  - Toko memiliki nama dan avatar yang unik.
  - Semua pengguna secara otomatis ditambahkan ke toko baru.
- **Manajemen Produk:**
  - Pengguna bisnis dapat mendaftarkan produk untuk dijual di dalam toko mereka.
  - Produk memiliki nama, deskripsi, harga, dan gambar.
  - Pengguna dapat mengedit atau menghapus produk yang telah mereka daftarkan.
- **Pembelian Dalam Aplikasi:**
  - Pengguna dapat "membeli" produk dari sebuah toko.
  - Tindakan pembelian mengirimkan pesan konfirmasi ke dalam obrolan, memberitahu penjual dan membuat catatan transaksi.

## 4. Antarmuka & Pengalaman Pengguna

- **Desain Responsif:** Aplikasi ini sepenuhnya responsif dan dioptimalkan untuk penggunaan mobile-first, dengan tata letak yang ramah untuk desktop.
- **Mode Terang & Gelap:** Pengalih tema memungkinkan pengguna untuk beralih antara tema visual terang dan gelap.
- **Komponen UI Modern:** Dibangun dengan pustaka komponen UI ShadCN yang ramping dan mudah diakses.
- **Navigasi Intuitif:** Struktur navigasi yang bersih dan sederhana memudahkan perpindahan antara obrolan, toko, dan profil pengguna.
- **Notifikasi (Toast):** Aplikasi memberikan umpan balik yang tidak mengganggu untuk tindakan seperti menyimpan profil, mengirim pesan, atau mengalami kesalahan.
