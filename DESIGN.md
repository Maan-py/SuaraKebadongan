# design.md — Bahasa Desain SuaraKebadongan

> Dokumen desain untuk **SuaraKebadongan** — website kenangan digital anggota KKN Desa Kebadongan, Kebumen.
> Versi 0.1 · Gelombang 1: Konsep & Token Visual · Agustus 2026
> Pendamping: `PRD.md` (apa yang dibangun) · dokumen ini menjawab *bagaimana rasanya*.

---

## Cara membaca dokumen ini

Selamat datang! Dokumen ini ditulis untuk kamu yang sedang belajar desain web sambil membangun SuaraKebadongan. Jadi jangan khawatir kalau ada istilah asing — setiap istilah teknis akan dijelaskan dengan analogi sehari-hari, seperti guru yang sabar menjelaskan di papan tulis.

**Struktur dokumen:**

1. **Konsep** — jiwa dari desain kita. Sebelum bicara warna dan angka, kita sepakati dulu satu gambar besar: desain ini terasa seperti apa? Bagian ini berisi narasi, moodboard verbal (suasana dalam kata-kata), dan prinsip-prinsip yang menjadi "hukum dasar" saat mengambil keputusan desain nanti.
2. **Token Visual** — bahan-bahan dapur desain. *Token* artinya nilai kecil yang punya nama dan peran, misalnya "warna kertas" atau "ukuran judul". Dengan token, semua halaman memakai bahan yang sama sehingga website terasa dirancang satu tangan, bukan disambung dari lima template berbeda.

Dokumen ini kini utuh: setelah Konsep dan Token Visual, ada **Desain per Halaman & Komponen** — tempat konsep dan token tadi diterapkan ke enam permukaan utama website — lalu **Sistem Motion**, **Guardrail Anti-AI-Slop**, **Performa & Aksesibilitas**, **Appendix: Token Siap Pakai**, **Glosarium**, dan penutup berupa **Kontrak Kolaborasi Belajar**. Peta lengkapnya menunggu di ujung dokumen.

**Satu konvensi penting:** setiap keputusan desain yang tidak bisa ditebak-asal akan selalu disertai kotak penjelasan bernama:

> **Kenapa begini?**
> Di sinilah kami menjelaskan alasan di balik keputusan — baik alasan perasaan ("supaya pengunjung merasa...") maupun alasan teknis ("supaya kontras teks lolos standar aksesibilitas WCAG").

Contoh nyatanya seperti kotak di atas. Kalau suatu saat kamu bertanya-tanya *"kok begini, kenapa bukan begitu?"*, cari kotak ini dulu sebelum mengubah apapun. Kalau alasannya masih kurang meyakinkan bagimu, catat dan diskusikan — dokumen ini boleh tumbuh, tapi harus tumbuh dengan sadar.

---

## Konsep

### Satu gambar besar: Scrapbook Kenangan Analog

Bayangkan sebuah **buku scrapbook / album kenangan analog** yang dikerjakan bareng teman-teman satu posko KKN di malam terakhir: foto hasil cetak lab kelurahan dengan rona hangat khas film, ditempel pakai washi tape di atas kertas karton krem, dihiasi stiker bintang dan hati, lalu diberi anotasi spidol dengan tulisan tangan miring khas orang buru-buru tapi penuh sayang.

Itulah arah desain SuaraKebadongan: **bukan tampilan web retro zaman 90-an**, melainkan nostalgia *fisik* — dunia kertas, lem, dan tangan manusia. Kenangan yang kita simpan adalah kenangan kampung Kebumen: sore di sawah, senyum warga, dokumentasi acara-acara bersama. Wajar kalau wadahnya juga terasa hangat dan buatan tangan, bukan dingin seperti dashboard aplikasi korporat.

> **Kenapa begini?**
> Nostalgianya subjeknya *kenangan KKN*, bukan *gaya web lawas*. Foto-film yang hangat dan kertas yang bertekstur langsung menyentuh ingatan tentang masa KKN itu sendiri — sedangkan estetika web retro 90-an malah membawa pengunjung ke kenangan tentang komputer, bukan tentang kampung. Satu kalimat PRD juga sudah menunjuk arah ini: "seperti buku tahunan sekolah".

### Moodboard verbal

Tutup mata sebentar, lalu bayangkan kata-kata ini satu per satu:

> sore di emperan posko · kertas karton bekas bingkai · foto polaroid miring sedikit karena buru-buru ditempel · washi tape garis-garis hijau · aroma kertas tua di rak kayu · spidol hitam yang tintanya menembus halaman · stiker hati pink di pojok foto · buku tahunan kelas yang ditandatangani semua teman · angin sawah · lampu belajar kuning · goresan pulpen biru di pinggir gambar · tawa di balik takarir foto

Kalau sebuah keputusan desain membuat website terasa seperti daftar kata di atas — kemungkinan besar itu keputusan yang benar.

### Prinsip desain

Lima prinsip berikut adalah pagar agar desain kita tidak jatuh ke jebakan template AI generik: rapi tapi hambar, semua kartu seragam sempurna seperti dicetak pabrik. Scrapbook justru hidup dari ketidaksempurnaan yang disengaja.

1. **Tidak ada dua kartu kembar.** Dua foto berdampingan tidak boleh identik: rotasinya beda 1–3 derajat, warna tapenya beda, ukurannya boleh beda. Keseragaman total adalah musuh scrapbook.
2. **Kesalahan kecil yang manusiawi diperbolehkan.** Foto diputar 1–2 derajat, garis doodle tidak lurus sempurna, tape sedikit menempel miring. Ini disengaja dan dikontrol — "kacau" di permukaan, tertata di sistemnya.
3. **Setiap animasi punya alasan cerita.** Animasi bukan hiasan; dia menceritakan sesuatu (foto "ditempel" masuk, stiker "muncul" saat discroll). Kalau tidak bisa dijelaskan alasannya dalam satu kalimat cerita, animasi itu jangan dibuat.
4. **Satu ide per permukaan.** Jangan menumpuk tape + stiker + doodle + filter sepiha dalam satu kotak. Ruang kosong adalah bagian dari kertas; biarkan ada tempat untuk bernapas.
5. **Konten adalah bintangnya.** Ornamen mengiringi, tidak merebut perhatian. Takarir foto dan cerita kenangan harus selalu paling mudah dibaca di layar.

---

## Token Visual

### Palet Warna

Palet kita terdiri dari 14 warna dalam tiga kelompok peran. Dua warna utama — **merah maroon** dan **kuning** — adalah identitas visual IG @suarakebadongan. Sisa warna dipilih supaya harmonis, kontras, dan enak dilihat bersama keduanya.

#### Kelompok Dasar — Kertas & Tinta

| Token | Hex | Peran |
|---|---|---|
| `--kertas` | `#FFFDF7` | Latar utama seluruh halaman — putih gading bersih |
| `--karton` | `#F5EDE0` | Latar kartu/kotak sekunder — karton hangat |
| `--garis-kertas` | `#E8DCC8` | Garis pemisah halus, tepi kertas sobek |
| `--tinta` | `#3D2B1F` | Teks utama & judul — coklat gelap, hangat bukan hitam pekat |
| `--tinta-lembut` | `#7A6655` | Teks sekunder: tanggal, meta, teks bantu |

> **Kenapa begini?**
> Kertas putih gading (`#FFFDF7`) netral — tidak bentrok dengan maroon atau kuning, dan memberi kesan album tua. Tinta `#3D2B1F` sengaja coklat gelap (bukan hitam) supaya hangat dan senada dengan nuansa maroon. Kombinasi `#3D2B1F` di atas `#FFFDF7` punya rasio kontras ~11:1 — jauh melampaui syarat WCAG AAA (7:1), jadi teks tetap terbaca di bawah sinar matahari.

#### Kelompok Aksen — Maroon & Kuning (Hero Colors)

| Token | Hex | Peran |
|---|---|---|
| `--stiker-merah` | `#6E0521` | **Maroon IG** — aksen utama, tombol aktif, judul |
| `--marker-kuning` | `#FED92E` | **Kuning IG** — stabilo, highlight, badge |
| `--tape-hijau` | `#4A8C5C` | Hijau natural — komplementer maroon, memberi "nafas" segar |
| `--pulpen-biru` | `#2E5090` | Navy warm — tautan/link, kontras cukup tanpa mencolok |
| `--stiker-pink` | `#C9879E` | Dusty rose — turunan maroon, elegan bukan bubblegum |
| `--spidol-ungu` | `#6B4E8F` | Ungu gelap — royal, melengkapi kuning sebagai komplementer |

> **Kenapa begini?**
> Maroon `#6E0521` adalah warna identitas — mendominasi sebagai aksen utama. Kuning `#FED92E` adalah highlight yang langsung menarik mata. Empat aksen lain dipilih dari sudut pandang *color theory*: hijau komplementer alami merah (memberi kontras segar), biru navy warm (tidak "dingin" seperti biru muda), pink dusty rose (turunan natural maroon), dan ungu gelap (komplementer kuning). Semua warm-toned supaya satu keluarga dengan kertas dan maroon. Aturan pakai: aksen untuk elemen dekoratif; teks kecil penting tetap `--tinta`. `--marker-kuning` hanya sebagai latar stabilo dengan teks `--tinta` di atasnya — kuning sebagai warna teks tidak akan terbaca.

#### Kelompok Sepia — Warna Foto Lama

| Token | Hex | Peran |
|---|---|---|
| `--sepia-terang` | `#C8A165` | Nuansa terang filter foto film lama |
| `--sepia-gelap` | `#8A6642` | Bingkai foto pudar, area gelap foto |
| `--polaroid` | `#FFFDF7` | Putih gading bingkai polaroid |

> **Kenapa begini?**
> Foto kenangan KKN kebanyakan jepretan HP, tapi kita ingin semuanya terasa seperti satu roll film lama yang sama. Sentuhan sepia (coklat kekuningan khas foto jadul) pada overlay, border, dan placeholder membuat koleksi foto yang berbeda-beda sumbernya terasa seperti satu album. `--polaroid` putih gading dipisah dari kertas krem supaya bingkai foto tampak "menempel di atas" kertas, bukan menyatu dengannya.

Catatan: dark mode tidak didesain di versi ini — calon v1.1.

### Tipografi

Kita memakai **tiga font gratis dari Google Fonts**, satu font untuk satu peran. Tiga peran, tiga kepribadian:

| Peran | Font | Dipakai untuk | Karakter |
|---|---|---|---|
| Display (playful) | **Shantell Sans** | Judul besar H1/H2, logo, sapaan gerbang | Bulat, riang, seperti huruf papan pengumuman kelas |
| Body (terbaca) | **Nunito** | Paragraf, tombol, menu, caption panjang | Ujung huruf membulat, hangat, sangat nyaman di layar HP |
| Handwritten (anotasi) | **Caveat** | Takarir polaroid, catatan pinggir, stiker kalimat | Tulisan tangan cepat dengan pulpen |

> **Kenapa begini?**
> Satu font saja akan membuat semua teks terasa sama datar; lima font akan membuat halaman seperti kolase toko online. Tiga adalah titik manisnya: display memberi suara ceria di judul, body menjamin kenyamanan membaca (ini font yang paling sering dilihat mata), handwritten menyuntikkan rasa "ditulis manusia" tepat di momen personal seperti takarir. Ketiganya tersedia gratis di Google Fonts dan mendukung bahasa Indonesia, jadi tidak ada biaya lisensi dan tidak ada huruf hilang.

### Skala Ukuran (mobile-first)

Ukuran font memakai tangga tetap, dirancang mulai dari layar HP:

| Token | Ukuran | Peran umum |
|---|---|---|
| `--fs-xs` | 12px | Label kecil, tanggal di stiker |
| `--fs-sm` | 14px | Meta, teks bantu |
| `--fs-base` | 16px | Paragraf utama (jangan lebih kecil dari ini!) |
| `--fs-md` | 20px | Subjudul, judul kartu |
| `--fs-lg` | 24px | Judul seksi (H3) |
| `--fs-xl` | 32px | Judul halaman (H2) |
| `--fs-2xl` | 48px | Judul hero/display (H1), angka besar |

Tinggi baris (*line-height*): display 1.15, body 1.6, Caveat 1.3. Di layar lebih besar (tablet/desktop), tangga ini naik proporsional — urutan dan perannya tidak berubah.

> **Kenapa begini?**
> Mayoritas pengunjung membuka dari HP (PRD: mobile-first), jadi skala disusun dari ukuran HP dulu, bukan dari monitor. Batas 16px untuk paragraf adalah aturan kenyamanan membaca di layar kecil; di bawah itu mata cepat capek. Lompatan ukuran yang konsisten (naik ±1,25–1,5x tiap anak tangga) membuat hierarki "mana judul, mana isian" terasa jelas tanpa perlu berpikir.

### Sistem Tekstur & Ornamen

Inilah bumbu scrapbook-nya. Semua dibuat dari **CSS dan SVG inline — nol file gambar berlisensi**:

- **Tekstur kertas** — latar halaman diberi noise sangat halus dari filter SVG `feTurbulence` (dipanggil sebagai data-URI di CSS) plus gradasi radial lembut, supaya kremnya terasa "ada seratnya", bukan warna polos.
- **Washi tape** — strip semi-transparan dari CSS gradient, diputar −2° sampai +2°, ujungnya bisa zigzag via `clip-path`. Warna mengikuti aksen (terutama `--tape-hijau`).
- **Bingkai polaroid** — kotak `--polaroid` dengan padding bawah lebih tebal (proporsi khas foto polaroid), bayangan kertas lembut, rotasi ±1–2°.
- **Stiker** — bentuk SVG sederhana (bintang, hati, panah, lingkaran sobek) dengan fill warna aksen dan outline `--polaroid` ala stiker die-cut, plus stroke tipis `--tinta`.
- **Doodle** — path SVG bergaya gambar tangan: garis agak goyang, ujung bulat (`stroke-linecap="round"`), lengkung quadratic yang sengaja tidak simetris.

> **Kenapa begini?**
> Tekstur dari kode (CSS/SVG) tajam di semua resolusi layar, ukurannya hanya beberapa ratus byte, dan bebas masalah hak cipta — berbeda dengan foto tekstur kertas yang berat diunduh dan berlisensi. Selain itu, ornamen berupa kode bisa diberi variabel warna token di atas, jadi kalau palet berubah, seluruh tape dan stiker ikut berubah otomatis.

### Radius, Bayangan, Spasi

- **Radius sudut:** `4px` (input, tape), `8px` (kartu, tombol sekunder), `16px` (modal, tumpukan polaroid), `999px` (pill/badge).
- **Bayangan kertas (2 layer):**
  - Kartu: `0 1px 2px rgba(46,33,24,.08)` (kontak dengan kertas) + `0 6px 16px rgba(46,33,24,.12)` (kesan terangkat).
  - Tape: satu layer saja, sangat lembut — tape menempel, bukan melayang.
- **Spasi:** grid dasar **4px**; token langkah `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px`.

> **Kenapa begini?**
> Bayangan dua lapis adalah trik kecil yang membuat kartu terlihat seperti kertas asli yang diletakkan di atas kertas lain: lapis pertama adalah bayangan sentuh di tepi, lapis kedua adalah kabut lembut di bawahnya. Grid 4px dipakai karena hampir semua ukuran layar dan ikon adalah kelipatan 4, sehingga jarak antarelemen selalu "pas" dan mudah dihitung saat coding — tidak ada margin 13px misterius.

### Ikonografi

Ikon SuaraKebadongan berprinsip **gambar tangan**: stroke 2px yang sengaja tidak sempurna (sedikit goyang, sudut tidak lancip sempurna), goresan terasa seperti spidol atau pulpen, ujung garis membulat. Satu set ikon harus terasa digambar oleh *satu tangan yang sama*. Hindari ikon library bawaan yang geometris sempurna; jika harus memakai library, pilih varian bergaya tulis-tangan dan sesuaikan ketebalan stroke-nya.

> **Kenapa begini?**
> Ikon yang terlalu sempurna justru memecah ilusi scrapbook — seperti menempel stiker plastik kaku di album foto keluarga. Stroke yang sedikit tidak rapi membuat antarmuka terasa dikerjakan teman, bukan digenerate mesin; dan konsistensi "satu tangan" mencegah halaman terlihat seperti kumpulan gambar curian dari mana-mana.

---

## Desain per Halaman & Komponen

Sekarang saatnya menempelkan semua bahan tadi ke halaman. Bagian ini membedah enam permukaan utama SuaraKebadongan dengan **format yang sama persis** — anggap saja formulir cek kesehatan yang wajib diisi setiap permukaan, supaya tidak ada yang luput dan kamu bisa membandingkan antarhalaman dengan mudah:

- **Tujuan emosional** — perasaan yang harus muncul di dada pengunjung.
- **Layout & responsive** — susunan ruang, dirancang dari HP (360px) lalu naik ke tablet (768px) dan desktop (1024px).
- **Konten & microcopy** — teks asli yang muncul di layar; microcopy adalah kata-kata kecil (placeholder, pesan galat, tombol) yang sering diremehkan padahal penentu rasa "manusiawi".
- **Interaksi & State** — perilaku saat disentuh, plus state kosong (*empty*), galat (*error*), dan loading. State kosong dan galat itu WAJIB — halaman yang hanya cantik saat penuh data belum selesai didesain.
- **Animasi ringkas** — pratinjau satu-dua baris (pustaka + trigger + durasi + easing); spesifikasi penuhnya ada di bagian Sistem Motion. Tiap permukaan juga menyebut versi *reduced-motion*-nya.
- **Edge case** — kejadian aneh tapi pasti terjadi.
- **Aksesibilitas** — jaminan bahwa semua orang bisa memakainya, termasuk pengguna pembaca layar dan navigasi keyboard.
- **Do / Don't** — pagar anti-slop: apa yang boleh, apa yang haram.

Aturan universal yang berlaku di SEMUA permukaan (tidak akan diulang terus): latar `--kertas` bertekstur, teks `--tinta`, judul Shantell Sans, isi Nunito, anotasi Caveat, target sentuh minimum 44×44px, dan prinsip "satu ide per permukaan". Yang TIDAK kita desain di versi ini (ikut PRD, out-of-scope): timeline, peta lokasi, profil anggota, video, tagging teman, dan notifikasi push.

### 1. Gerbang Passcode `/` — Pintu Masuk yang Berbisik

Satu-satunya pintu masuk seluruh isi website (PRD F1). Satu passcode bersama untuk semua anggota — tanpa akun, tanpa email, tanpa identitas.

> **Kenapa begini?**
> Passcode bersama (bukan akun individu) bukan keterbatasan teknis — dia inti produknya. Seperti posko KKN yang pintunya tak berkunci tapi cuma anggota yang tahu kata sambungannya: siapa pun yang berhasil masuk otomatis "orang dalam", dan tidak ada jejak siapa masuk kapan. Sistem akun justru akan menghancurkan janji anonimitas dan menambah beban kerja sia-sia.

**Tujuan emosional:** deg-degan manis lalu lega — seperti berdiri di depan posko, nekat bersiul sambutan, dan langsung disambut "oh, kamu tolong!" Mau rasa: rahasia kecil + pulang kampung.

**Layout & responsive:** satu layar penuh tanpa gulir di HP 360px: kartu gerbang `--karton` (radius 16px, shadow kertas 2-layer) di tengah, tape `--tape-hijau` miring −2° menempel di tepi atas kartu, stiker bintang `--stiker-merah` kecil di pojok. Di 768px dan 1024px kartu tetap maksimum 420px dan dipusatkan — gerbang memang sempit seperti pintu sungguhan; sisanya kertas kosong dengan doodle jarang (ranting, burung).

**Konten & microcopy:** Judul Shantell Sans `--fs-xl`: "Selamat datang di Badongan." Subjudul Nunito `--fs-base`: "Satu pintu untuk semua anggota. Kalau kamu pernah tinggal di sini, kamu pasti tahu suaranya." Input placeholder: "psst… ketik suara pintunya". Tombol pill `--tape-hijau` teks `--tinta`: "Ketuk Pintu". Anotasi Caveat miring di pojok kartu: "sst… jangan bocorkan ke desa sebelah".

**Interaksi & State:**
- *Kosong* — tombol tetap aktif; submit tanpa isi memunculkan hint ramah: "Isi dulu suara pintunya ya."
- *Loading* — tombol disabled, teksnya berganti "Mengetuk-ngetuk…" + titik-titik berjalan.
- *Galat* — pesan di bawah input: "Hmm, itu bukan suara pintu Badongan. Coba ingat-ingat lagi ya." Tanpa detail teknis sama sekali (PRD).
- *Rate-limit terkunci* — "Pintunya baru saja diketuk terus-menerus. Istirahat sebentar ya, satu menit lagi boleh coba lagi."

**Animasi ringkas:** Motion — kartu masuk fade + naik 8px, 400ms ease-out saat load; galat shake horizontal ±4px, 300ms ease-in-out. *Reduced-motion*: kartu tampil statis tanpa fade/naik, galat cukup kedip border merah. Detail penuh di Sistem Motion.

**Edge case:** pengunjung yang masih punya sesi valid dan membuka `/` langsung dialihkan ke galeri; sesi habis di tengah pemakaian → semua aksi mengarah balik ke gerbang ini dengan pesan yang sama ramahnya.

**Aksesibilitas:** input bertipe password dengan label yang terikat eksplisit ("Passcode bersama"); pesan galat memakai `aria-live="polite"` agar pembaca layar mengumumkannya; kontras teks `--tinta` di atas `--karton` ±12:1 (jauh di atas AA); urutan fokus keyboard: input → tombol.

**Do / Don't**

| Do | Don't |
|---|---|
| Galat dibungkus bahasa teman yang mengajak ingat-ulang | Menampilkan "401 Unauthorized" atau petunjuk teknis apa pun |
| Kartu tunggal fokus, ornamen maksimal dua (tape + stiker) | Menumpuk lima ornamen + animasi partikel di halaman pertama |

### 2. App Shell & Navigasi — Kerangka Buku

Rangka yang menempel di semua halaman setelah gerbang: kepala halaman, menu pindah ruangan, dan tempat tombol kejutan menempel (PRD F5 butuh rumah global).

> **Kenapa begini?**
> Di mobile-first, menu utama kami letakkan sebagai tab bar di BAWAH layar, bukan hamburger di atas. Alasannya ergonomi jempol: 49% waktu pegang HP, ibu jari hidup di sepertiga bawah layar. Menu di atas = jempol harus akrobat tiap pindah halaman; menu di bawah = sekali jentek.

**Tujuan emosional:** rasa memegang satu album utuh — pindah halaman terasa membuka lembar baru, bukan melompat antar-aplikasi.

**Layout & responsive:** di 360–767px: tab bar tetap di bawah, tinggi 64px, tiga tab ikon+label (Galeri · Suara · Cat Tempel), tombol "Inget ga sih?" melayang di kanan-bawah DI ATAS tab bar. Di 768px: tab bar pindah menjadi header horizontal di atas. Di 1024px: konten maksimum 1100px di tengah, logo "Badongan" Shantell Sans + potongan tape di kiri atas, tombol keluar di kanan atas.

**Konten & microcopy:** label tab satu kata: "Galeri", "Suara", "Cat Tempel" — chat dinamakan "Suara" sesuai nama produk, bukan generik "Chat". Tombol keluar: "Keluar Sebentar" (tanpa dialog konfirmasi menakutkan; sesi memang ringan). Banner offline: "Sinyal hilang — kenangan tidak kemana-mana kok, sabar sedikit."

**Interaksi & State:**
- *Kosong* — shell sengaja tanpa badge/notifikasi/counter merah (produk anti-FOMO); kekosongan ditangani masing-masing halaman.
- *Aktif* — tab aktif diberi lingkaran stabilo `--marker-kuning` di belakang ikon + label menebal.
- *Galat/offline* — banner tipis di bawah header, latar `--marker-kuning` teks `--tinta`, auto-hilang saat koneksi pulih.

**Animasi ringkas:** Motion — indikator tab aktif slide mengikuti tab, 250ms ease-in-out; pergantian halaman crossfade 200ms ease-out. *Reduced-motion*: pergantian halaman instan tanpa crossfade. Detail penuh di Sistem Motion.

**Edge case:** deep link (`/notes/abc`) tetap mendarat benar setelah cek sesi; posisi scroll tiap tab dipertahankan saat bolak-balik; tab bar tidak pernah menutupi ujung konten (padding-bottom aman untuk HP ber-gesture-bar).

**Aksesibilitas:** elemen `<nav>` dengan `aria-current="page"` pada tab aktif; label tab tetap tampil (bukan ikon-saja); semua target ≥44px; fokus keyboard terlihat jelas dengan outline `--pulpen-biru`.

**Do / Don't**

| Do | Don't |
|---|---|
| Tiga tab besar, jempol-reach, label selalu terbaca | Hamburger menu + submenu bertingkat ala aplikasi korporat |
| Tab bar warna kertas dengan garis `--garis-kertas` di atasnya | Tab bar gelap pekat / glassmorphism yang memecah dunia kertas |

### 3. Galeri Foto `/galeri` — Halaman-Halaman Album

Jantung kenangan (PRD F2): unggah banyak foto, kelompokkan per album, jelajahi masonry rasio asli, buka lightbox lengkap.

> **Kenapa begini?**
> Masonry dengan RASIO ASLI (setiap foto mempertahankan proporsi landskap/portre-nya) kami pilih over grid kotak seragam ala Instagram, karena foto KKN campur aduk orientasinya. Memotong foto grup di sawah biar kotak rapi sama saja dengan memotong wajah warga — mengkhianati kenangan. Ketidakteraturan masonry juga sudah otomatis "scrapbook": tidak ada dua kolom yang identik.

**Tujuan emosional:** rasa membuka album foto di rak — lambat, hangat, dan iseng berkomentar di tiap foto ("ini pas hujan-hujanan!").

**Layout & responsive:** masonry CSS columns: 360px → 2 kolom (lebar kolom min ~160px); 768px → 3 kolom; 1024px → 4 kolom, maksimum 1100px. Tiap foto dibingkai polaroid `--polaroid` (padding bawah lebih tebal), rotasi bergantian −1.5°/+1°/+0.5°, shadow kertas, tape kecil warna acak dari aksen. Thumbnail diberi overlay `--sepia-terang` sangat tipis agar koleksi terasa satu roll film; foto ASLI utuh di lightbox. Baris chip album di atas (pill outline `--spidol-ungu`); zona unggah strip putus-putus `--garis-kertas` di atas grid.

**Konten & microcopy:** judul halaman Shantell Sans "Album Kenangan"; subjudul Caveat "ditempel pelan-pelan, biar kenangannya awet". Zona unggah: "Seret fotonya ke sini, atau ketuk untuk memilih — boleh banyak sekaligus!". Chip album contoh: "Bersih Desa", "Pentas Seni", "Pamitan". Tombol unduh di lightbox: "Simpan Fotonya".

**Interaksi & State:**
- *Kosong* — ilustrasi doodle kamera + teks: "Belum ada satu pun foto. Album kenangan dimulai dari satu jepretan pertama nih."
- *Loading unggah* — tiap foto menampilkan placeholder blok `--sepia-gelap` dengan progress tipis; gagal → pesan ramah per foto: "Waduh, format ini belum bisa ditempel di album. Coba JPG atau PNG ya." (PRD: format/ukuran)
- *Lightbox* — backdrop coklat hangat `rgba(46,33,24,.9)`; polaroid di tengah; takarir Caveat `--fs-md`; tanggal `--fs-xs` `--tinta-lembut`; prev/next sebagai area sentuh lebar di sisi kiri/kanan; hapus foto (prinsip saling percaya) pakai konfirmasi ringan: "Yakin cabut foto ini dari album?"
- *Hapus* — kartu menyusut lalu hilang; toast "Fotonya dicopot dari album."

**Animasi ringkas:** GSAP ScrollTrigger — kartu "ditempel" masuk satu-per-satu (scale .96→1 + settle rotasi), 350ms ease-out-back, stagger 60ms; lightbox fade 200ms ease-out. *Reduced-motion*: grid tampil penuh tanpa stagger; lightbox transisi opacity singkat saja. Detail penuh di Sistem Motion.

**Edge case:** foto yang terbuka di lightbox dihapus anggota lain → lightbox menutup mulus dengan toast; ratusan foto → lazy-load + jangan render semua polaroid sekaligus; drag-drop file non-gambar → tolak dengan pesan yang sama ramahnya.

**Aksesibilitas:** alt text tiap gambar = takarirnya (kalau kosong, "Foto tanpa takarir"); lightbox = dialog dengan focus trap, tombol Esc menutup, panah kiri/kanan keyboard untuk navigasi; caption dan tanggal tetap teks sungguhan (bukan gambar); kontras caption dijamin oleh aturan token (teks `--tinta`, bukan di atas merah).

**Do / Don't**

| Do | Don't |
|---|---|
| Rotasi & tape bervariasi per kartu (prinsip "tak ada dua kartu kembar") | Grid kotak seragam sempurna dengan crop paksa 1:1 |
| Skeleton placeholder sepia saat memuat | Spinner bundar generik di tengah halaman kosong |

### 4. Chat Anonim `/chat` — "Suara" Posko

Obrolan grup waktu-nyata tanpa identitas (PRD F3) — inti dari nama SuaraKebadongan. Nama samaran bergaya kampung + avatar hewan digenerate ULANG untuk setiap pesan.

> **Kenapa begini?**
> Nama samaran dan avatar sengaja BERGANTI TIAP PESAN, bukan melekat per orang. Kalau konsisten, "Bu Marni" yang rajin chat bisa dikenali polanya — anonimitas jadi bocor lewat perilaku, dan janji "server tidak menyimpan identitas apa pun" kurang terasa. Berganti tiap pesan membuat pelacakan mustahil sekaligus menghadirkan kegembiraan lotre kecil: setiap bubble adalah kejutan lucu ala tulisan tumpang-tindih di buku tahunan.

**Tujuan emosional:** rasa nongkrong di teras posko malam-malam — bebas ngomong apa saja karena tidak ada yang tahu ini siapa; tiap bubble bikin senyum sendiri karena nama samarannya kocak.

**Layout & responsive:** 360px: daftar bubble memenuhi tinggi layar di ATAS input bar yang menempel bawah (di atas tab bar); bubble maksimum 80% lebar. 768px: kolom chat maksimum 640px di tengah. 1024px: 720px + panel tipis? TIDAK — tetap satu kolom; obrolan memang satu suara bersama, bukan dashboard. Avatar hewan SVG gambar-tangan (kucing, ayam, kambing, cicak, bebek, belut) dengan warna fill acak dari aksen stiker, ukuran 36px, stroke `--tinta`.

**Konten & microcopy:** contoh nama samaran gaya kampung: "Bu Marni Penjual Tempe", "Mas Tugimin Tukang Sepeda Ontel", "Mbah Rejo Warga RT 03", "Cicak Kecil Batas Sawah". Placeholder input: "Tulis apa saja… tidak ada yang tahu ini kamu kok". Penghitung karakter (maks ±500): "sisa 500 huruf". Indikator mengetik TANPA nama: "Seseorang sedang mengetik…".

**Interaksi & State:**
- *Kosong* — "Belum ada suara sama sekali. Kasih salam pertama buat yang lain yuk!"
- *Loading riwayat* — tiga skeleton bubble `--karton`.
- *Galat/offline* — banner: "Suaramu belum terkirim — sinyal lagi ngambek. Coba kirim ulang ya." Pesan tidak hilang saat gagal kirim.
- *Auto-scroll* — mengikuti pesan baru selama user berada di dasar; kalau user sedang membaca riwayat ke atas, scroll TIDAK dipaksa — muncul pill mengambang "3 pesan baru ↓" yang melompat ke bawah saat diketuk.
- Pesan terkirim tidak bisa diedit/dihapus (sifat obrolan, PRD) — tidak ada menu long-press.

**Animasi ringkas:** React Spring — bubble baru pop scale .92→1 + naik 4px, 180ms ease-out; typing dots naik-turun loop 900ms linear infinite. *Reduced-motion*: bubble langsung muncul; dots statis menyala bergantian via opasitas. Detail penuh di Sistem Motion.

**Edge case:** pesan kosong/spasi → tombol kirim tetap mati; spam klik kirim → debounce; riwayat hanya N pesan terakhir (PRD) dengan teks kecil di atas: "cuma N suara terakhir yang tersimpan — yang lewat ya sudah lewat"; pesan sangat panjang tanpa spasi → word-break aman.

**Aksesibilitas:** area pesan `aria-live="polite"` agar pesan baru diumumkan pembaca layar; indikator mengetik diumumkan sekali, bukan tiap frame; input berlabel; counter diumumkan politely di ambang tertentu (50 huruf terakhir); kontras teks bubble: `--tinta` di `--karton` ±12:1, dan bubble "baru dikirim dari HP-mu" rata kanan berlatar tint `--tape-hijau` dengan teks `--tinta` ±5:1 (lolos AA).

**Do / Don't**

| Do | Don't |
|---|---|
| Nama samaran + avatar baru untuk SETIAP pesan, gaya kampung yang hangat | Username tetap, warna bubble per-user, atau fitur "profil" siapa pun |
| Indikator mengetik anonim "Seseorang…" | Indikator mengetik yang menyebut nama samaran (membuat orang bisa dikenali) |

### 5. Papan Cat Tempel `/notes` — Dinding Pesan Warna-Warni

Papan cat kolektif (PRD F4): pesan singkat, doa, atau kejadian konyol — maksimal ±280 karakter, sinkron real-time.

> **Kenapa begini?**
> Batas ±280 karakter bukan arbitrer: satu catatan tempel fisik memang cuma muat beberapa baris — kalau lebih panjang, orang menulis di kertas kedua, dan itulah keajaibannya: satu pikiran = satu catatan. Batas ini menjaga papan tetap padat-rapi di layar HP, memaksa pesan jadi padat dan lucu, serta menghemat storage free tier.

**Tujuan emosional:** rasa lewat depan posko dan membaca dinding pengumuman desa yang diisi semua orang — ada yang nulis doa, ada yang nulis curhat, semuanya berderet warna-warni bikin senyum.

**Layout & responsive:** masonry catatan: 360px → 2 kolom; 768px → 3 kolom; 1024px → 4–5 kolom, maksimum 1100px, terbaru selalu paling depan (PRD). Kartu catatan: radius 4px, rotasi bergantian ±1–2°, ornamen bergantian pin bulat `--stiker-merah` atau strip tape kecil; teks Nunito `--fs-base` `--tinta`. Enam pilihan warna catatan dari keluarga palet (tint kuning marker, pink stiker, hijau tape, ungu spidol, merah stiker, karton) — semuanya versi pucat agar teks `--tinta` tetap kontras tinggi. Formulis tulis menempel di atas papan seperti catatan "paling baru" milikmu sendiri.

**Konten & microcopy:** placeholder textarea: "Tulis pesan, doa, atau kejadian konyol hari ini…" Penghitung: "sisa 280 huruf". Label pilihan warna: "Pilih warna catetannya". Contoh isi catatan (suasana): "Semoga kita ketemu lagi di Badongan, minimal reuninya di warung Bu Marni." Tombol simpan: "Tempel!"

**Interaksi & State:**
- *Kosong* — papan dengan satu catatan "hantu" garis putus-putus: "Papan masih kosong nih. Jadi orang pertama yang naruh tempel di dinding!"
- *Edit/hapus* — ketuk catatan → popover edit inline; siapa pun boleh (saling percaya, PRD); hapus pakai konfirmasi mini: "Cabut catatan ini dari papan?"
- *Galat sinkron* — catatan gagal terkirim diberi sudut lipat `--sepia-gelap` + badge "belum nempel — ketuk untuk coba lagi"; sinkron real-time menandai catatan baru anggota lain dengan kilat tape kecil.
- *Loading* — formulis langsung aktif (optimistic); papan memuat skeleton catatan.

**Animasi ringkas:** React Spring — catatan baru "menempel": scale .9→1 dengan overshoot rotasi kecil, 250ms spring (stiffness ~260); hapus shrink-fade 150ms ease-in. *Reduced-motion*: catatan muncul/hilang langsung tanpa gerak. Detail penuh di Sistem Motion.

**Edge case:** persis 280 karakter → counter berubah "habis!" dan textarea berhenti menerima; dua orang mengedit catatan yang sama hampir bersamaan → yang tersimpan terakhir menang, sederhana (produk saling percaya, bukan kolaborasi dokumen); teks tanpa spasi panjang → word-break; emoji diperbolehkan sebagai teks biasa.

**Aksesibilitas:** swatch warna adalah tombol nyata dengan label ("kuning", "pink"…) — makna tidak pernah bergantung warna saja; counter `aria-live="polite"`; popover edit focus-trap + Esc menutup; urutan tab: textarea → swatch → tombol tempel.

**Do / Don't**

| Do | Don't |
|---|---|
| Warna catatan pucat-keluarga-palet, teks selalu `--tinta` | Catatan neon full-saturasi dengan teks putih (kontras hancur) |
| Edit/hapus terbuka untuk semua, tanpa hierarki admin | Sistem moderasi/laporan kompleks — produk ini lahir dari saling percaya |

### 6. Tombol "Inget ga sih?" — Kejutan Pengenalan

Tombol sticker-style yang menempel di SEMUA halaman setelah gerbang (PRD F5): satu ketukan, satu foto acak, satu serangan rindu dadakan.

> **Kenapa begini?**
> Kenapa tombolnya GLOBAL dan melayang, bukan menu di galeri? Karena rindu tidak pernah datang di jadwal: bisa saat buka chat, bisa saat baca catatan lama. Kejutan harus selalu dalam jangkauan satu jempol. Bentuknya stiker sobek (bukan tombol sistem biasa) supaya terasa seperti stiker tempelan yang minta dicolek — bukan tombol CTA iklan.

**Tujuan emosional:** kaget kecil → senyum lebar → kadang haru. Satu foto acak bisa mengubah hari yang biasa jadi hari yang pengen telepon teman KKN.

**Layout & responsive:** tombol bintang-meledak SVG `--stiker-merah` dengan outline die-cut `--polaroid`, diameter 56px (mobile) / 64px (desktop), posisi kanan-bawah melayang di atas tab bar (mobile) atau pojok kanan-bawah (desktop); label Shantell Sans pendek "Inget ga sih?" mengikuti bentuk bintang. Modal: backdrop `rgba(46,33,24,.85)`; polaroid jatuh ke tengah (rotasi acak ±2°), takarir Caveat + tanggal `--fs-xs`; di bawahnya tombol pill "Lagi!" `--tape-hijau` dan silang tutup bergaya stiker bundar.

**Konten & microcopy:** label tombol persis: "Inget ga sih?" (identitas fitur, jangan diubah). Tombol ulang: "Lagi!" (PRD). Kosong: "Albummu masih kosong nih — unggah foto dulu yuk, biar ada yang bikin kangen." Caption bawah modal, Caveat: "*klik Lagi! kalau belum cukup kangeni*".

**Interaksi & State:**
- *Default* — idle wiggle halus tiap ±8 detik (menggoda tanpa mengganggu).
- *Modal terbuka* — foto acak ≠ foto sebelumnya (tanpa pengulangan beruntun, PRD); "Lagi!" menukar foto di tempat tanpa menutup modal.
- *Kosong* — pesan ramah ajak unggah (di atas), plus tombol menuju galeri.
- *Galat jaringan* — "Fotonya macet di jalan. Coba sekali lagi ya."
- *Menutup* — ketuk backdrop, silang, Esc, atau geser ke bawah (mobile) — semudah menutup buku.

**Animasi ringkas:** Motion — polaroid drop dari atas + settle rotasi, 300ms ease-out-back; swap "Lagi!" flip-fade 250ms ease-in-out. *Reduced-motion*: polaroid fade-in diam tanpa drop/wiggle. Detail penuh di Sistem Motion.

**Edge case:** spam ketuk "Lagi!" → debounce 400ms; foto yang tampil dihapus anggota lain → "Lagi!" berikutnya melewati foto itu; galeri tinggal 1 foto → tetap jalan (selalu foto itu, tanpa error); modal terbuka saat orientasi HP diputar → polaroid re-fit.

**Aksesibilitas:** modal `role="dialog"` + `aria-modal="true"` + label "Kejutan foto kenangan"; focus trap di modal, kembali ke tombol saat tutup; tombol utama 56px > standar sentuh; wiggle idle otomatis MATI saat `prefers-reduced-motion`; teks di stiker merah hanya label besar Shantell Sans (elemen besar, ambang 3:1) — teks kecil penting tidak pernah ditaruh di atas merah.

**Do / Don't**

| Do | Don't |
|---|---|
| Satu foto per bukaan + tombol "Lagi!" eksplisit | Auto-play slideshow foto berantai tanpa diminta |
| Stiker sobek hangat yang menggoda lewat bentuk | Badge notifikasi merah berkedip ala iklan "kamu punya 3 kejutan!" |

---

## Sistem Motion

Kalau Token Visual adalah bahan dapur dan bagian sebelumnya adalah ruangan-ruangannya, bagian ini mengatur **cara rumah bergerak**: pintu membuka dengan ritme apa, kertas jatuh secepat apa, kapan gerakan harus berhenti total. Gerakan (motion) yang baik di website scrapbook seperti lem yang tepat pakai — cukup untuk menempel manis, berlebihan membuat semuanya lengket kacau.

Bagian ini terdiri dari empat lembar: (a) peta peran tujuh pustaka animasi bertingkat (tier), (b) tabel spesifikasi animasi konkret yang mengonsolidasi semua pratinjau "Animasi ringkas" di bagian Desain per Halaman — angka-angkanya TIDAK berubah, hanya dilengkapi, (c) pola integrasi Next.js 15 App Router, dan (d) aturan verifikasi versi pustaka.

### (a) Peta Peran & Tier Tujuh Pustaka

*Tier* artinya tingkatan keputusan: **CORE** wajib dipasang (3 pustaka), **RECOMMENDED** disiapkan rencananya tapi baru dipasang saat fiturnya benar-benar dibutuhkan, **SKIP** diputuskan TIDAK dipasang dengan alasan tertulis.

| Pustaka | Tier | Peran dalam proyek ini | Kapan dipakai | Situs |
|---|---|---|---|---|
| **Lenis** | CORE | Smooth scroll premium — roda gulir terasa seperti menggeser album di meja, bukan melompat-lompat | Sejak hari pertama, level App Shell (seluruh halaman) | lenis.dev |
| **GSAP + ScrollTrigger** | CORE | Scroll sinematik: kartu polaroid "ditempel" satu-per-satu saat discroll, stagger galeri | Saat membangun Galeri (plugin ScrollTrigger lazy-load di sana saja) | gsap.com |
| **Motion** (dulu dikenal sebagai Framer Motion) | CORE | Tulang punggung UI: animasi mount/unmount otomatis + `whileInView`, gerbang, lightbox, modal kejutan | Sejak hari pertama, tersebar di semua komponen | motion.dev |
| **Anime.js v4** | RECOMMENDED | Micro-detail: menggambar doodle SVG gores-per-gores (stroke draw), angka penghitung | Nanti, jika ada detail mikro yang merepotkan ditulis di Motion/GSAP | animejs.com |
| **React Spring** | RECOMMENDED | Spring fisika alami untuk gesture/drag cat tempel (catatan bisa digeser-geser terasa kenyal seperti kertas sungguhan) | Saat fitur drag/gesture cat tempel benar-benar dibangun | react-spring.dev |
| **Three.js** | SKIP DENGAN ALASAN | Grafik 3D WebGL | Tidak dipasang di v1 — terlalu berat untuk mobile-first + Vercel free tier; calon v1.x bila suatu saat benar-benar butuh 3D | threejs.org |
| **Trig JS** | SKIP DENGAN ALASAN | Efek scroll berbasis atribut HTML | Tidak dipasang — perannya sudah dijawab GSAP ScrollTrigger (lihat kotak di bawah) | github.com/iDev-Games/Trig-JS |

> **Kenapa begini?**
> Kenapa cuma 3 yang inti? Anggaran bundle. Pengunjung mayoritas memakai HP kelas menengah-bawah dengan sinyal desa yang musim hujan suka ngambek, dan hosting gratis punya batas. Setiap kilobyte JavaScript harus membuktikan diri layak diunduh. Tiga CORE ini dipilih karena perannya TIDAK tumpang tindih: Lenis mengurus *rasa menggulir*, GSAP+ScrollTrigger mengurus *koreografi berdasarkan posisi scroll*, Motion mengurus *hidup-matinya elemen UI* (muncul, hilang, berubah state). Sisanya harus lolos ujian "ada masalah yang cuma bisa diselesaikan pustaka ini?" sebelum boleh naik kapal.

> **Kenapa begini?**
> Kenapa Trig JS dilewati padahal dia salah satu yang direferensikan? Ini bukan penilaian bahwa Trig JS jelek — ide efek-scroll-via-atribut-HTML-nya menarik dan pendekatannya ramah pemula. Alasannya murni arsitektur: perannya tumpang tindih hampir sepenuhnya dengan GSAP ScrollTrigger yang sudah kami adopsi untuk kasus yang sama. Memasang keduanya berarti dua alat untuk satu pekerjaan: bundle membengkak, dua mental model harus dipegang, dan bug scroll bisa datang dari dua arah. Prinsip kita: **satu masalah, satu alat**. Kalau suatu hari proyek meninggalkan GSAP, Trig JS layak ditinjau ulang sebagai pengganti — bukan teman sekamar.

Catatan konsistensi: dua spesifikasi di Wave 2 (bubble chat pop dan spring cat tempel) memakai React Spring — artinya React Spring adalah kandidat pertama yang naik dari RECOMMENDED. Selama ia belum dipasang, kedua efek itu punya jalur cadangan dengan Motion (lihat tanda bintang di tabel spesifikasi).

### (b) Tabel Spesifikasi Animasi

Tiga belas animasi inti. Semua durasi/easing/pustaka sama persis dengan pratinjau "Animasi ringkas" Wave 2 — tabel ini menambahkan trigger lengkap dan pasangan reduced-motion. Tanda (*) = jalur cadangan Motion jika React Spring belum dipasang.

| Nama animasi | Komponen/halaman | Pustaka | Trigger | Durasi | Easing | Reduced-motion |
|---|---|---|---|---|---|---|
| gerbang-masuk | Gerbang Passcode | Motion | halaman gerbang selesai hidrasi (load) | 400 ms | ease-out | kartu tampil statis tanpa fade/naik |
| gerbang-galat-shake | Gerbang Passcode | Motion | submit passcode salah | 300 ms | ease-in-out | tanpa getar; border input kedip `--stiker-merah` |
| tab-indicator-slide | App Shell | Motion | pengguna pindah tab | 250 ms | ease-in-out | lingkaran stabilo lompat instan ke tab aktif |
| halaman-crossfade | App Shell | Motion | navigasi antarhalaman | 200 ms | ease-out | pergantian konten instan |
| polaroid-tempel-stagger | Galeri Foto | GSAP + ScrollTrigger | kartu masuk viewport saat discroll | 350 ms (stagger 60 ms) | ease-out-back | grid tampil penuh sekaligus, statis |
| lightbox-buka | Galeri Foto | Motion | klik/ketuk sebuah foto | 200 ms | ease-out | fade opacity singkat tanpa scale |
| bubble-chat-pop* | Chat Anonim | React Spring | pesan baru masuk (realtime) | 180 ms | ease-out | bubble muncul langsung tanpa pop |
| typing-dots | Chat Anonim | CSS keyframes / Motion loop | sinyal "sedang mengetik…" diterima | 900 ms (loop infinite) | linear | titik statis, cukup opasitas bergantian pelan |
| catatan-menempel-spring* | Papan Cat Tempel | React Spring | catatan baru ditempel | 250 ms (spring stiffness ≈260) | spring (overshoot kecil) | catatan muncul langsung |
| catatan-lepas* | Papan Cat Tempel | React Spring | catatan dihapus | 150 ms | ease-in | catatan hilang langsung |
| polaroid-kejutan-drop | Tombol "Inget ga sih?" | Motion | modal kejutan dibuka | 300 ms | ease-out-back | polaroid fade-in diam tanpa drop |
| lagi-flip-fade | Tombol "Inget ga sih?" | Motion | tombol "Lagi!" diketuk | 250 ms | ease-in-out | foto tergantikan langsung |
| wiggle-idle | Tombol "Inget ga sih?" | Motion / CSS | idle, berulang tiap ±8 detik | ≈600 ms per goyangan | ease-in-out | mati total — tombol diam menawan |

Dua aturan main yang berlaku untuk SEMUA baris di atas: (1) hanya animasikan `transform` dan `opacity` untuk efek masuk/keluar — bukan `top/left/width/height`; (2) tidak ada animasi tanpa alasan cerita (prinsip #3 Konsep). Detail teknis keduanya ada di pola integrasi di bawah.

### (c) Pola Integrasi Next.js 15 App Router

Next.js 15 merender halaman di server dulu lalu "menghidupkannya" di browser — proses ini namanya **hidrasi** (*hydration*): ibarat halaman tiba sebagai foto cetakan yang sudah rapi (HTML statis), lalu beberapa detik kemudian jadi hidup bisa disentuh (JavaScript menempel). Semua pustaka animasi kita bekerja di browser, jadi mereka hanya boleh hidup di **komponen klien**.

**1. Batas `'use client'` — pagar kecil, bukan pagar besar.** Jangan menjadikan seluruh halaman komponen klien; buat komponen pembungkus animasi sekecil mungkin di ujung rantai, sisanya tetap server component (hemat bundle, SEO aman). Contoh ilustratif (bukan kode final):

```tsx
'use client'
import { motion } from 'motion/react'

export function KartuGerbang({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

**2. Aman-hidrasi.** Animasi hanya berjalan SETELAH hidrasi selesai. Konsekuensi praktisnya: jangan pernah animasikan sesuatu yang menggeser konten penting sebelum halaman interaktif — pengunjung bisa "menembak" tombol yang belum hidup. Karena itu semua efek masuk kita memainkan `transform`/`opacity` (digambar GPU, tidak memicu layout shift), dan konten tetap terbaca walau JavaScript gagal dimuat sama sekali.

**3. Pola Lenis × ScrollTrigger — dua jam, satu konduktor.** Lenis dan ScrollTrigger sama-sama ingin tahu posisi scroll; kalau keduanya berjalan dengan jam masing-masing, gerakan jidat-jedat. Solusinya resmi dan elegan: serahkan satu detak jantung ke `gsap.ticker`, dan biarkan Lenis mengikuti. Ilustratif:

```ts
const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)
```

> **Kenapa begini?**
> Baris demi barisnya: `lenis.on('scroll', ScrollTrigger.update)` memberi tahu ScrollTrigger "posisi berubah!" setiap Lenis menggulir — supaya koreografi scroll sinkron mulus. `gsap.ticker.add(...)` menjadikan GSAP konduktor satu-satunya: requestAnimationFrame milik GSAP yang memutar Lenis (`time * 1000` karena ticker GSAP memakai detik, Lenis memakai milidetik). `gsap.ticker.lagSmoothing(0)` mematikan fitur GSAP yang menunda waktu saat frame drop — bagus untuk animasi biasa, buruk untuk smooth scroll karena malah terasa tersentak. Satu konduktor, semua musisi patuh.

**4. Lazy-load pustaka berat via dynamic import.** Plugin ScrollTrigger hanya dibutuhkan di Galeri — jangan biarkan dia ikut bundle awal semua halaman. Pola ilustratif:

```ts
// HANYA di komponen galeri — tidak pernah di layout global
useEffect(() => {
  if (!gerakDiizinkan) return
  let bersih = () => {}
  ;(async () => {
    const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
    gsap.registerPlugin(ScrollTrigger)
    // ...koreografi polaroid-tempel-stagger...
    bersih = () => { /* kill tween & ScrollTrigger */ }
  })()
  return () => bersih()
}, [])
```

**5. `useReducedMotion` — satu sumber kebenaran.** Semua keputusan reduced-motion di tabel spesifikasi membaca saklar yang SAMA: hook `useReducedMotion` dari Motion, atau media query manual `window.matchMedia('(prefers-reduced-motion: reduce)')` jika bekerja di luar komponen Motion. Jangan pernah membaca media query langsung di lima tempat berbeda — kalau logikanya perlu diubah, ubah di satu tempat. Di dokumen ini hook contoh dinamai `gerakDiizinkan` agar mudah dibaca; saat coding nanti pakai nama konvensi komunitas.

> **Kenapa begini?**
> Kenapa `transform`/`opacity` saja? Karena keduanya digambar oleh lapisan kompositor GPU — browser cukup "menggeser foto jadi", bukan menghitung ulang tata letak seluruh halaman. Menganimasikan properti layout (`width`, `top`, dll.) memaksa browser menghitung ulang semuanya tiap frame — di HP kelas bawah itulah sumber patah-patah. Dan kenapa satu sumber kebenaran untuk reduced-motion? Karena preferensi pengguna adalah janji, bukan hiasan: satu saklar yang dihormati semua animasi jauh lebih dapat dipercaya daripada lima saklar yang salah satunya pasti kelupaan.

### (d) Aturan Verifikasi Versi

Nomor versi pustaka tua lebih cepat daripada susu di lemari — dan dokumen desain sengaja **tidak mencetak nomor versi spesifik** untuk pustaka mana pun (penulisan "Anime.js v4" adalah nama generasi, bukan janji versi patch). Maka berlaku aturan wajib:

Saat implementasi, SEBELUM `npm install` pustaka CORE mana pun (Lenis, GSAP + ScrollTrigger, Motion) maupun pustaka RECOMMENDED, worker WAJIB:

1. Cek versi stabil terkini via context7 atau registry npm.
2. Baca catatan rilis/breaking changes — khususnya kompatibilitas dengan React 19 dan Next.js 15.
3. Pasang, lalu jalankan halaman dengan animasi paling berat (Galeri) di CPU throttling lambat untuk memastikan budget performa tetap terjaga.
4. Catat versi yang TERPASANG (bukan yang terbaru di internet) ke tabel "Catatan Versi Pustaka Terpasang" di bagian Appendix.

Aturan ini menutup celah sederhana: dokumen ini ditulis Agustus 2026, sedangkan `npm install` kamu dieksekusi di hari yang lain — yang menang adalah versi yang kamu verifikasi sendiri, bukan yang diingat siapa pun.

---

## Guardrail Anti-AI-Slop

*Slop* adalah istilah untuk hasil kerja yang terlihat "seperti dibuat mesin dengan resep generik": rapi, wajar, dan benar-benar tidak berkesan. Website kenangan ini justru hidup dari keberkesanan — maka daftar larangan berikut berlaku seperti peraturan posko: sederhana, konkret, tanpa diskusi.

**Checklist larangan (cepat dikenali, cepat ditolak):**

1. **Gradien ungu-biru generik atau latar gelap neon** — SuaraKebadongan punya palet kertas sendiri; latar apa pun berasal dari `--kertas`/`--karton`.
2. **Emoji sebagai pengganti ikon** (🚀 ✨ 🔥 ❤️) — ikon kita SVG gambar tangan stroke `--tinta`, bukan stiker keyboard.
3. **Kartu kembar seragam** — dua kartu berdampingan tanpa variasi rotasi/tape/warna adalah pelanggaran prinsip #1 Konsep.
4. **Animasi kosong ala template** — fade-in seragam di semua elemen tanpa alasan cerita; setiap animasi harus bisa dijelaskan satu kalimat.
5. **Copywriting generik** — "Selamat datang di website kami" bisa dipakai bank, kampus, atau toko sepatu; microcopy kita bernuansa kampung dan spesifik Badongan.
6. **Font identitas default bawaan browser** — identitas teks hanya Shantell Sans/Nunito/Caveat; font sistem boleh jadi fallback teknis, bukan wajah.
7. **Shadow keras hitam pekat** — bayangan kita selalu coklat tinta transparan 2-layer (`rgba(46,33,24,…)`), bukan `box-shadow: 0 0 30px black`.
8. **Spacing di luar grid 4px** — margin 13px/27px misterius adalah tanda halaman disambung tanpa sistem.
9. **Foto di-crop paksa kotak seragam** — rasio asli adalah harga mati Galeri (lihat kotak Kenapa begini? di sana).
10. **Teks kecil penting di atas warna aksen** — kontras rendah melanggar aturan token; kuning/merah/pink untuk dekorasi & teks besar, bukan paragraf.
11. **Badge merah berkedip ala iklan** — produk ini anti-FOMO; tidak ada counter notifikasi, tidak ada urgensi palsu.
12. **Spinner bundar generik saat memuat** — ganti dengan skeleton placeholder sepia yang menyatu dengan dunia kertas.

**Uji cepat: "apakah ini slop?"** — jawab ya/tidak; kalau SATU saja jawabannya "ya", berhenti dan revisi dulu:

1. Apakah elemen ini akan muncul utuh di ribuan template lain tanpa perlu diedit sama sekali?
2. Apakah aku menambahkannya karena "biar kelihatan keren/modern", bukan karena ada cerita yang ingin disampaikan?
3. Apakah teksnya bisa ditempel ke proyek/bisnis mana pun tanpa mengubah satu kata?
4. Apakah dia melanggar aturan token, prinsip Konsep, atau checklist larangan di atas?
5. Apakah pengunjung HP kelas bawah harus membayarnya dengan lag?

> **Kenapa begini?**
> Guardrail ini bukan soal selera, tapi soal IDENTITAS. Template AI generik dirancang supaya tidak menyinggung siapa pun — dan justru karena itulah dia tidak mengingatkan siapa pun pada apa pun. Kenangan KKN Desa Kebadongan layak wadah yang terasa seperti karya teman sekamar, bukan undangan pernikahan digital yang dicetak massal. Setiap butir di atas adalah lubang tempat identitas biasanya bocor keluar; tutup lubangnya, dan yang tersisa adalah desain yang hanya bisa dimiliki satu website ini.

---

## Performa & Aksesibilitas

Keindahan yang berat untuk dibuka sama saja dengan album yang dikunci di lemari. Bagian ini anggaran dan janji teknisnya — target yang terukur, bukan janji kosong.

### Anggaran Performa

- **Budget JavaScript animasi (target):** total ketiga pustaka CORE (Lenis + GSAP + ScrollTrigger + Motion, setelah *tree-shake* dan gzip) ≤ ±60 KB gzip. Ini target kerja, bukan janji mutlak — kalau terbukti mustahil, keputusannya dikurangi fitur, bukan ditambah bundle.
- **Lazy-load sesuai Sistem Motion:** GSAP + ScrollTrigger hanya ikut bundle halaman Galeri via dynamic import; Lenis + Motion saja yang tinggal di shell awal. Halaman Chat dan Notes bahkan bisa hidup nyaman hampir tanpa animasi berat.
- **Optimasi foto Supabase Storage:** foto asli tetap tersimpan utk unduhan, tapi yang dirender di grid adalah varian ringan — konversi WebP (fallback JPG), thumbnail ±640px lebar untuk masonry, `loading="lazy"` + `decoding="async"` di semua gambar di bawah lipatan. Placeholder saat memuat: blok warna `--sepia-gelap` (blur placeholder murah tanpa file tambahan).
- **Ukuran unggah:** batas ukuran/format file tetap mengikuti PRD dengan pesan galat ramah — kompres di sisi klien bila perlu, jangan biarkan foto 8 MB mentah naik ke storage gratis.

> **Kenapa begini?**
> Angka ±60 KB bukan takhayul: itu perkiraan kasar ukuran gabungan tiga pustaka CORE setelah dibersihkan, dan masih di bawah satu foto thumbnail. Prinsipnya sederhana — kode animasi sebaiknya lebih ringan daripada satu kenangan yang dia bawakan. Kalau suatu hari budget ini pecah, yang dikorbankan adalah fitur animasinya, bukan pengunjung dengan kuota terbatasnya.

### Janji Aksesibilitas

- **Kontras WCAG AA di atas tekstur kertas:** tekstur noise `feTurbulence` dipasang sangat halus (opasitas rendah) sehingga rata-rata warnanya ≈ warna dasar; kontras dihitung pada warna dasar. Angka resmi dari Token Visual: `--tinta` di `--kertas` ±14:1, di `--karton` ±12:1, link `--pulpen-biru` ±6:1, bubble tint `--tape-hijau` ±5:1 — semuanya lolos AA (ambang 4.5:1); `--marker-kuning` hanya sebagai latar stabilo (teks `--tinta` di atasnya ±10:1), tidak pernah sebagai warna teks.
- **Target sentuh ≥44×44px:** semua tombol, tab, swatch warna, dan area prev/next lightbox. Jempol manusia tidak presisi seperti kursor.
- **`prefers-reduced-motion` WAJIB dihormati SEMUA animasi** — bukan sebagian. Satu saklar tunggal (hook `useReducedMotion`) membaca preferensi pengguna; perilaku tiap animasi sudah tertulis di kolom reduced-motion Tabel Spesifikasi Sistem Motion (13/13 berpasangan).
- **Navigasi keyboard & pembaca layar:** urutan Tab logikal mengikuti urutan visual; fokus selalu terlihat (outline `--pulpen-biru`); modal/lightbox memakai focus trap + Esc; pesan baru chat diumumkan lewat `aria-live="polite"`; semua gambar punya alt text dari takarirnya; struktur landmark (`nav`, `main`, dialog) dipakai konsisten sehingga pembaca layar bisa melompat antarwilayah seperti orang melompat antarhalaman album.

---

## Appendix: Token Siap Pakai

Bagian ini fotokopi resmi dari Token Visual dalam bentuk siap-tempel — nilainya HARUS identik satu-duanya. Dua format, satu sumber kebenaran: CSS variables adalah rumah aslinya (dipakai di mana saja, termasuk ornamen SVG), sedangkan pemetaan Tailwind hanya jembatan kenyamanan penulisan (`bg-kertas`, `text-tinta`). Karena Tailwind menunjuk ke `var(--…)`, mengubah nilai di satu tempat otomatis mengubah di dua dunia.

```css
:root {
  /* Kelompok Dasar — Kertas & Tinta */
  --kertas: #FFFDF7;
  --karton: #F5EDE0;
  --garis-kertas: #E8DCC8;
  --tinta: #3D2B1F;
  --tinta-lembut: #7A6655;

  /* Aksen — Maroon & Kuning (Hero Colors) */
  --stiker-merah: #6E0521;
  --marker-kuning: #FED92E;
  --tape-hijau: #4A8C5C;
  --pulpen-biru: #2E5090;
  --stiker-pink: #C9879E;
  --spidol-ungu: #6B4E8F;

  /* Sepia & Polaroid */
  --sepia-terang: #C8A165;
  --sepia-gelap: #8A6642;
  --polaroid: #FFFDF7;

  /* Tipografi */
  --font-display: 'Shantell Sans', cursive;
  --font-body: 'Nunito', sans-serif;
  --font-tulis: 'Caveat', cursive;

  /* Skala ukuran */
  --fs-xs: 12px;
  --fs-sm: 14px;
  --fs-base: 16px;
  --fs-md: 20px;
  --fs-lg: 24px;
  --fs-xl: 32px;
  --fs-2xl: 48px;

  /* Bentuk & Bayangan */
  --radius-kecil: 4px;
  --radius-sedang: 8px;
  --radius-besar: 16px;
  --radius-pill: 999px;
  --shadow-kertas: 0 1px 2px rgba(46, 33, 24, .08), 0 6px 16px rgba(46, 33, 24, .12);
  --shadow-tape: 0 1px 3px rgba(46, 33, 24, .10);

  /* Spasi — grid dasar 4px, langkah 4/8/12/16/24/32/48/64 */
  --spasi-dasar: 4px;
}
```

Pemetaan tema Tailwind (cuplikan `theme.extend`; polanya sama untuk 14 warna):

```ts
theme: {
  extend: {
    colors: {
      kertas: 'var(--kertas)',
      karton: 'var(--karton)',
      'garis-kertas': 'var(--garis-kertas)',
      tinta: 'var(--tinta)',
      'tinta-lembut': 'var(--tinta-lembut)',
      'stiker-merah': 'var(--stiker-merah)',
      'marker-kuning': 'var(--marker-kuning)',
      'tape-hijau': 'var(--tape-hijau)',
      'pulpen-biru': 'var(--pulpen-biru)',
      'stiker-pink': 'var(--stiker-pink)',
      'spidol-ungu': 'var(--spidol-ungu)',
      'sepia-terang': 'var(--sepia-terang)',
      'sepia-gelap': 'var(--sepia-gelap)',
      polaroid: 'var(--polaroid)',
    },
    fontFamily: {
      display: 'var(--font-display)',
      body: 'var(--font-body)',
      tulis: 'var(--font-tulis)',
    },
    borderRadius: { kecil: 'var(--radius-kecil)', sedang: 'var(--radius-sedang)', besar: 'var(--radius-besar)', pill: 'var(--radius-pill)' },
    boxShadow: { kertas: 'var(--shadow-kertas)', tape: 'var(--shadow-tape)' },
    fontSize: { xs: 'var(--fs-xs)', sm: 'var(--fs-sm)', base: 'var(--fs-base)', md: 'var(--fs-md)', lg: 'var(--fs-lg)', xl: 'var(--fs-xl)', '2xl': 'var(--fs-2xl)' },
  },
}
```

Catatan kecil: jika suatu saat butuh modifier opasitas Tailwind (mis. `bg-marker-kuning/50`), tulis nilai hex literal di posisi itu — modifier opasitas butuh format warna khusus Tailwind, dan itu pengecualian yang dicatat, bukan kebiasaan baru.

### Catatan Versi Pustaka Terpasang

Sesuai Aturan Verifikasi Versi di Sistem Motion: kolom versi sengaja KOSONG dan hanya diisi dari hasil cek npm/context7 saat implementasi — jangan pernah mengarang isinya.

| Pustaka | Tier | Versi terpasang |
|---|---|---|
| Lenis | CORE | *(diisi saat implementasi)* |
| GSAP | CORE | *(diisi saat implementasi)* |
| ScrollTrigger (plugin GSAP) | CORE | *(diisi saat implementasi)* |
| Motion | CORE | *(diisi saat implementasi)* |
| Anime.js v4 | RECOMMENDED | *(diisi bila naik kapal)* |
| React Spring | RECOMMENDED | *(diisi bila naik kapal)* |

---

## Glosarium

Semua istilah di bawah benar-benar dipakai di dokumen ini. Analoginya awam; maknanya tetap jujur secara teknis.

| Istilah | Analogi awam | Makna teknis singkat |
|---|---|---|
| **Token** | Bahan dapur yang sudah dilabeli — "gula", "garam" — jadi semua masakan konsisten | Nilai desain bernama (warna, ukuran, radius) yang menjadi satu-satunya sumber kebenaran UI |
| **Tier** | Level keanggotaan kelas: wajib, cadangan, tidak diikutkan | Tingkatan keputusan adopsi pustaka: CORE / RECOMMENDED / SKIP |
| **Easing** | Ritme gerakan: bola menggelinding menuruni tangga vs bidang miring — ada yang mendadak, ada yang meluncur | Kurva percepatan-lambat animasi (mis. ease-out: cepat di awal, melunak di akhir) |
| **Spring** | Gerakan seperti karet gelang atau pegas: overshoot sedikit lalu menetap | Animasi berbasis fisika pegas (massa/k stiffness/damping), alami untuk gesture |
| **Stagger** | Barisan anak-anak melompat satu-per-satu, bukan serentak | Delay berurutan antarelemen dalam satu grup animasi |
| **ScrollTrigger** | Sulap yang memicu trik tepat saat kartu sampai di garis tertentu layar | Plugin GSAP yang menjalankan animasi berdasarkan posisi scroll viewport |
| **Hidrasi (hydration)** | Halaman tiba sebagai foto cetakan, lalu beberapa saat kemudian "hidup" dan bisa disentuh | Proses JavaScript browser menempelkan interaktivitas ke HTML hasil render server |
| **'use client'** | Stiker "area ini boleh disentuh" yang menandai bagian hidup dari halaman | Direktif Next.js App Router menandai komponen yang dirender/dihidrasi di browser |
| **Dynamic import / lazy-load** | Memanggil ojek saat benar-benar butuh, bukan menyewa armada sejak pagi | Memuat potongan JavaScript hanya ketika dibutuhkan, memperkecil bundle awal |
| **Masonry** | Susunan batu bata tukang bebas — tinggi tak seragam tapi rapat tanpa celah janggal | Tata letak kolom dengan tinggi item bervariasi yang menyusun ulang mengisi ruang |
| **Lightbox** | Ruangan gelap kecil tempat satu foto dipamerkan besar-besaran | Overlay/modal untuk melihat satu media secara fokus, biasanya dengan navigasi prev/next |
| **Reduced-motion** | Mode "jangan bikin pusing" bagi yang mudah mabok gerakan | Preferensi sistem `prefers-reduced-motion: reduce` yang wajib mengurangi/mematikan animasi |
| **aria-live** | Megafon otomatis yang membacakan kabar baru untuk yang tidak melihat layar | Atribut ARIA agar pembaca layar mengumumkan konten yang berubah secara dinamis |
| **Focus trap** | Pagar turnamen: sekali masuk arena, Tab berputar di dalam sampai pintu dibuka | Membatasi navigasi keyboard di dalam modal agar fokus tidak kabur ke latar belakang |
| **WCAG** | Buku resep aksesibilitas dunia — standar masak yang aman untuk semua lidah | Web Content Accessibility Guidelines; AA = ambang kontras & kriteria minimum umum |
| **Microcopy** | Resepsionis mini: kata-kata kecil di tombol, petunjuk, dan pesan galat | Teks pendek antarmuka yang menuntun pengguna pada momen mikro |

---

## Kontrak Kolaborasi Belajar

Dokumen ini tidak hanya mendeskripsikan website — dia juga mendeskripsikan CARA KITA BEKERJA membangunnya, supaya keputusan-keputusan di atas bertahan melewati hari-hari sibuk, melewati teman baru, dan melewati bantuan AI yang rajin tapi kadang sok tahu.

**1. Komentar kode: Bahasa Indonesia, menjelaskan MENGAPA.**
Nama variabel, fungsi, dan komponen tetap Inggris baku (`handleSubmit`, `PhotoCard`) supaya ekosistem dan dokumentasi dunia luar tetap terbaca. Tapi komentar menjawab pertanyaan "kenapa begini?" — persis seperti kotak Kenapa begini? di dokumen ini — bukan menerjemahkan baris kode yang sudah terbaca sendiri:

```ts
// Lenis sengaja mengikuti ticker GSAP supaya smooth-scroll dan
// animasi scroll bergerak dengan SATU detak jantung (lihat:
// Sistem Motion → Pola Lenis x ScrollTrigger). Tanpa ini, keduanya
// memakai jam berbeda dan gerakan jadi jidat-jedat.
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

**2. Pesan commit naratif: apa · kenapa · bagaimana.**

```text
docs(design): tambah sistem motion bertingkat 7 pustaka

Kenapa: pratinjau animasi tersebar di tiap halaman perlu satu
rumah bersama, agar pustaka tidak numpuk seenaknya di bundle
HP pengunjung.

Bagaimana: tier tujuh pustaka (CORE hanya 3), 13 spesifikasi
animasi berpasangan reduced-motion, pola integrasi Next.js
App Router, dan aturan verifikasi versi pra-install.
```

Baris pertama = apa (satu kalimat, gaya imperatif); badan pesan = kenapa penting lalu bagaimana mewujudkannya. Contoh nyata di proyek ini adalah perluasan dari pesan `docs(design): sistem motion bertingkat 7 pustaka`.

**3. Tiga pertanyaan sakti saat review kode.** Kalau salah satunya sulit dijawab, kodenya belum selesai:

1. *"Kalau aku membaca ini besok, apakah aku masih paham kenapa ini ditulis begini?"*
2. *"Adakah cara yang lebih sederhana yang tetap jujur pada desain?"*
3. *"Kalau jumlah foto/pengunjung berlipat sepuluh, bagian mana yang patah duluan?"*

**Janji cara bertanya ke AI helper:** tempelkan potongan kode + kutipan aturan dokumen ini yang relevan (jangan harap ia menghafal); minta PENJELASAN langkah sebelum minta kode; jangan pernah menerima kode hitam-putih yang tidak bisa dijelaskan balik dengan bahasa sendiri — lalu uji hasilnya dengan tiga pertanyaan sakti di atas.

> **Kenapa begini?**
> Mengapa aturan belajar masuk ke dokumen DESAIN? Karena pemilik proyek ini sedang belajar desain web, dan cara tercepat belajar adalah membuat standar menjadi kebiasaan sehari-hari: komentar yang menjelaskan, commit yang bercerita, review yang bertanya. Dokumen yang indah tapi tidak mengubah kebiasaan sehari-hari hanya akan jadi pajangan; kontrak ini memastikan setiap baris kode yang lahir setelahnya adalah latihan yang juga menghargai dokumennya. Dan janji bertanya-ke-AI menjaga supaya alat bantu tetap guru pengganti, bukan mesin penjawab yang mencuri kesempatan belajarmu.

---

## Peta Dokumen

Dokumen ini kini lengkap — sepuluh bagian yang saling menopang, dibaca berurutan seperti menempel halaman album satu per satu:

1. **Cara membaca dokumen ini** — konvensi kotak "**Kenapa begini?**" dan janji nada mengajarnya.
2. **Konsep** — jiwa scrapbook kenangan analog, moodboard verbal, lima prinsip anti-template.
3. **Token Visual** — palet warna, tipografi tiga peran, skala ukuran, tekstur & ornamen, radius/shadow/spasi, ikonografi.
4. **Desain per Halaman & Komponen** — enam permukaan utama (Gerbang, App Shell, Galeri, Chat, Cat Tempel, Inget ga sih?) dalam format seragam delapan blok.
5. **Sistem Motion** — tier tujuh pustaka (CORE hanya tiga), 13 spesifikasi animasi berpasangan reduced-motion, pola integrasi Next.js, aturan verifikasi versi.
6. **Guardrail Anti-AI-Slop** — dua belas larangan konkret + uji cepat lima pertanyaan.
7. **Performa & Aksesibilitas** — anggaran JS animasi, optimasi foto, janji kontras, sentuh, dan gerak.
8. **Appendix: Token Siap Pakai** — CSS variables, tema Tailwind, catatan versi terpasang.
9. **Glosarium** — enam belas istilah dengan analogi awam.
10. **Kontrak Kolaborasi Belajar** — cara kami berkomentar, commit, review, dan bertanya.

Selamat membangun kenangannya — satu tempelan, satu cerita, satu detak jantung. *SuaraKebadongan.*
