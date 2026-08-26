# khotmil

Aplikasi web untuk mempermudah pembuatan teks pembagian tugas mengaji (khotmil Qur'an) periode berikutnya.

Tempel teks pembagian tugas periode ini, aplikasi akan otomatis:

- Menaikkan nomor juz setiap anggota ke juz berikutnya (setelah juz 30 kembali ke juz 1).
- Mengosongkan tanda 🕋 bagi yang sudah menyelesaikan tugasnya.
- Menambah satu tanda ❎ bagi yang belum menyelesaikan tugasnya sampai periode berakhir.
- Mempertahankan bagian awal, akhir, dan label kelompok apa adanya.

## Pengembangan

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Hasil build ada di folder `dist/`, siap di-deploy ke GitHub Pages (lihat `.github/workflows/deploy.yml`).
