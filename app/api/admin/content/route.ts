import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/server/guard'
import { getSiteContent, saveSiteContent } from '@/lib/server/db'
import type { SiteContent } from '@/lib/types'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const content = await getSiteContent()
  return NextResponse.json(content)
}

export async function PUT(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const content = (await request.json()) as SiteContent
    await saveSiteContent(content)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}
