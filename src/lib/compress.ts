const MAX_SIDE = 2000
const WEBP_QUALITY = 0.85
const JPEG_QUALITY = 0.85
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']
const MAX_SIZE_PRE_COMPRESS = 10 * 1024 * 1024

export interface CompressedFile {
  blob: Blob
  width: number
  height: number
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function drawToCanvas(img: HTMLImageElement) {
  let w = img.naturalWidth
  let h = img.naturalHeight

  if (w > MAX_SIDE || h > MAX_SIDE) {
    const ratio = Math.min(MAX_SIDE / w, MAX_SIDE / h)
    w = Math.round(w * ratio)
    h = Math.round(h * ratio)
  }

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, w, h)

  return { canvas, width: w, height: h }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}

export async function compressImage(file: File): Promise<CompressedFile> {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const { canvas, width, height } = drawToCanvas(img)

    const webpBlob = await toBlob(canvas, 'image/webp', WEBP_QUALITY)
    if (webpBlob) return { blob: webpBlob, width, height }

    const jpegBlob = await toBlob(canvas, 'image/jpeg', JPEG_QUALITY)
    if (jpegBlob) return { blob: jpegBlob, width, height }

    throw new Error('Gagal kompresi gambar')
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Waduh, format ini belum bisa ditempel di album. Coba JPG atau PNG ya.'
  }
  if (file.size > MAX_SIZE_PRE_COMPRESS) {
    return 'Fotonya kebesaran nih. Coba yang kurang dari 10MB ya.'
  }
  return null
}
