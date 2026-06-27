import { NextResponse } from 'next/server'
import { createAdminSession, destroyAdminSession, verifyPassword } from '@/lib/server/auth'

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string }
    if (!password || !verifyPassword(password)) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }
    await createAdminSession()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
}

export async function DELETE() {
  await destroyAdminSession()
  return NextResponse.json({ success: true })
}
