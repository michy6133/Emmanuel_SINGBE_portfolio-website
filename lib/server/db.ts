import { promises as fs } from 'fs'
import fsSync from 'fs'
import path from 'path'
import type { Comment, SiteContent } from '@/lib/types'
import {
  COMMENTS_BLOB_PATH,
  CONTENT_BLOB_PATH,
  assertBlobStorageAvailable,
  isBlobStorageEnabled,
  readJsonBlob,
  writeJsonBlob,
} from './blob-storage'
import { mergeSiteContent } from './content-utils'

const DATA_DIR = path.join(process.cwd(), 'data')
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json')
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json')

function shouldUseLocalFilesystem(): boolean {
  return !isBlobStorageEnabled() && !process.env.VERCEL
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

function initLocalStoreSync() {
  if (!shouldUseLocalFilesystem()) return
  fsSync.mkdirSync(DATA_DIR, { recursive: true })
  if (!fsSync.existsSync(COMMENTS_FILE)) {
    fsSync.writeFileSync(COMMENTS_FILE, '[]', 'utf-8')
  }
}

async function readStoredContent(): Promise<Partial<SiteContent>> {
  if (isBlobStorageEnabled()) {
    return readJsonBlob<Partial<SiteContent>>(CONTENT_BLOB_PATH, {})
  }

  initLocalStoreSync()
  try {
    const raw = await fs.readFile(CONTENT_FILE, 'utf-8')
    return JSON.parse(raw) as Partial<SiteContent>
  } catch {
    return {}
  }
}

async function writeStoredContent(content: SiteContent): Promise<void> {
  assertBlobStorageAvailable()

  if (isBlobStorageEnabled()) {
    await writeJsonBlob(CONTENT_BLOB_PATH, content)
    return
  }

  initLocalStoreSync()
  await ensureDataDir()
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8')
}

async function readComments(): Promise<Comment[]> {
  if (isBlobStorageEnabled()) {
    return readJsonBlob<Comment[]>(COMMENTS_BLOB_PATH, [])
  }

  initLocalStoreSync()
  try {
    const raw = await fs.readFile(COMMENTS_FILE, 'utf-8')
    return JSON.parse(raw) as Comment[]
  } catch {
    return []
  }
}

async function writeComments(comments: Comment[]): Promise<void> {
  assertBlobStorageAvailable()

  if (isBlobStorageEnabled()) {
    await writeJsonBlob(COMMENTS_BLOB_PATH, comments)
    return
  }

  initLocalStoreSync()
  await ensureDataDir()
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf-8')
}

export async function getSiteContent(): Promise<SiteContent> {
  const stored = await readStoredContent()
  return mergeSiteContent(stored)
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await writeStoredContent(content)
}

export async function getApprovedComments(): Promise<Comment[]> {
  const comments = await readComments()
  return comments
    .filter((c) => c.status === 'approved')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getAllComments(): Promise<Comment[]> {
  const comments = await readComments()
  return comments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function addComment(
  data: Omit<Comment, 'id' | 'status' | 'createdAt'>,
): Promise<Comment> {
  const comments = await readComments()
  const comment: Comment = {
    ...data,
    id: crypto.randomUUID(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  comments.push(comment)
  await writeComments(comments)
  return comment
}

export async function updateCommentStatus(
  id: string,
  status: Comment['status'],
): Promise<Comment | null> {
  const comments = await readComments()
  const index = comments.findIndex((c) => c.id === id)
  if (index === -1) return null
  comments[index] = { ...comments[index], status }
  await writeComments(comments)
  return comments[index]
}

export async function deleteComment(id: string): Promise<boolean> {
  const comments = await readComments()
  const filtered = comments.filter((c) => c.id !== id)
  if (filtered.length === comments.length) return false
  await writeComments(filtered)
  return true
}

/** @deprecated Utiliser initLocalStoreSync interne */
export function assertDataStoreReady(): void {
  initLocalStoreSync()
}
