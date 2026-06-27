import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/server/auth'

export async function requireAdmin(): Promise<NextResponse | null> {
  const ok = await isAdminAuthenticated()
  if (!ok) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }
  return null
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('portfolio_admin_session')?.value
}
