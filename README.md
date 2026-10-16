# Potter Explorer — Archival Compendium

Sebuah web eksplorasi dunia Harry Potter berbasis data resmi **PotterAPI** (fedeperin) dengan tema desain **Dark Victorian Gothic Editorial**.

---

## 1. Menjalankan Proyek

### Prasyarat
- Node.js versi 18 ke atas
- npm (atau package manager serupa)

### Instalasi & Menjalankan Mode Development
```bash
# Pasang dependensi
npm install

# Jalankan server development (Turbopack)
npm run dev
```
Buka browser pada [http://localhost:3000](http://localhost:3000).

### Memverifikasi Kualitas & Produksi (Build, Typecheck, Lint)
```bash
# Validasi tipe TypeScript (strict mode)
npx tsc --noEmit

# Validasi linter ESLint
npm run lint

# Kompilasi build produksi Next.js
npm run build
```

---

## 2. Fitur Utama & Kepatuhan Tugas

1. **4 Resource Lengkap dari PotterAPI**:
   - `characters`: Arsip penyihir, aktor pemeran, asrama, dan tanggal lahir.
   - `spells`: Gulungan perkamen mantra dan efek sihir.
   - `houses`: 4 panji asrama Hogwarts (lambang emoji, pendiri, hewan lambang, warna).
   - `books`: Sampul vertikal jilid buku, tanggal rilis, dan jumlah halaman.
2. **Filter Bertingkat (3 Level Cascading)**:
   - Characters: Asrama &rarr; Aktor (menyempit sesuai asrama terpilih) &rarr; Punya anak / tidak.
   - Books: Tahun rilis &rarr; Rentang jumlah halaman.
   - Houses: Hewan lambang &rarr; Warna asrama (menyempit sesuai hewan).
   - Spells: Huruf awalan mantra &rarr; Kata kunci pada kegunaan.
3. **Pencarian Terdebounce & Pengurutan**:
   - Input pencarian didebounce 350ms.
   - Sort menggunakan `localeCompare` adaptif bahasa aktif (A–Z, Z–A, tanggal lahir, nomor buku, jumlah halaman).
4. **Vault / Favorit di LocalStorage**:
   - Wajib memasukkan nama scholar sebelum menyimpan favorit (validasi 1–24 karakter).
   - Batas maksimal 4 slot relikui (`MAX_FAVORITES = 4`).
   - Dialog konfirmasi saat melepas relikui atau mengosongkan brankas.
   - Bebas hydration mismatch (hanya diakses dalam `useEffect`).
5. **Pengaturan Bahasa Adaptif (9 Bahasa)**:
   - Mendukung `en`, `es`, `fr`, `it`, `pt`, `uk`, `ja`, `zh`, `ko`.
   - Data API asli tersedia untuk 6 bahasa (`en, es, fr, it, pt, uk`). Untuk `ja, zh, ko`, data dipetakan ke `en` dan banner `LangNotice` memberi tahu pengguna secara transparan.
   - Seluruh teks UI terstruktur rapi pada `i18n/locales` dan dijamin oleh tipe `TranslationKeys`.

---

## 3. Alasan & Keputusan Desain

- **Gothic Victorian Editorial Theme**:
  Menggunakan palet obsidian canvas (`#0A0B0D`), perkamen (`#ECE6DC`), tinta (`#1A1A1A`), aksen emas tipis (`#C5A059`), dan merah tua crimson (`#8B2222`). Menghindari tren "AI Slop" (tanpa gradien ungu-biru generik, tanpa border-radius bulat berlebihan, tanpa glassmorphism tebal).
- **Tipografi Sejarah**:
  - Judul: `Cinzel` (`next/font/google`).
  - Teks Isi: `EB Garamond` (`next/font/google`).
  - Label & Kode: `JetBrains Mono`.
- **Kartu Khusus per Jenis Resource**:
  - Buku: Format sampul vertikal rasio 2:3.
  - Karakter: Potret rasio 3:4 dengan bingkai gotik dan pill warna asrama.
  - Asrama: Panji vertikal tinggi berwarna lambang asrama.
  - Mantra: Kartu bergaya gulungan perkamen dengan sudut ornamen runik.
- **Partikel Bintang CSS Murni**:
  Efek kerlipan bintang di latar belakang diimplementasikan 100% menggunakan CSS murni (box-shadow multipoint dan animasi CSS) untuk performa optimal tanpa menambah beban library pihak ketiga.
- **Integritas Data API**:
  Tidak mengarang field fiktif yang tidak disediakan oleh PotterAPI (seperti patronus, tongkat, atau trailer).

---

## 4. Struktur Arsitektur Modular

```
app/            # App Router: layout, home, characters (+ [id]), spells, houses, books, settings
components/
  ├── cards/    # BookCard, CharacterCard, HouseCard, SpellCard
  ├── controls/ # SearchBar, CascadingFilters, SortSelect, Pagination
  ├── layout/   # Navbar, LanguageSwitcher, UserNameInput, Footer, StarsBackground
  └── ui/       # Skeleton, ErrorState, EmptyState
context/        # AppContext (Language, User Scholar Name, Favorites Store)
hooks/          # usePotterData, useFavorites, useDebounce, useTranslation
lib/            # api, endpoints, filters, sorters, storage, validators, constants
types/          # api, app, i18n
i18n/           # index.ts + locales (en, es, fr, it, pt, uk, ja, zh, ko)
public/         # fallback-avatar.svg, fallback-cover.svg
```
