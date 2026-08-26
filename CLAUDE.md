Saya ingin membuat aplikasi untuk mempermudah pencatatan di grup mengaji (baca Al-Qur'an). Setiap anggota di suatu grup mendapat bagian untuk membaca satu atau lebih juz dalam satu periode. Pembagian tugas mengaji ditulis di pesan WhatsApp. Setiap anggota bisa memberi karakter "🕋" di samping namanya untuk menandai bahwa tugas mengajinya sudah selesai untuk suatu periode. Setelah menyelesaikan tugas mengajinya di suatu periode, seorang anggota akan melanjutkan ke juz berikutnya di periode berikutnya. Contoh: periode ini, anggota A membaca juz 1, maka periode berikutnya, dia akan bertugas membaca juz 2, dan seterusnya. Setelah juz 30, kembali lagi ke juz 1. Di teks pembagian tugas periode berikutnya, anggota yang sudah menyelesaikan tugasnya akan dikosongi karakter penandanya. Jika seorang anggota tidak menyelesaikan tugasnya sampai periodenya berakhir, maka nomor juznya akan tetap naik tapi akan ditulis katakter "❎️" di samping namanya. Jika dia tidak menyelesaikan tugasnya sampai beberapa periode, maka karakter itu ditulis sejumlah minggu yg tidak dia selesaikan tugasnya, dan itu ditulis di teks pembagian tugas mengaji di periode berikutnya. Jika pada akhirnya anggota tersebut menyelesaikan tugasnya, maka dia cukup menulis satu karakter 🕋. Di awal teks, ada awalan dan akhiran yang harus dipertahankan apa adanya di teks periode berikutnya. Kalau ada yang menulis "🕋❎️", maka itu dianggap tugasnya sudah selesai. Satu teks pembagian tugas bisa berisi beberapa kelompok mengaji.

Buat aplikasi untuk mempermudah pembuatan teks pembagian tugas mengaji tersebut. User akan copy-paste teks pembagian tugas ke aplikasi (beri tombol "Tempel"), lalu aplikasi langsung mem-parsing teks tersebut dan membuat teks pembagian tugas untuk periode berikutnya (beri tombol "Salin"). Parsing-nya perlu toleran karena rentan format yang kurang baku karena diketik secara manual oleh anggota.

Buat aplikasinya berbasis web dengan Svelte. Aplikasinya akan saya deploy ke GitHub pages. Contoh teks pembagian tugasnya seperti ini:

.🌸KHOTMIL QUR'AN.  515 /516
SATU MINGGU  SATU JUZ(SMSJ) Kel  ABDUL RAHMAN  / HJ NAFI'AH BESUKI
*Sesibuk apapun jadikan Al -Qur'an sebagai
Kesibukan yang paling utama.

📿 Rekapan setoran  Hari  Ahad tgl 22   April   2026

 Kelompok 1:


🍃 Juz  25 : Tini 🕋
🍃 Juz 26  : Ilham 
🍃Juz 27  : Dona 
🍃Juz 28  :  Alyzza ❎
🍃Juz  29 : Handy❎❎❎
🍃Juz 30  : Abdul Hanan🕋
🍃Juz 1  : Abdul Hanan🕋
🍃 juz 2   : Abdul Hanan🕋
🍃Juz 3   : Abdul Hanan🕋
🍃Juz 4   : Suprapto 
🍃Juz 5   : Suprapto 
🍃 Juz 6  : Abdul Hanan🕋
🍃 Juz 7  : Abdul Hanan🕋
🍃 Juz 8   : Diva🕋
🍃 Juz 9    : Diva🕋
🍃 Juz 10  : Fatilah 🕋
🍃 Juz 11  : Fatilah 🕋
🍃Juz 12   : Sumaryam 🕋
🍃Juz 13   : Sumaryam 🕋
🍃Juz 14  : Lies widayati🕋
🍃Juz 15  : Lies widayati🕋
🍃Juz 16  : Kiki 
🍃Juz 17  : Sunjoto 
🍃Juz 18  : Desi ❎❎❎
🍃Juz 19   :  Ifan❎❎❎❎
🍃Juz 20   : Ika 🕋
🍃Juz 21   : Rudy wahyudi 🕋
🍃Juz 22   : Aziz❎
🍃Juz 23   : Aziz❎
🍃Juz 24   : Tini 🕋


Kelompok 2:

🍃Juz 25   :  Asnawiyah 
🍃Juz 26   :  Handy❎❎❎
🍃Juz  27  : Riski
🍃 Juz 28  : Azis
🍃Juz  29  : Ella ❎❎❎❎❎
🍃 Juz 30  : Tika ❎❎❎❎❎
🍃 Juz 1   : Arum  ❎
🍃 Juz  2  : Cici❎❎
🍃 Juz 3   : Rendi 
🍃 Juz 4   : Kartika❎❎❎❎
🍃 Juz 5   : Herma 
🍃 Juz 6   : Untung Joko S 
🍃 Juz 7  : Umar Faruk 
🍃 Juz 8  : Lia Faruk 
🍃Juz 9   : Ibnu A P
🍃 Juz 10   : Alvaro
🍃 Juz 11   : Meutia ❎❎
🍃 Juz 12   : Ferry ❎❎
🍃 Juz 13   : Asdi ❎❎
🍃 Juz 14  :  Rani 
🍃 Juz 15  : Lia
🍃 Juz 16  : Lian
🍃 Juz 17  : Noval 
🍃 Juz 18  : Sur 
🍃 Juz 19  : Riza 
🍃 Juz 20  : Adit 
🍃 Juz 21  : Mira 
🍃 Juz 22  : Bintang 
🍃Juz 23  : Bima 
🍃Juz 24  : Alif ❎

Batas setoran khotmil Qu'ran Ahad  tgl  26  April  2026

Khataman ini kita niatkan semoga :
💐 tetap iman dan islam 
💐 sehat dhohir bathin 
💐 Mendapat hidayah 
💐  dapat rizki yg banyak halal dan berkah
💐 bisa segera pergi haji
💐 husnul khotimah.