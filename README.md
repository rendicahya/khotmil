# 🕋 Khotmil Qur'an

Aplikasi web untuk mempermudah pembuatan teks pembagian tugas mengaji (khotmil Qur'an) periode berikutnya, biasa dibagikan lewat WhatsApp.

## Cara pakai

1. Tempel teks pembagian tugas periode ini ke kotak pertama (tombol **Tempel** atau Ctrl+V).
2. Teks periode berikutnya otomatis muncul di kotak kedua.
3. Salin (tombol **Salin**) dan bagikan ke grup.

## Grup

Ada dua grup dengan mekanisme berbeda. Grup aktif dan panjang periode tiap grup diatur lewat tombol ⚙️ di pojok kanan atas (tersimpan di peramban).

### Besuki (bawaan periode 14 hari)

- Menaikkan nomor juz setiap anggota ke juz berikutnya (setelah juz 30 kembali ke juz 1). Anggota di **Kelompok 1** naik 2 juz per periode, kelompok lain naik 1 juz.
- Mengosongkan tanda 🕋 bagi yang sudah menyelesaikan tugasnya.
- Menambah satu tanda ❎ bagi yang belum menyelesaikan tugasnya sampai periode berakhir (anggota dengan 🕋 dan ❎ sekaligus tetap dianggap selesai).

### Safinda (bawaan periode 1 hari)

- Hanya satu kelompok; setiap anggota naik 1 juz per periode.
- Emoji hiasan di belakang nama = jumlah juz yang sudah disetor lebih dulu. Tiap periode dikurangi satu emoji dan anggota dianggap sudah selesai untuk periode itu (tanpa ❎). Anggota tanpa emoji tersisa mendapat tambahan ❎.
- Kotak **Setoran via chat** (muncul hanya untuk Safinda): tempel pesan WhatsApp seperti `[8/30, 15:45] Bu Fulan: juz 7-8 kholash`. Nama yang cocok mendapat tambahan kredit setoran sebanyak juz yang dilaporkan (`7-8` = 2, `28` = 1).

### Berlaku untuk semua grup

- Menggeser tanggal yang tertera di teks maju sesuai periode grup aktif.
- Merapikan spasi ganda dan baris kosong berlebih (maksimal satu baris kosong berturut-turut).
- Mempertahankan bagian awal, akhir, dan label kelompok apa adanya, karena parsing dirancang toleran terhadap format teks yang diketik manual.

## Pengembangan

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Hasil build ada di folder `dist/`, otomatis di-deploy ke GitHub Pages setiap push ke `main` (lihat `.github/workflows/deploy.yml`).
