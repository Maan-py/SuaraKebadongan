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
  '#D96B85', // maroon-300 — terang agar terlihat di kanvas gelap
  '#FED92E', // marker-kuning (kuning IG)
  '#7FBF95', // tape-hijau terang
  '#8FB3E8', // pulpen-biru langit
  '#DFA3B4', // stiker-pink terang
  '#9B7FC4', // spidol-ungu lembut
]

export function getRandomWarna(): string {
  return warnaAvatar[Math.floor(Math.random() * warnaAvatar.length)]
}
