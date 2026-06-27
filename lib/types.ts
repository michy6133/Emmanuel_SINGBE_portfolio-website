export type Stat = {
  value: number
  suffix: string
  label: string
}

export type WhyItem = {
  title: string
  text: string
}

export type Project = {
  id: string
  title: string
  client: string
  year: string
  category: 'Vidéo' | 'Community Management' | 'Événementiel' | 'Marques'
  thumbnail: string
  shortDescription: string
  context: string
  objectives: string
  results: string
  videoUrl?: string
  gallery: string[]
}

export type Service = {
  title: string
  text: string
}

export type Certification = {
  year: string
  title: string
  org: string
  logo: string
  description: string
  skills: string[]
}

export type Testimonial = {
  name: string
  role: string
  company: string
  photo: string
  text: string
}

export type NavLink = {
  label: string
  href: string
}

export type ContactInfo = {
  phone: string
  email: string
  whatsapp: string
  instagram: string
  tiktok: string
  linkedin: string
  youtube: string
}

export type HeroContent = {
  eyebrow: string
  titleLine1: string
  titleLine2: string
  subtitle: string
  description: string
  portraitImage: string
  experienceValue: string
  experienceLabel: string
}

export type WelcomeVideoContent = {
  enabled: boolean
  videoUrl: string
  posterImage: string
  title: string
  subtitle: string
}

export type AboutContent = {
  title: string
  description: string
  portraitImage: string
  experienceValue: string
  experienceLabel: string
  extendedBio: string[]
}

export type SiteContent = {
  contact: ContactInfo
  stats: Stat[]
  why: WhyItem[]
  projects: Project[]
  services: Service[]
  certifications: Certification[]
  testimonials: Testimonial[]
  navLinks: NavLink[]
  hero: HeroContent
  welcomeVideo: WelcomeVideoContent
  about: AboutContent
}

export type CommentStatus = 'pending' | 'approved' | 'rejected'

export type Comment = {
  id: string
  firstName: string
  lastName: string
  email: string
  company: string
  role: string
  text: string
  status: CommentStatus
  createdAt: string
}
