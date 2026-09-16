# Kampung Jujur — Pengembaraan Dua Sahabat

Permainan web 3D dua pemain untuk Pendidikan Moral Tahun 4. Watak blok asli, kamera orang ketiga, pergerakan, lompatan, perbualan jiran dan tiga misi kerjasama. Tidak memerlukan akaun Roblox.

## Main bersama

1. Pemain pertama masukkan nama panggilan dan tekan **Cipta bilik**.
2. Tekan **Salin pautan** dan hantar kepada seorang rakan.
3. Rakan buka pautan, masukkan nama dan tekan **Masuk**.
4. Kedua-duanya tekan **Saya sedia!**.
5. Selesaikan tugasan masing-masing, temui jiran dan lengkapkan jurnal sendiri.

Komputer: WASD/anak panah, Space untuk lompat, E untuk berinteraksi. Seret dunia untuk kamera. Telefon: kayu ria, lompat dan butang kamera. Dekati jiran untuk membuka perbualan secara automatik. Jauhi jiran sebelum mendekatinya semula untuk mencetuskan dialog sekali lagi, atau tekan E.

## Misi

| Misi | Pemain jingga | Pemain biru | Nilai dalam tindakan |
|---|---|---|---|
| Dompet siapa? | Mengambil dompet untuk dipulangkan | Membaca petunjuk pemilik | Menjaga amanah dan memulangkan semua isi |
| Baki terlebih! | Menyemak resit | Membeli roti dan menerima baki | Memulangkan RM3 yang bukan hak sendiri |
| Berani bercakap benar | Mengaku terlanggar pasu | Memberi keterangan saksi | Bercakap benar, meminta maaf dan bantuan dewasa |

Mata diberikan kepada pasukan selepas **kedua-dua** pemain membuat pilihan jujur dan melengkapkan refleksi. Setiap misi 100 mata. Jawapan salah mendapat bimbingan dan boleh dicuba semula.

## Jalankan di komputer

Pasang Node.js 22 LTS, kemudian buka terminal dalam folder projek:

```sh
npm ci
npm run build
npm start
```

Buka `http://localhost:2567`. Dua tab boleh digunakan untuk menguji dua pemain. Untuk dua peranti pada Wi-Fi sama, gunakan alamat IP komputer pelayan dan port 2567; kedua-dua peranti perlu dapat mencapai komputer itu. Alamat localhost tidak boleh dikongsi kepada murid di luar komputer tersebut.

```sh
npm test
```

Ujian menggunakan dua sambungan Colyseus sebenar: kapasiti bilik, sedia, pergerakan, lompat, penyelarasan, sambungan semula, semakan jarak/peranan, pilihan salah, refleksi dan penyelesaian ketiga-tiga misi. Kedudukan peserta disediakan terus oleh ujian pada stesen untuk menguji protokol misi; navigasi seluruh peta bukan ujian automatik tersebut.

## Terbitkan melalui GitHub, Render dan Netlify

Fail ini sudah disediakan untuk penerbitan. **Penerbitan dalam akaun hosting belum dibuat.**

### 1. GitHub

Cipta repositori projek dan muat naik kandungan folder ini. Pastikan `package.json`, `package-lock.json`, `server`, `public`, `scripts`, `netlify.toml` dan `render.yaml` berada pada aras utama repositori. Jangan muat naik `node_modules` atau `.env`. Jika menggunakan ZIP, ekstrak dahulu; memuat naik ZIP sahaja tidak membolehkan hosting membina permainan.

### 2. Render — pelayan dua pemain

Dalam [Render Dashboard](https://dashboard.render.com/), pilih **New → Web Service**, sambungkan repositori GitHub ini, dan gunakan:

| Tetapan | Nilai |
|---|---|
| Language | Node |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/health` |
| Instance | Free untuk percubaan, jika tersedia pada akaun |

Pilihan Blueprint juga disediakan melalui `render.yaml`. Pilih pelan sendiri; projek ini tidak membeli pelan secara automatik. Setelah siap, salin URL HTTPS Render yang sebenar. URL Render itu sendiri juga boleh memainkan permainan kerana pelayan turut menyajikan fail web.

### 3. Netlify — alamat website murid

Dalam Netlify, import repositori GitHub yang sama. Tetapan dalam `netlify.toml` ialah:

| Tetapan | Nilai |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Environment variable | `SERVER_URL` = URL HTTPS Render yang sebenar |

Tetapkan `SERVER_URL` sebelum build, atau buat deploy semula selepas menukarnya. Jangan masukkan localhost, pautan bilik atau API key. Contoh format sahaja: `https://nama-pelayan.onrender.com`. Fail `dist/config.js` dihasilkan semasa build.

Untuk Netlify Drop secara manual, ubah `dist/config.js` kepada `window.GAME_SERVER = 'URL_HTTPS_RENDER_SEBENAR';` kemudian muat naik **kandungan dist**. Netlify Drop tidak menjalankan build dan tidak menukar config melalui environment variable.

Selepas kedua-duanya diterbitkan, buka alamat Netlify, cipta bilik dan kongsi pautan bilik dengan murid. Uji dari dua peranti sebelum kelas.

## Penyimpanan dan operasi kelas

- Maksimum dua pemain **setiap bilik**; pelayan boleh mengendalikan beberapa bilik bergantung pada kapasiti hosting. Beban seluruh kelas belum diuji.
- Bilik dan jurnal disimpan dalam memori pelayan. Muat turun jurnal sebelum tamat; restart/deploy pelayan boleh memadamkan bilik aktif.
- Gangguan sambungan mempunyai tempoh sambung semula 60 saat. Selepas rakan keluar kekal, jemput rakan dan tekan Sedia untuk mengulang misi semasa. Misi terdahulu kekal selagi bilik masih hidup.
- Tiada perbualan teks bebas. Kedua-dua peserta boleh melihat jurnal pasukan. Gunakan nama panggilan dan elakkan maklumat peribadi dalam refleksi.
- Render Free boleh tidur selepas 15 minit tidak aktif dan memerlukan masa untuk hidup semula. Buka permainan sebelum kelas. Lihat [had Render Free](https://render.com/docs/free).
- `ALLOWED_ORIGINS` pilihan: senarai asal website dipisahkan koma pada Render, contohnya alamat Netlify dan Render sendiri tanpa garis miring akhir. Kosong bermaksud menerima semua asal. Ini penapis asal browser, bukan sistem akaun atau kawalan akses murid.

## Penjajaran pembelajaran

**SK 10.0 — Amalan Jujur dalam Hidup Berjiran.**

| Standard | Sokongan permainan |
|---|---|
| 10.1 Ciri sikap jujur dalam hidup berjiran | Pilihan ciri dalam jurnal; guru boleh meminta murid menyenaraikan ciri lain |
| 10.2 Situasi bersikap jujur dalam hidup berjiran | Tiga situasi barang, wang dan keterangan kejadian |
| 10.3 Kepentingan sikap jujur dalam hidup berjiran | Pilihan manfaat serta perbincangan guru |
| 10.4 Perasaan berkaitan sikap jujur dalam hidup berjiran | Perasaan dan sebab bertulis dalam jurnal |
| 10.5 Amalan jujur dalam hidup berjiran | Latihan simulasi, rancangan tindakan dan susulan amalan sebenar |

Rujukan: [DSKP KSSR Pendidikan Moral Tahun 4, salinan dokumen](https://anyflip.com/srlb/fjwi/basic/) — semak bahagian Kejujuran dengan naskhah sekolah. Huraian jadual ialah pemetaan aktiviti, bukan petikan penuh standard. Mata permainan **bukan Tahap Penguasaan**. Guru masih perlu menilai kefahaman dan memerhatikan amalan sebenar; kejayaan memilih jawapan tidak membuktikan tingkah laku di luar permainan.

Cadangan sesi: 5 minit panduan, 15–20 minit bermain, 5–10 minit perbincangan. Anggaran ini perlu disesuaikan dengan keupayaan membaca dan menaip murid.

## Ubah misi

Sunting `public/shared.js`. Setiap misi memerlukan dua tugasan dengan `role` 0 dan 1, seorang jiran, tiga jawapan dengan `correct` (indeks bermula 0), pilihan manfaat dan `benefitCorrect`, serta ayat refleksi. Kedudukan menggunakan x/z dan perlu berada di kawasan yang boleh dilalui. Kemudian build dan deploy semula **pelayan serta website** agar kedua-duanya menggunakan kandungan yang sama. Perubahan bilangan misi memerlukan kemas kini paparan mata dan jumlah misi.

## Teknologi dan lesen

Three.js 0.160.1, Colyseus 0.16, Express. Aset watak dan kampung dibentuk dalam kod menggunakan geometri asli. Lesen perpustakaan disalin ke `dist/vendor`. Font Google DM Sans dan Outfit mempunyai fallback sistem. Tiada akaun Roblox atau aset Roblox diperlukan.

Rujukan hosting: [Render Node/Express](https://render.com/docs/deploy-node-express-app), [Netlify build environment variables](https://docs.netlify.com/build/configure-builds/environment-variables/).
