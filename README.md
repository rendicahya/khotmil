# 🕋 Khotmil Qur'an

Aplikasi web untuk mempermudah pembuatan teks pembagian tugas mengaji (khotmil Qur'an) periode berikutnya, biasa dibagikan lewat WhatsApp.

## Cara pakai

1. Tempel teks pembagian tugas periode ini ke kotak pertama (tombol **Tempel** atau Ctrl+V).
2. Teks periode berikutnya otomatis muncul di kotak kedua.
3. Salin (tombol **Salin**) dan bagikan ke grup.

## Yang otomatis dilakukan

- Menaikkan nomor juz setiap anggota ke juz berikutnya (setelah juz 30 kembali ke juz 1). Anggota di **Kelompok 1** naik 2 juz per periode, kelompok lain naik 1 juz.
- Mengosongkan tanda 🕋 bagi yang sudah menyelesaikan tugasnya.
- Menambah satu tanda ❎ bagi yang belum menyelesaikan tugasnya sampai periode berakhir (anggota dengan 🕋 dan ❎ sekaligus tetap dianggap selesai).
- Menggeser tanggal yang tertera di teks maju 7 hari kalender.
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
