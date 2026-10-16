# Checklist Tugas Peningkatan & Koreografi Animasi: Potter Explorer (Hogwarts Archival System)

Dokumen ini berisi rincian penugasan (*actionable task list*) terstruktur untuk peningkatan visual, arsitektur rendering, serta koreografi animasi imersif menggunakan kombinasi **GSAP**, **Framer Motion**, dan **Manipulasi Vektor SVG**. Seluruh tugas berfokus pada alur gerak, pembagian peran pustaka animasi, dan kriteria keberhasilan tanpa menyertakan blok kode.

---

## Ringkasan Alur Pengerjaan

| Fase | Area Fokus | Teknologi / Pendekatan | Tingkat Urgensi |
| :--- | :--- | :--- | :--- |
| **Fase 1** | Pembersihan Aset & Standardisasi Visual Token | SVG & Design Tokens | Tinggi (P1) |
| **Fase 2** | Arsitektur Rendering & UX State (*Suspense*) | Next.js Streaming & Skeleton | Kritis (P0) |
| **Fase 3** | Tipografi Editorial & Tata Letak Naskah | Modular Scale & Print Layout | Tinggi (P1) |
| **Fase 4** | Koreografi GSAP & Animasi Garis Vektor SVG | GSAP Timeline, ScrollTrigger & SVG Stroke | Tinggi (P1) |
| **Fase 5** | Interaksi Fisika, Layout & Kursor Sihir | Framer Motion Spring & Shared Layout | Tinggi (P1) |
| **Fase 6** | Performa Render (60fps) & Aksesibilitas Motion | Hardware Acceleration & Reduced Motion | Menengah (P2) |

---

## Pembagian Peran Mesin Animasi (Arsitektur Motion)

Agar **GSAP** dan **Framer Motion** tidak saling bertabrakan pada elemen DOM yang sama, pembagian tugasnya ditetapkan sebagai berikut:
1. **GSAP (GreenSock):** Menangani urutan sekuensial kompleks (*timeline*), animasi berbasis guliran layar (*scroll-driven*), pemecahan karakter/kata pada teks judul, serta pengikatan jalur garis SVG (*stroke-dashoffset*).
2. **Framer Motion:** Menangani interaksi berbasis keadaan komponen React (*state-driven*), fisika pegas (*spring physics*) saat disentuh kursor, perpindahan penanda menu aktif, dan transisi tata letak saat memfilter data.
3. **SVG Interaktif:** Bertindak sebagai medium visual untuk efek gambar garis tinta emas otomatis, segel sihir berputar, dan partikel cahaya.

---

## FASE 1: Pembersihan Aset & Standardisasi Visual Token

### Task 1.1: Penggantian Emoji Logo dengan Aset Vektor (SVG) Siap Animasi
* **Konteks Masalah:** Karakter emoji petir pada navbar dirender berbeda di tiap sistem operasi dan tidak bisa dianimasikan garis maupun pendaran cahayanya.
* **Langkah Tindakan:**
  1. Hapus karakter emoji dari elemen logo navbar.
  2. Pasang ikon vektor SVG kustom (lambang petir bersudut tajam atau segel Hogwarts) dengan jalur garis (*path*) yang terpisah antara garis luar dan isi.
  3. Terapkan warna aksen emas tembaga (*Golden Apricot*) pada jalur vektor.
* **Kriteria Keberhasilan:**
  * Logo tampil seragam di seluruh sistem operasi dan memiliki jalur vektor yang siap dianimasikan saat halaman dimuat maupun saat disorot kursor.

### Task 1.2: Penataan Token Palet Warna "Warm Earthy" & Pendaran Cahaya
* **Langkah Tindakan:**
  1. Petakan latar belakang utama ke ungu malam sangat gelap (*Midnight Violet*).
  2. Tetapkan warna perkamen gading terang (*Beige*) khusus untuk permukaan modul koran cetak.
  3. Tetapkan warna emas tembaga (*Golden Apricot*) untuk elemen interaktif, partikel cahaya, dan garis SVG aktif.
  4. Tetapkan warna kayu zaitun (*Olive Wood*) untuk bingkai kartu statis dan garis pemisah.
* **Kriteria Keberhasilan:**
  * Kontras antara elemen statis dan elemen yang menyala akibat animasi terlihat tegas dan menyatu dengan nuansa perpustakaan kuno.

### Task 1.3: Standardisasi Sudut Komponen & Bingkai Ornamen SVG
* **Langkah Tindakan:**
  1. Ubah sudut kartu menjadi tegas (2px hingga 4px) menyerupai kartu katalog fisik.
  2. Siapkan ornamen sudut SVG tipis di keempat penjuru kartu utama yang nantinya akan bereaksi saat kursor mendekat.
* **Kriteria Keberhasilan:**
  * Kartu tampak seperti artefak naskah cetak, bukan komponen aplikasi modern generik.

---

## FASE 2: Arsitektur Rendering & UX State

### Task 2.1: Dekomposisi Fetching Data ke Tingkat Bagian (Streaming Suspense)
* **Langkah Tindakan:**
  1. Pisahkan pemanggilan data API per bagian (buku teks, tokoh, dan mantra).
  2. Pastikan navigasi, spanduk utama, dan artikel koran *The Daily Prophet* langsung tampil sejak detik pertama.
* **Kriteria Keberhasilan:**
  * Animasi pembuka di bagian Hero dapat langsung berjalan mulus tanpa harus menunggu respon API eksternal selesai.

### Task 2.2: Kerangka Pemuatan Bertema "Sapuan Tinta Emas" (Shimmer Skeleton)
* **Langkah Tindakan:**
  1. Buat kerangka kartu pengganti (*skeleton*) dengan ukuran identik kartu asli.
  2. Tambahkan animasi sapuan kilau emas miring yang bergerak perlahan beserta ikon segel SVG yang berdenyut halus.
* **Kriteria Keberhasilan:**
  * Tidak terjadi loncatan tata letak (*layout shift*) ketika data API masuk dan memulai animasi kemunculannya.

---

## FASE 3: Tipografi Editorial & Tata Letak Naskah

### Task 3.1: Kalibrasi Peran Pasangan Tipografi
* **Langkah Tindakan:**
  1. Gunakan font serif klasik berkarakter kuat untuk judul utama dan kepala berita.
  2. Gunakan font sans-serif bersih untuk paragraf penjelasan.
  3. Gunakan font monospace untuk label kategori arsip dan angka tahun.
* **Kriteria Keberhasilan:**
  * Teks judul memiliki ketebalan dan anatomi huruf yang ideal saat dipecah menjadi animasi per kata atau per karakter.

### Task 3.2: Redesain Modul "The Daily Prophet" Bergaya Lembar Koran Cetak
* **Langkah Tindakan:**
  1. Terapkan latar perkamen terang, garis ganda pada kepala surat kabar, dan huruf awal besar (*Drop Cap*) pada paragraf pembuka.
* **Kriteria Keberhasilan:**
  * Modul koran memiliki struktur kolom cetak klasik yang kontras dengan kanvas gelap di sekelilingnya.

---

## FASE 4: Koreografi GSAP & Animasi Garis Vektor SVG (Scene & Scroll)

### Task 4.1: Sekuens Pembuka Hero ("The Grand Hall Awakening") dengan GSAP Timeline
* **Konteks Masalah:** Tampilan bagian atas (*Hero Section*) muncul secara statis tanpa dramatisasi pembuka.
* **Langkah Tindakan:**
  1. Rancang satu urutan waktu (*Master Timeline* GSAP) yang berjalan otomatis saat halaman selesai dimuat:
     * **Detik 0.0 - 0.5 (Garis Segel Menggambar Diri):** Ornamen garis SVG di sekitar kartu *"Collegium Hogwarts 1997"* dan garis samping label kategori menggambar dirinya sendiri dari titik tengah ke ujung seperti goresan pena bulu.
     * **Detik 0.3 - 0.9 (Judul Terbuka dari Balik Masker):** Teks judul utama *"Potter Explorer"* dipecah per kata, lalu naik dari balik pembatas tak terlihat dengan sedikit efek pendaran emas yang perlahan memudar menjadi warna krem solid.
     * **Detik 0.7 - 1.2 (Paragraf & Tombol Muncul):** Subjudul dan tombol aksi utama muncul berurutan dengan gerakan melambat yang sangat halus di akhir.
* **Kriteria Keberhasilan:**
  * Seluruh sekuens pembuka selesai dalam waktu kurang dari 1,3 detik sehingga terasa megah namun tidak menghambat pengguna yang ingin langsung menjelajah.

### Task 4.2: Efek Menggambar Bingkai Kartu Otomatis Saat Scroll (GSAP ScrollTrigger + SVG)
* **Konteks Masalah:** Ketika pengguna menggulir ke bawah menuju bagian *Archives of Magic* atau *The Daily Prophet*, bagian tersebut hanya muncul biasa.
* **Langkah Tindakan:**
  1. Pasang garis pembatas dekoratif berbasis SVG di sepanjang tepi atas setiap bagian dan di sekeliling kartu koran *The Daily Prophet*.
  2. Gunakan pemicu guliran layar (*ScrollTrigger*) agar garis SVG tersebut tampak sedang digambar mengikuti kecepatan guliran pengguna (*scrubbing*) atau langsung terlukis saat bagian tersebut masuk ke area pandang layar.
  3. Padukan dengan kemunculan huruf *Drop Cap* di koran yang seolah-olah dicap ke atas kertas perkamen.
* **Kriteria Keberhasilan:**
  * Pengguna merasakan sensasi halaman buku arsip yang baru ditulis oleh tinta sihir tepat saat mereka menggulir layar ke bawah.

### Task 4.3: Efek Parallax Berlapis & Partikel Debu Emas Mengambang (SVG Ambient)
* **Konteks Masalah:** Latar belakang ungu gelap di area Hero dan sela-sela bagian terasa kosong dan mati.
* **Langkah Tindakan:**
  1. Buat lapisan latar berisi titik-titik cahaya dan bintang empat sudut berukuran mikro berbasis SVG di sekitar kartu *"Collegium Hogwarts 1997"*.
  2. Gerakkan masing-masing partikel secara independen menggunakan gelombang sinus GSAP (mengambang naik-turun perlahan dan berkedip lembut dengan jeda acak).
  3. Terapkan perbedaan kecepatan gerak vertikal (*parallax*) saat layar digulir: kartu bergerak normal, sedangkan partikel debu emas di belakangnya bergerak lebih lambat.
* **Kriteria Keberhasilan:**
  * Tercipta kedalaman ruang 3 dimensi (*depth*) antara latar belakang, partikel cahaya, dan kartu informasi utama tanpa menurunkan kelancaran guliran layar.

---

## FASE 5: Interaksi Fisika, Layout & Kursor Sihir (Framer Motion + SVG)

### Task 5.1: Jejak Cahaya Ujung Tongkat Sihir & Tombol Magnetik (Framer Motion Spring)
* **Konteks Masalah:** Gerakan kursor di atas area Hero dan tombol utama (*Explore Archives*) masih terasa kaku seperti web biasa.
* **Langkah Tindakan:**
  1. Buat cincin cahaya kecil berbasis SVG yang mengikuti posisi kursor pengguna menggunakan perhitungan pegas (*spring physics*) dari Framer Motion sehingga gerakannya terasa kenyal dan memiliki sedikit jeda alami.
  2. Terapkan efek **Tombol Magnetik** pada tombol utama *Explore Archives* dan *View Full Spellbook*: ketika kursor mendekat dalam radius tertentu, badan tombol sedikit tertarik mendekati kursor disertai pendaran partikel emas di sudutnya, lalu memantul kembali ke posisi semula saat kursor menjauh.
* **Kriteria Keberhasilan:**
  * Menggerakkan mouse di sekitar tombol utama memberikan umpan balik taktil yang sangat memuaskan dan responsif.

### Task 5.2: Kartu Mantra 3D Tilt & Lukisan Garis Sihir (Framer Motion + SVG Path)
* **Konteks Masalah:** Kartu di bagian *Incantation Discovery* dan daftar karakter hanya memiliki efek angkat vertikal sederhana.
* **Langkah Tindakan:**
  1. Gunakan pendeteksi posisi kursor di atas permukaan kartu untuk memiringkan kartu secara halus dalam ruang 3D (*3D Perspective Tilt* maksimal 6 hingga 8 derajat) menghadap ke arah datangnya kursor.
  2. Tambahkan lapisan kilau cahaya (*glare spotlight*) yang bergeser mengikuti posisi kursor di atas permukaan kartu.
  3. Saat kursor berada di atas kartu mantra, picu animasi ikon SVG pola gerakan tongkat sihir (*wand movement diagram*) yang menggambar ulang jalurnya secara berkesinambungan.
* **Kriteria Keberhasilan:**
  * Setiap kartu terasa seperti kartu koleksi fisik berhologram emas yang bereaksi langsung terhadap sudut pandang kursor pengguna.

### Task 5.3: Indikator Menu "Cahaya Mengalir" & Transisi Filter Kartu (Shared Layout)
* **Konteks Masalah:** Perpindahan menu aktif di navbar (`Grand Hall`, `Characters`, `Spells`, `Houses`) dan penyaringan daftar karakter/asrama masih berpindah secara patah-patah.
* **Langkah Tindakan:**
  1. Gunakan fitur berbagi identitas tata letak (*shared layout animation*) dari Framer Motion pada garis bawah emas dan pendaran cahaya di navbar. Saat pengguna mengklik atau menyorot menu lain, garis cahaya tersebut meluncur mulus menyeberang dari menu lama ke menu baru.
  2. Terapkan animasi tata letak otomatis pada grid kartu: ketika data selesai dimuat atau ketika pengguna memfilter karakter berdasarkan asrama (*Gryffindor*, *Slytherin*, dll.), kartu-kartu yang tersisa bergeser merapatkan barisan secara mulus, bukan menghilang dan muncul tiba-tiba.
* **Kriteria Keberhasilan:**
  * Tidak ada perpindahan elemen antarmuka yang terasa kasar; seluruh perubahan posisi komponen mengalir seperti benda fisik.

### Task 5.4: Efek Ilustrasi Hidup pada "The Daily Prophet" (Cinemagraph Motion)
* **Konteks Masalah:** Koran *The Daily Prophet* di dunia sihir identik dengan foto dan elemen cetakan yang bergerak hidup, namun di web masih diam.
* **Langkah Tindakan:**
  1. Tambahkan ilustrasi atau lambang keempat asrama Hogwarts di dalam modul *The Daily Prophet* yang dibingkai dengan ornamen lingkaran SVG.
  2. Berikan animasi siklus lambat tanpa henti (*infinite subtle loop*): cincin ornamen luar berputar sangat pelan, sementara gambar di dalamnya bergerak mengayun halus dengan efek sapuan cahaya kertas tua.
  3. Saat pengguna mengarahkan kursor ke tautan *Four Houses* atau *Alumni Records* di dalam koran, munculkan animasi panah SVG yang melesat keluar dari teks.
* **Kriteria Keberhasilan:**
  * Bagian koran benar-benar terasa seperti cetakan koran sihir yang hidup tanpa mengganggu keterbacaan teks artikel utamanya.

---

## FASE 6: Performa Render (60fps) & Validasi Aksesibilitas Motion

### Task 6.1: Isolasi Properti Komposit & Pembersihan Memori Animasi
* **Konteks Masalah:** Menggabungkan GSAP, Framer Motion, dan partikel SVG berisiko membuat kipas perangkat berbunyi keras atau layar tersendat (*frame drop*) jika tidak dikelola dengan benar.
* **Langkah Tindakan:**
  1. Batasi seluruh animasi agar hanya mengubah properti posisi (*transform*) dan ketajaman/transparansi (*opacity*), hindari menganimasikan lebar, tinggi, atau margin secara langsung.
  2. Hentikan otomatis animasi partikel SVG dan putaran segel ketika bagian tersebut sedang berada di luar layar pandang pengguna (*off-screen*).
  3. Pastikan seluruh pemicu guliran GSAP dibersihkan dari memori ketika pengguna berpindah halaman di Next.js.
* **Kriteria Keberhasilan:**
  * Kecepatan bingkai (*frame rate*) stabil di angka 60fps saat halaman digulir cepat dari atas ke bawah.

### Task 6.2: Penyesuaian Mode Ramah Pengguna & Layar Sentuh
* **Langkah Tindakan:**
  1. Matikan jejak kursor tongkat sihir dan efek miring 3D (*3D Tilt*) secara otomatis pada perangkat layar sentuh (HP dan Tablet) agar tidak mengganggu guliran jari.
  2. Sediakan dukungan penuh bagi pengguna yang mengaktifkan fitur pengurangan gerak (*prefers-reduced-motion*) atau tambahkan tombol sakelar **"Kurangi Efek Sihir (Mode Tenang)"** di halaman `/settings` untuk mengganti seluruh animasi gerak menjadi transisi pudar sederhana.
* **Kriteria Keberhasilan:**
  * Pengalaman di perangkat seluler tetap ringan dan responsif, serta pengguna memiliki kendali penuh atas intensitas animasi di layar mereka.