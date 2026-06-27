import { promises as fs } from 'fs'
import path from 'path'
import { randomBytes } from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
])

const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_VIDEO_BYTES = 100 * 1024 * 1024

export type UploadKind = 'image' | 'video'

function sanitizeBaseName(name: string): string {
  return name
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
    .toLowerCase()
}

export async function saveUploadedFile(
  file: File,
  kind: UploadKind,
): Promise<{ url: string; filename: string }> {
  const allowed = kind === 'image' ? IMAGE_TYPES : VIDEO_TYPES
  const maxSize = kind === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES

  if (!allowed.has(file.type)) {
    throw new Error(
      kind === 'image'
        ? 'Format image non supporté (JPG, PNG, WebP, GIF, SVG).'
        : 'Format vidéo non supporté (MP4, WebM, MOV).',
    )
  }

  if (file.size > maxSize) {
    throw new Error(
      kind === 'image'
        ? 'Image trop volumineuse (max 10 Mo).'
        : 'Vidéo trop volumineuse (max 100 Mo).',
    )
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  const ext =
    EXT_BY_MIME[file.type] ??
    (path.extname(file.name) || (kind === 'image' ? '.jpg' : '.mp4'))
  const base = sanitizeBaseName(file.name) || kind
  const filename = `${Date.now()}-${randomBytes(4).toString('hex')}-${base}${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)

  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filepath, buffer)

  return { url: `/uploads/${filename}`, filename }
}
