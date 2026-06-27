import { promises as fs } from 'fs'
import path from 'path'
import { randomBytes } from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
] as const

export const VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
] as const

const IMAGE_TYPES = new Set<string>(IMAGE_MIME_TYPES)
const VIDEO_TYPES = new Set<string>(VIDEO_MIME_TYPES)

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

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
}

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024

export type UploadKind = 'image' | 'video'

export function isBlobUploadEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

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

/** Détecte le MIME quand le navigateur n’envoie pas file.type (fréquent sous Windows). */
export function resolveMimeType(file: File): string {
  if (file.type) return file.type
  const ext = path.extname(file.name).toLowerCase()
  return MIME_BY_EXT[ext] ?? ''
}

export function validateUploadFile(file: File, kind: UploadKind): string {
  const allowed = kind === 'image' ? IMAGE_TYPES : VIDEO_TYPES
  const maxSize = kind === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES
  const mime = resolveMimeType(file)

  if (!mime || !allowed.has(mime)) {
    return kind === 'image'
      ? 'Format image non supporté (JPG, PNG, WebP, GIF, SVG).'
      : 'Format vidéo non supporté (MP4, WebM, MOV).'
  }

  if (file.size > maxSize) {
    return kind === 'image'
      ? 'Image trop volumineuse (max 10 Mo).'
      : 'Vidéo trop volumineuse (max 100 Mo).'
  }

  return ''
}

export async function saveUploadedFile(
  file: File,
  kind: UploadKind,
): Promise<{ url: string; filename: string }> {
  const validationError = validateUploadFile(file, kind)
  if (validationError) {
    throw new Error(validationError)
  }

  const mime = resolveMimeType(file)

  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  const ext =
    EXT_BY_MIME[mime] ??
    (path.extname(file.name) || (kind === 'image' ? '.jpg' : '.mp4'))
  const base = sanitizeBaseName(file.name) || kind
  const filename = `${Date.now()}-${randomBytes(4).toString('hex')}-${base}${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)

  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filepath, buffer)

  return { url: `/uploads/${filename}`, filename }
}
