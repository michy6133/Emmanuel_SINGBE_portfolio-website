'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Save,
  LogOut,
  Trash2,
  Check,
  X,
  Clock,
  Video,
  User,
  BarChart3,
  Layout,
  Briefcase,
  GraduationCap,
  Star,
  Phone,
  MessageSquare,
  Menu,
  ExternalLink,
  Link2,
} from 'lucide-react'
import { AdminLogin } from '@/components/admin/login-form'
import {
  FormGroup,
  FormRow,
  ItemCard,
  Rubric,
  CommentGroup,
} from '@/components/admin/form-layout'
import {
  Field,
  TextArea,
  Toggle,
  SelectField,
  MediaPathField,
  StringListField,
  TextListField,
  SkillsField,
  PROJECT_CATEGORIES,
} from '@/components/admin/form-fields'
import type { Comment, Project, SiteContent, Testimonial } from '@/lib/types'
import { DEFAULT_CONTENT } from '@/lib/default-content'
import { adminFetch } from '@/lib/admin-fetch'
import { cn } from '@/lib/utils'

type AdminTab =
  | 'welcome'
  | 'hero'
  | 'stats'
  | 'about'
  | 'why'
  | 'projects'
  | 'services'
  | 'certifications'
  | 'testimonials'
  | 'contact'
  | 'comments'
  | 'navigation'

const NAV: { id: AdminTab; label: string; icon: typeof Layout }[] = [
  { id: 'welcome', label: "Vidéo d'accueil", icon: Video },
  { id: 'hero', label: 'Introduction', icon: User },
  { id: 'stats', label: 'Statistiques', icon: BarChart3 },
  { id: 'about', label: 'À propos', icon: User },
  { id: 'why', label: 'Pourquoi moi', icon: Layout },
  { id: 'projects', label: 'Réalisations', icon: Briefcase },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'certifications', label: 'Parcours', icon: GraduationCap },
  { id: 'testimonials', label: 'Témoignages', icon: Star },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'navigation', label: 'Navigation', icon: Link2 },
  { id: 'comments', label: 'Commentaires', icon: MessageSquare },
]

export function AdminApp() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [content, setContent] = useState<SiteContent | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [tab, setTab] = useState<AdminTab>('welcome')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const checkSession = useCallback(async () => {
    const res = await adminFetch('/api/admin/session')
    const data = await res.json()
    setAuthenticated(data.authenticated)
    return data.authenticated as boolean
  }, [])

  const loadData = useCallback(async () => {
    const [contentRes, commentsRes] = await Promise.all([
      adminFetch('/api/admin/content'),
      adminFetch('/api/admin/comments'),
    ])

    if (contentRes.status === 401 || commentsRes.status === 401) {
      setAuthenticated(false)
      return
    }

    if (contentRes.ok) setContent(await contentRes.json())
    if (commentsRes.ok) setComments(await commentsRes.json())
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Session state is updated after an async request.
    checkSession().then((ok) => {
      if (ok) loadData()
    })
  }, [checkSession, loadData])

  const handleLogout = async () => {
    await adminFetch('/api/admin/auth', { method: 'DELETE' })
    setAuthenticated(false)
    setContent(null)
    setComments([])
  }

  const saveContent = async () => {
    if (!content) return
    setSaving(true)
    setMessage('')
    const res = await adminFetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    })
    setSaving(false)
    if (res.ok) {
      setMessage('Contenu enregistré — visible sur le site.')
    } else {
      const data = await res.json().catch(() => ({}))
      setMessage(data.error || 'Erreur lors de la sauvegarde.')
    }
  }

  const updateCommentStatus = async (id: string, status: Comment['status']) => {
    const res = await adminFetch('/api/admin/comments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) loadData()
  }

  const removeComment = async (id: string) => {
    const res = await adminFetch(`/api/admin/comments?id=${id}`, { method: 'DELETE' })
    if (res.ok) loadData()
  }

  const selectTab = (id: AdminTab) => {
    setTab(id)
    setSidebarOpen(false)
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Chargement...
      </div>
    )
  }

  if (!authenticated) {
    return (
      <AdminLogin
        onSuccess={() => {
          setAuthenticated(true)
          loadData()
        }}
      />
    )
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Chargement du contenu...
      </div>
    )
  }

  const pendingCount = comments.filter((c) => c.status === 'pending').length
  const activeLabel = NAV.find((n) => n.id === tab)?.label ?? ''

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="border-b border-border px-5 py-5">
          <p className="font-heading text-sm font-bold uppercase tracking-wider text-primary">
            Emmanuel SINGBE
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Administration portfolio</p>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectTab(id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                tab === id
                  ? 'bg-primary/15 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {id === 'comments' && pendingCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="space-y-2 border-t border-border p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="size-4" />
            Voir le site
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          >
            <LogOut className="size-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Zone principale */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/95 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="size-4" />
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold">{activeLabel}</h1>
              {pendingCount > 0 && tab !== 'comments' && (
                <p className="text-xs text-primary">
                  {pendingCount} commentaire{pendingCount > 1 ? 's' : ''} en attente
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={saveContent}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Save className="size-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </header>

        {message && (
          <p className="border-b border-border bg-primary/10 px-4 py-2 text-center text-sm text-primary lg:px-8">
            {message}
          </p>
        )}

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-4xl">
            {tab === 'welcome' && (
              <Rubric hint="Section plein écran avant l'introduction — lecture automatique muette.">
                <FormGroup title="Paramètres">
                  <Toggle
                    label="Afficher la section sur le site"
                    checked={content.welcomeVideo.enabled}
                    onChange={(v) =>
                      setContent({ ...content, welcomeVideo: { ...content.welcomeVideo, enabled: v } })
                    }
                  />
                </FormGroup>
                <FormGroup title="Médias" description="Vidéo principale et image de secours pendant le chargement.">
                  <MediaPathField
                    label="Vidéo"
                    kind="video"
                    value={content.welcomeVideo.videoUrl}
                    onChange={(v) => setContent({ ...content, welcomeVideo: { ...content.welcomeVideo, videoUrl: v } })}
                  />
                  <MediaPathField
                    label="Image poster"
                    value={content.welcomeVideo.posterImage}
                    onChange={(v) => setContent({ ...content, welcomeVideo: { ...content.welcomeVideo, posterImage: v } })}
                  />
                </FormGroup>
                <FormGroup title="Textes affichés" description="Superposés sur la vidéo.">
                  <Field label="Titre" value={content.welcomeVideo.title} onChange={(v) => setContent({ ...content, welcomeVideo: { ...content.welcomeVideo, title: v } })} />
                  <TextArea label="Sous-titre" value={content.welcomeVideo.subtitle} onChange={(v) => setContent({ ...content, welcomeVideo: { ...content.welcomeVideo, subtitle: v } })} rows={2} />
                </FormGroup>
              </Rubric>
            )}

            {tab === 'hero' && (
              <Rubric hint="Première section : texte à gauche, portrait et badge d'expérience à droite.">
                <FormGroup title="En-tête">
                  <Field label="Badge" value={content.hero.eyebrow} onChange={(v) => setContent({ ...content, hero: { ...content.hero, eyebrow: v } })} />
                  <FormRow>
                    <Field label="Titre — ligne 1" value={content.hero.titleLine1} onChange={(v) => setContent({ ...content, hero: { ...content.hero, titleLine1: v } })} />
                    <Field label="Titre — ligne 2 (couleur accent)" value={content.hero.titleLine2} onChange={(v) => setContent({ ...content, hero: { ...content.hero, titleLine2: v } })} />
                  </FormRow>
                  <Field label="Sous-titre / métiers" value={content.hero.subtitle} onChange={(v) => setContent({ ...content, hero: { ...content.hero, subtitle: v } })} />
                </FormGroup>
                <FormGroup title="Présentation">
                  <TextArea label="Description" value={content.hero.description} onChange={(v) => setContent({ ...content, hero: { ...content.hero, description: v } })} rows={4} />
                </FormGroup>
                <FormGroup title="Portrait & badge" description="Colonne visuelle à droite de la section.">
                  <MediaPathField
                    label="Photo portrait"
                    value={content.hero.portraitImage}
                    onChange={(v) => setContent({ ...content, hero: { ...content.hero, portraitImage: v } })}
                  />
                  <FormRow>
                    <Field label="Badge — valeur" value={content.hero.experienceValue} onChange={(v) => setContent({ ...content, hero: { ...content.hero, experienceValue: v } })} placeholder="2+ ans" />
                    <Field label="Badge — label" value={content.hero.experienceLabel} onChange={(v) => setContent({ ...content, hero: { ...content.hero, experienceLabel: v } })} placeholder="d'expérience créative" />
                  </FormRow>
                </FormGroup>
              </Rubric>
            )}

            {tab === 'stats' && (
              <Rubric hint="Quatre compteurs animés sous l'introduction.">
                <div className="grid gap-4 sm:grid-cols-2">
                  {content.stats.map((stat, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-4">
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                        Statistique {i + 1}
                      </p>
                      <div className="space-y-3">
                        <FormRow>
                          <Field label="Valeur" type="number" value={String(stat.value)} onChange={(v) => { const stats = [...content.stats]; stats[i] = { ...stat, value: Number(v) }; setContent({ ...content, stats }) }} />
                          <Field label="Suffixe" value={stat.suffix} onChange={(v) => { const stats = [...content.stats]; stats[i] = { ...stat, suffix: v }; setContent({ ...content, stats }) }} placeholder="+" />
                        </FormRow>
                        <Field label="Libellé affiché" value={stat.label} onChange={(v) => { const stats = [...content.stats]; stats[i] = { ...stat, label: v }; setContent({ ...content, stats }) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Rubric>
            )}

            {tab === 'about' && (
              <Rubric hint="Section biographique avec portrait et parcours dépliable.">
                <FormGroup title="Présentation">
                  <Field label="Titre de section" value={content.about.title} onChange={(v) => setContent({ ...content, about: { ...content.about, title: v } })} />
                  <TextArea label="Description" value={content.about.description} onChange={(v) => setContent({ ...content, about: { ...content.about, description: v } })} rows={4} />
                </FormGroup>
                <FormGroup title="Visuel">
                  <MediaPathField
                    label="Photo portrait"
                    value={content.about.portraitImage}
                    onChange={(v) => setContent({ ...content, about: { ...content.about, portraitImage: v } })}
                  />
                  <FormRow>
                    <Field label="Badge — valeur" value={content.about.experienceValue} onChange={(v) => setContent({ ...content, about: { ...content.about, experienceValue: v } })} />
                    <Field label="Badge — label" value={content.about.experienceLabel} onChange={(v) => setContent({ ...content, about: { ...content.about, experienceLabel: v } })} />
                  </FormRow>
                </FormGroup>
                <FormGroup title="Parcours détaillé" description="Contenu du bouton « Découvrir mon parcours ».">
                  <TextListField
                    label="Paragraphes"
                    values={content.about.extendedBio}
                    onChange={(extendedBio) => setContent({ ...content, about: { ...content.about, extendedBio } })}
                    hint="Un paragraphe par entrée."
                  />
                </FormGroup>
              </Rubric>
            )}

            {tab === 'why' && (
              <Rubric
                hint="Quatre cartes argumentaires (icônes fixes sur le site)."
                onAdd={() => setContent({ ...content, why: [...content.why, { title: 'Nouveau', text: '' }] })}
                addLabel="Ajouter une carte"
              >
                <div className="space-y-4">
                  {content.why.map((item, i) => (
                    <ItemCard
                      key={i}
                      index={i}
                      title={item.title}
                      onDelete={() => setContent({ ...content, why: content.why.filter((_, j) => j !== i) })}
                    >
                      <FormRow>
                        <Field label="Titre" value={item.title} onChange={(v) => { const why = [...content.why]; why[i] = { ...item, title: v }; setContent({ ...content, why }) }} />
                      </FormRow>
                      <TextArea label="Texte descriptif" value={item.text} onChange={(v) => { const why = [...content.why]; why[i] = { ...item, text: v }; setContent({ ...content, why }) }} rows={3} />
                    </ItemCard>
                  ))}
                </div>
              </Rubric>
            )}

            {tab === 'projects' && (
              <Rubric
                hint="Grille filtrable par catégorie — clic pour ouvrir le détail (vidéo, contexte, galerie)."
                onAdd={() => setContent({
                  ...content,
                  projects: [...content.projects, {
                    id: `project-${Date.now()}`,
                    title: 'Nouveau projet',
                    client: 'Client',
                    year: String(new Date().getFullYear()),
                    category: 'Vidéo',
                    thumbnail: '/work-brand-campaign.png',
                    shortDescription: '',
                    context: '',
                    objectives: '',
                    results: '',
                    gallery: [],
                  } satisfies Project],
                })}
                addLabel="Ajouter un projet"
              >
                <div className="space-y-5">
                  {content.projects.map((project, i) => (
                    <ItemCard
                      key={project.id}
                      index={i}
                      title={project.title}
                      subtitle={`${project.client} · ${project.year} · ${project.category}`}
                      onDelete={() => setContent({ ...content, projects: content.projects.filter((_, j) => j !== i) })}
                    >
                      <FormGroup title="Informations générales">
                        <Field label="Identifiant technique" value={project.id} onChange={(v) => { const projects = [...content.projects]; projects[i] = { ...project, id: v }; setContent({ ...content, projects }) }} hint="Ne modifiez que si nécessaire." />
                        <Field label="Titre du projet" value={project.title} onChange={(v) => { const projects = [...content.projects]; projects[i] = { ...project, title: v }; setContent({ ...content, projects }) }} />
                        <FormRow>
                          <Field label="Client" value={project.client} onChange={(v) => { const projects = [...content.projects]; projects[i] = { ...project, client: v }; setContent({ ...content, projects }) }} />
                          <Field label="Année" value={project.year} onChange={(v) => { const projects = [...content.projects]; projects[i] = { ...project, year: v }; setContent({ ...content, projects }) }} />
                        </FormRow>
                        <SelectField
                          label="Catégorie"
                          value={project.category}
                          options={[...PROJECT_CATEGORIES]}
                          onChange={(v) => { const projects = [...content.projects]; projects[i] = { ...project, category: v as Project['category'] }; setContent({ ...content, projects }) }}
                        />
                      </FormGroup>
                      <FormGroup title="Carte (aperçu grille)" description="Visible sur la page d'accueil avant ouverture.">
                        <MediaPathField
                          label="Miniature"
                          value={project.thumbnail}
                          onChange={(v) => { const projects = [...content.projects]; projects[i] = { ...project, thumbnail: v }; setContent({ ...content, projects }) }}
                        />
                        <TextArea label="Description courte" value={project.shortDescription} onChange={(v) => { const projects = [...content.projects]; projects[i] = { ...project, shortDescription: v }; setContent({ ...content, projects }) }} rows={2} />
                      </FormGroup>
                      <FormGroup title="Modal — Média" description="Lecteur vidéo ou image en grand format.">
                        <MediaPathField
                          label="Vidéo (optionnelle)"
                          kind="video"
                          value={project.videoUrl ?? ''}
                          onChange={(v) => { const projects = [...content.projects]; projects[i] = { ...project, videoUrl: v || undefined }; setContent({ ...content, projects }) }}
                        />
                      </FormGroup>
                      <FormGroup title="Modal — Récit du projet">
                        <TextArea label="Contexte" value={project.context} onChange={(v) => { const projects = [...content.projects]; projects[i] = { ...project, context: v }; setContent({ ...content, projects }) }} rows={3} />
                        <TextArea label="Objectifs" value={project.objectives} onChange={(v) => { const projects = [...content.projects]; projects[i] = { ...project, objectives: v }; setContent({ ...content, projects }) }} rows={3} />
                        <TextArea label="Résultats" value={project.results} onChange={(v) => { const projects = [...content.projects]; projects[i] = { ...project, results: v }; setContent({ ...content, projects }) }} rows={3} />
                      </FormGroup>
                      <FormGroup title="Galerie complémentaire" description="Grille d'images sous le détail.">
                        <StringListField
                          label="Images"
                          values={project.gallery}
                          onChange={(gallery) => { const projects = [...content.projects]; projects[i] = { ...project, gallery }; setContent({ ...content, projects }) }}
                          uploadImages
                        />
                      </FormGroup>
                    </ItemCard>
                  ))}
                </div>
              </Rubric>
            )}

            {tab === 'services' && (
              <Rubric
                hint="Cartes de prestations en grille (5e carte CTA fixe sur le site)."
                onAdd={() => setContent({ ...content, services: [...content.services, { title: 'Nouveau service', text: '' }] })}
                addLabel="Ajouter un service"
              >
                <div className="space-y-4">
                  {content.services.map((service, i) => (
                    <ItemCard
                      key={i}
                      index={i}
                      title={service.title}
                      onDelete={() => setContent({ ...content, services: content.services.filter((_, j) => j !== i) })}
                    >
                      <Field label="Titre du service" value={service.title} onChange={(v) => { const services = [...content.services]; services[i] = { ...service, title: v }; setContent({ ...content, services }) }} />
                      <TextArea label="Description" value={service.text} onChange={(v) => { const services = [...content.services]; services[i] = { ...service, text: v }; setContent({ ...content, services }) }} rows={4} />
                    </ItemCard>
                  ))}
                </div>
              </Rubric>
            )}

            {tab === 'certifications' && (
              <Rubric
                hint="Frise chronologique avec logo, description et badges de compétences."
                onAdd={() => setContent({
                  ...content,
                  certifications: [...content.certifications, {
                    year: String(new Date().getFullYear()),
                    title: 'Nouvelle formation',
                    org: '',
                    logo: '/placeholder-logo.png',
                    description: '',
                    skills: [],
                  }],
                })}
                addLabel="Ajouter une formation"
              >
                <div className="space-y-5">
                  {content.certifications.map((cert, i) => (
                    <ItemCard
                      key={i}
                      index={i}
                      title={cert.title}
                      subtitle={`${cert.year} · ${cert.org}`}
                      onDelete={() => setContent({ ...content, certifications: content.certifications.filter((_, j) => j !== i) })}
                    >
                      <FormGroup title="Informations">
                        <FormRow>
                          <Field label="Année" value={cert.year} onChange={(v) => { const certifications = [...content.certifications]; certifications[i] = { ...cert, year: v }; setContent({ ...content, certifications }) }} />
                          <Field label="Organisation" value={cert.org} onChange={(v) => { const certifications = [...content.certifications]; certifications[i] = { ...cert, org: v }; setContent({ ...content, certifications }) }} />
                        </FormRow>
                        <Field label="Titre de la formation" value={cert.title} onChange={(v) => { const certifications = [...content.certifications]; certifications[i] = { ...cert, title: v }; setContent({ ...content, certifications }) }} />
                      </FormGroup>
                      <FormGroup title="Visuel">
                        <MediaPathField
                          label="Logo"
                          value={cert.logo}
                          onChange={(v) => { const certifications = [...content.certifications]; certifications[i] = { ...cert, logo: v }; setContent({ ...content, certifications }) }}
                        />
                      </FormGroup>
                      <FormGroup title="Contenu">
                        <TextArea label="Description" value={cert.description} onChange={(v) => { const certifications = [...content.certifications]; certifications[i] = { ...cert, description: v }; setContent({ ...content, certifications }) }} rows={3} />
                        <SkillsField
                          label="Compétences acquises"
                          values={cert.skills}
                          onChange={(skills) => { const certifications = [...content.certifications]; certifications[i] = { ...cert, skills }; setContent({ ...content, certifications }) }}
                        />
                      </FormGroup>
                    </ItemCard>
                  ))}
                </div>
              </Rubric>
            )}

            {tab === 'testimonials' && (
              <Rubric
                hint="Carrousel de témoignages clients avec photo et attribution."
                onAdd={() => setContent({
                  ...content,
                  testimonials: [...content.testimonials, {
                    name: 'Nouveau',
                    role: '',
                    company: '',
                    photo: '/placeholder.svg',
                    text: '',
                  } satisfies Testimonial],
                })}
                addLabel="Ajouter un témoignage"
              >
                <div className="space-y-5">
                  {content.testimonials.map((t, i) => (
                    <ItemCard
                      key={i}
                      index={i}
                      title={t.name}
                      subtitle={[t.role, t.company].filter(Boolean).join(' · ')}
                      onDelete={() => setContent({ ...content, testimonials: content.testimonials.filter((_, j) => j !== i) })}
                    >
                      <FormGroup title="Auteur">
                        <Field label="Nom affiché" value={t.name} onChange={(v) => { const testimonials = [...content.testimonials]; testimonials[i] = { ...t, name: v }; setContent({ ...content, testimonials }) }} />
                        <FormRow>
                          <Field label="Rôle / fonction" value={t.role} onChange={(v) => { const testimonials = [...content.testimonials]; testimonials[i] = { ...t, role: v }; setContent({ ...content, testimonials }) }} />
                          <Field label="Entreprise" value={t.company} onChange={(v) => { const testimonials = [...content.testimonials]; testimonials[i] = { ...t, company: v }; setContent({ ...content, testimonials }) }} />
                        </FormRow>
                        <MediaPathField
                          label="Photo"
                          value={t.photo}
                          onChange={(v) => { const testimonials = [...content.testimonials]; testimonials[i] = { ...t, photo: v }; setContent({ ...content, testimonials }) }}
                        />
                      </FormGroup>
                      <FormGroup title="Citation">
                        <TextArea label="Texte du témoignage" value={t.text} onChange={(v) => { const testimonials = [...content.testimonials]; testimonials[i] = { ...t, text: v }; setContent({ ...content, testimonials }) }} rows={4} />
                      </FormGroup>
                    </ItemCard>
                  ))}
                </div>
              </Rubric>
            )}

            {tab === 'contact' && (
              <Rubric hint="Coordonnées affichées dans la section contact et liens réseaux sociaux.">
                <FormGroup title="Coordonnées directes">
                  <FormRow>
                    <Field label="Téléphone" value={content.contact.phone} onChange={(v) => setContent({ ...content, contact: { ...content.contact, phone: v } })} />
                    <Field label="Email" value={content.contact.email} onChange={(v) => setContent({ ...content, contact: { ...content.contact, email: v } })} />
                  </FormRow>
                  <Field label="WhatsApp" value={content.contact.whatsapp} onChange={(v) => setContent({ ...content, contact: { ...content.contact, whatsapp: v } })} hint="Numéro international sans le signe + (ex: 22901000000000)" />
                </FormGroup>
                <FormGroup title="Réseaux sociaux" description="Liens des icônes en bas de la section contact.">
                  <FormRow>
                    <Field label="Instagram" value={content.contact.instagram} onChange={(v) => setContent({ ...content, contact: { ...content.contact, instagram: v } })} />
                    <Field label="TikTok" value={content.contact.tiktok} onChange={(v) => setContent({ ...content, contact: { ...content.contact, tiktok: v } })} />
                  </FormRow>
                  <FormRow>
                    <Field label="LinkedIn" value={content.contact.linkedin} onChange={(v) => setContent({ ...content, contact: { ...content.contact, linkedin: v } })} />
                    <Field label="YouTube" value={content.contact.youtube} onChange={(v) => setContent({ ...content, contact: { ...content.contact, youtube: v } })} />
                  </FormRow>
                </FormGroup>
              </Rubric>
            )}

            {tab === 'navigation' && (
              <Rubric
                hint="Liens du menu principal en haut du site."
                onAdd={() => setContent({ ...content, navLinks: [...content.navLinks, { label: 'Nouveau', href: '#' }] })}
                addLabel="Ajouter un lien"
              >
                <div className="space-y-3">
                  {content.navLinks.map((link, i) => (
                    <ItemCard
                      key={i}
                      index={i}
                      title={link.label}
                      subtitle={link.href}
                      onDelete={() => setContent({ ...content, navLinks: content.navLinks.filter((_, j) => j !== i) })}
                    >
                      <FormRow>
                        <Field label="Libellé du menu" value={link.label} onChange={(v) => { const navLinks = [...content.navLinks]; navLinks[i] = { ...link, label: v }; setContent({ ...content, navLinks }) }} />
                        <Field label="Ancre / URL" value={link.href} onChange={(v) => { const navLinks = [...content.navLinks]; navLinks[i] = { ...link, href: v }; setContent({ ...content, navLinks }) }} placeholder="#about" />
                      </FormRow>
                    </ItemCard>
                  ))}
                </div>
              </Rubric>
            )}

            {tab === 'comments' && (
              <Rubric hint="Commentaires soumis par les visiteurs — approuvez-les pour les afficher dans le carrousel.">
                {comments.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                    Aucun commentaire pour le moment.
                  </p>
                ) : (
                  <div className="space-y-8">
                    <CommentGroup title="En attente de validation" count={comments.filter((c) => c.status === 'pending').length}>
                      {comments.filter((c) => c.status === 'pending').map((comment) => (
                        <CommentCard key={comment.id} comment={comment} onApprove={() => updateCommentStatus(comment.id, 'approved')} onReject={() => updateCommentStatus(comment.id, 'rejected')} onDelete={() => removeComment(comment.id)} />
                      ))}
                    </CommentGroup>
                    <CommentGroup title="Approuvés" count={comments.filter((c) => c.status === 'approved').length}>
                      {comments.filter((c) => c.status === 'approved').map((comment) => (
                        <CommentCard key={comment.id} comment={comment} onReject={() => updateCommentStatus(comment.id, 'rejected')} onDelete={() => removeComment(comment.id)} />
                      ))}
                    </CommentGroup>
                    <CommentGroup title="Rejetés" count={comments.filter((c) => c.status === 'rejected').length}>
                      {comments.filter((c) => c.status === 'rejected').map((comment) => (
                        <CommentCard key={comment.id} comment={comment} onApprove={() => updateCommentStatus(comment.id, 'approved')} onDelete={() => removeComment(comment.id)} />
                      ))}
                    </CommentGroup>
                  </div>
                )}
              </Rubric>
            )}

            <div className="mt-10 border-t border-border pt-6 pb-8">
              <button
                type="button"
                onClick={() => { if (confirm('Réinitialiser tout le contenu aux valeurs par défaut ?')) setContent(DEFAULT_CONTENT) }}
                className="text-xs text-muted-foreground underline hover:text-destructive"
              >
                Réinitialiser le contenu par défaut
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function CommentCard({
  comment,
  onApprove,
  onReject,
  onDelete,
}: {
  comment: Comment
  onApprove?: () => void
  onReject?: () => void
  onDelete: () => void
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">{comment.firstName} {comment.lastName}</p>
          <p className="text-xs text-muted-foreground">{comment.email}</p>
          {(comment.company || comment.role) && (
            <p className="text-xs text-muted-foreground">
              {[comment.role, comment.company].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <StatusBadge status={comment.status} />
      </div>
      <blockquote className="mt-3 border-l-2 border-primary/30 pl-3 text-sm leading-relaxed text-foreground">
        {comment.text}
      </blockquote>
      <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="size-3" />
        {new Date(comment.createdAt).toLocaleString('fr-FR')}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {onApprove && (
          <ActionBtn onClick={onApprove} icon={Check} label="Approuver" />
        )}
        {onReject && (
          <ActionBtn onClick={onReject} icon={X} label="Rejeter" variant="danger" />
        )}
        <ActionBtn onClick={onDelete} icon={Trash2} label="Supprimer" />
      </div>
    </article>
  )
}

function StatusBadge({ status }: { status: Comment['status'] }) {
  const map = { pending: 'En attente', approved: 'Approuvé', rejected: 'Rejeté' }
  return <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{map[status]}</span>
}

function ActionBtn({ onClick, icon: Icon, label, variant }: { onClick: () => void; icon: typeof Check; label: string; variant?: 'danger' }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs ${variant === 'danger' ? 'hover:border-destructive hover:text-destructive' : 'hover:border-primary hover:text-primary'}`}>
      <Icon className="size-3" /> {label}
    </button>
  )
}
