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
  '#4A8C5C', // tape-hijau
  '#2E5090', // pulpen-biru
  '#C9879E', // stiker-pink
  '#6B4E8F', // spidol-ungu
]

export function getRandomWarna(): string {
  return warnaAvatar[Math.floor(Math.random() * warnaAvatar.length)]
}
