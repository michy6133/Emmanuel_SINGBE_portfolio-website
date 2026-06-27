import { DEFAULT_CONTENT } from '@/lib/default-content'
import type { SiteContent } from '@/lib/types'

/** Fusion profonde du contenu stocké avec les valeurs par défaut */
export function mergeSiteContent(stored: Partial<SiteContent>): SiteContent {
  const base = DEFAULT_CONTENT
  return {
    contact: { ...base.contact, ...stored.contact },
    stats: stored.stats?.length ? stored.stats : base.stats,
    why: stored.why?.length ? stored.why : base.why,
    projects: stored.projects?.length ? stored.projects : base.projects,
    services: stored.services?.length ? stored.services : base.services,
    certifications: stored.certifications?.length ? stored.certifications : base.certifications,
    testimonials: stored.testimonials?.length ? stored.testimonials : base.testimonials,
    navLinks: stored.navLinks?.length ? stored.navLinks : base.navLinks,
    hero: { ...base.hero, ...stored.hero },
    welcomeVideo: { ...base.welcomeVideo, ...stored.welcomeVideo },
    about: {
      ...base.about,
      ...stored.about,
      extendedBio: stored.about?.extendedBio?.length
        ? stored.about.extendedBio
        : base.about.extendedBio,
    },
  }
}

export function validateSiteContent(data: unknown): data is SiteContent {
  if (!data || typeof data !== 'object') return false
  const c = data as SiteContent
  return (
    !!c.contact &&
    Array.isArray(c.stats) &&
    Array.isArray(c.why) &&
    Array.isArray(c.projects) &&
    Array.isArray(c.services) &&
    Array.isArray(c.certifications) &&
    Array.isArray(c.testimonials) &&
    Array.isArray(c.navLinks) &&
    !!c.hero &&
    !!c.welcomeVideo &&
    !!c.about
  )
}
