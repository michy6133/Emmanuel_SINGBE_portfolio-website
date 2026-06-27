import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/server/guard'
import { getSiteContent, saveSiteContent } from '@/lib/server/db'
import { validateSiteContent } from '@/lib/server/content-utils'

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
    const body = await request.json()
    if (!validateSiteContent(body)) {
      return NextResponse.json({ error: 'Structure de contenu invalide.' }, { status: 400 })
    }
    await saveSiteContent(body)
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}
