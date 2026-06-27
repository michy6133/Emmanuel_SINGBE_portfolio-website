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
      console.error('Validation failed for SiteContent. Received body structure:', {
        hasContact: !!(body as any)?.contact,
        statsIsArray: Array.isArray((body as any)?.stats),
        whyIsArray: Array.isArray((body as any)?.why),
        projectsIsArray: Array.isArray((body as any)?.projects),
        servicesIsArray: Array.isArray((body as any)?.services),
        certificationsIsArray: Array.isArray((body as any)?.certifications),
        testimonialsIsArray: Array.isArray((body as any)?.testimonials),
        navLinksIsArray: Array.isArray((body as any)?.navLinks),
        hasHero: !!(body as any)?.hero,
        hasWelcomeVideo: !!(body as any)?.welcomeVideo,
        hasAbout: !!(body as any)?.about,
      })
      return NextResponse.json({ error: 'Structure de contenu invalide.' }, { status: 400 })
    }
    await saveSiteContent(body)
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in PUT /api/admin/content:', error)
    const message = error instanceof Error ? error.message : 'Données invalides'
    const status = message.includes('Stockage indisponible') ? 503 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
