const kataBenda = [
  'Kopi', 'Teh', 'Jalan', 'Hujan', 'Angin', 'Kucing', 'Buku', 'Pukul',
  'Lampu', 'Surat', 'Awan', 'Senja', 'Ombak', 'Matahari', 'Embun', 'Bintang',
  'Bunga', 'Daun', 'Roti', 'Kertas', 'Melodi', 'Langkah', 'Rindu', 'Jejak',
  'Suara', 'Pena', 'Cermin', 'Sepeda', 'Sudut', 'Kaktus', 'Cokelat', 'Karton',
  'Kipas', 'Pintu', 'Waktu', 'Bantal', 'Jendela'
]

const kataSifatSuasana = [
  'Dingin', 'Manis', 'Sore', 'Malam', 'Ribut', 'Tidur', 'Tua', 'Dua',
  'Hangat', 'Sendu', 'Kelabu', 'Teduh', 'Bisu', 'Tenang', 'Jauh', 'Kecil',
  'Rahasia', 'Sebentar', 'Terang', 'Singgah', 'Awal', 'Panjang', 'Pagi',
  'Kuning', 'Tepi', 'Lama', 'Pekat', 'Syahdu', 'Sunyi', 'Pahit', 'Lembut',
  'Indah', 'Asri', 'Merah', 'Penuh', 'Tipis'
]

export function generateAlias(): string {
  const benda = kataBenda[Math.floor(Math.random() * kataBenda.length)]
  const sifat = kataSifatSuasana[Math.floor(Math.random() * kataSifatSuasana.length)]
  return `${benda} ${sifat}`
}

const warnaAvatar = [
  '#6E0521', // stiker-merah (maroon IG)
  '#FED92E', // marker-kuning (kuning IG)
  '#4A8C5C', // tape-hijau
  '#2E5090', // pulpen-biru
  '#C9879E', // stiker-pink
  '#6B4E8F', // spidol-ungu
]

export function getRandomWarna(): string {
  return warnaAvatar[Math.floor(Math.random() * warnaAvatar.length)]
}
