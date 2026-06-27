import { head, put } from '@vercel/blob'

export const CONTENT_BLOB_PATH = 'portfolio/site-content.json'
export const COMMENTS_BLOB_PATH = 'portfolio/comments.json'

export function isBlobStorageEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

export async function readJsonBlob<T>(pathname: string, fallback: T): Promise<T> {
  try {
    const meta = await head(pathname)
    const res = await fetch(meta.url, { cache: 'no-store' })
    if (!res.ok) return fallback
    return (await res.json()) as T
  } catch {
    return fallback
  }
}

export async function writeJsonBlob(pathname: string, data: unknown): Promise<void> {
  const options = {
    access: 'public' as const,
    contentType: 'application/json',
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 30, // 30 jours
    validUntil: Date.now() + 60 * 60 * 24 * 30, // 30 jours
  }
  await put(pathname, JSON.stringify(data, null, 2), options)
}

export function assertBlobStorageAvailable(): void {
  if (process.env.VERCEL && !isBlobStorageEnabled()) {
    throw new Error(
      'Stockage indisponible sur Vercel. Créez un Blob Store (Storage → Blob) et redéployez.',
    )
  }
}
