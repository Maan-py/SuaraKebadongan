const gelaran = ['Bu', 'Mas', 'Mbak', 'Mbah', 'Bang', 'Nduk']
const nama = ['Marni', 'Tugimin', 'Rejo', 'Sarinem', 'Slamet', 'Warti']
const identitas = [
  'Penjual Tempe',
  'Tukang Sepeda Ontel',
  'Warga RT 03',
  'Pemilik Warung',
  'Penjaga Sawah',
  'Juragan Bebek',
]

export function generateAlias(): string {
  const g = gelaran[Math.floor(Math.random() * gelaran.length)]
  const n = nama[Math.floor(Math.random() * nama.length)]
  const i = identitas[Math.floor(Math.random() * identitas.length)]
  return `${g} ${n} ${i}`
}

const warnaAvatar = [
  '#6E0521', // stiker-merah (maroon IG)
  '#FED92E', // marker-kuning (kuning IG)
  '#57A773', // tape-hijau
  '#1E56C8', // pulpen-biru
  '#EF8FB2', // stiker-pink
  '#7B5EA7', // spidol-ungu
]

export function getRandomWarna(): string {
  return warnaAvatar[Math.floor(Math.random() * warnaAvatar.length)]
}
