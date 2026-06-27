import { promises as fs } from 'fs'
import fsSync from 'fs'
import path from 'path'
import { DEFAULT_CONTENT } from '@/lib/default-content'
import type { Comment, SiteContent } from '@/lib/types'
import { mergeSiteContent } from './content-utils'

const DATA_DIR = path.join(process.cwd(), 'data')
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json')
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json')

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

function initStoreSync() {
  fsSync.mkdirSync(DATA_DIR, { recursive: true })
  if (!fsSync.existsSync(COMMENTS_FILE)) {
    fsSync.writeFileSync(COMMENTS_FILE, '[]', 'utf-8')
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  initStoreSync()
  try {
    const raw = await fs.readFile(CONTENT_FILE, 'utf-8')
    const stored = JSON.parse(raw) as Partial<SiteContent>
    return mergeSiteContent(stored)
  } catch {
    return DEFAULT_CONTENT
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  initStoreSync()
  await ensureDataDir()
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8')
}

async function readComments(): Promise<Comment[]> {
  try {
    const raw = await fs.readFile(COMMENTS_FILE, 'utf-8')
    return JSON.parse(raw) as Comment[]
  } catch {
    return []
  }
}

async function writeComments(comments: Comment[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf-8')
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
  initStoreSync()
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

/** @deprecated Utiliser initStoreSync interne */
export function assertDataStoreReady(): void {
  initStoreSync()
}
