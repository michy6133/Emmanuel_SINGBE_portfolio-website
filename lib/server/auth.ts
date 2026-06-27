import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'portfolio_admin_session'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

function getSecret(): string {
  return process.env.ADMIN_SECRET || 'emmanuel-admin-2026-change-me'
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'emmanuel2026'
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

function createToken(): string {
  const exp = Date.now() + SESSION_TTL_MS
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function verifyToken(token: string): boolean {
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  const expected = sign(payload)
  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { exp: number }
    return typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return token ? verifyToken(token) : false
}

export function verifyPassword(password: string): boolean {
  const expected = getAdminPassword()
  const a = Buffer.from(password)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function verifySessionToken(token: string | null | undefined): boolean {
  if (!token) return false
  return verifyToken(token)
}

export { SESSION_COOKIE }
