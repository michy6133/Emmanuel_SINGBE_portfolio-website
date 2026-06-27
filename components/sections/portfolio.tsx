'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Calendar, Building2, Maximize2 } from 'lucide-react'
import Image from 'next/image'
import { SectionHeading } from '@/components/section-heading'
import type { Project } from '@/lib/types'
import { cn } from '@/lib/utils'

const FILTERS = [
  'Toutes',
  'Vidéo',
  'Community Management',
  'Événementiel',
  'Marques',
] as const

type PortfolioProps = {
  projects: Project[]
}

export function Portfolio({ projects }: PortfolioProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Toutes')
  const [active, setActive] = useState<Project | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  const filtered =
    filter === 'Toutes'
      ? projects
      : projects.filter((p) => p.category === filter)

  useEffect(() => {
    if (!active) return

    closeButtonRef.current?.focus()
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [active])

  const openFullscreen = async () => {
    if (!mediaRef.current || !document.fullscreenEnabled) return
    await mediaRef.current.requestFullscreen()
  }

  return (
    <section id="work" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Réalisations"
        title="Une sélection de projets"
        description="Des contenus pensés pour marquer les esprits et atteindre des objectifs concrets."
      />

      {/* Filters */}
      <div className="mt-10 flex flex-wrap gap-2.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              'rounded-full border px-5 py-2 text-sm font-medium transition-colors',
              filter === f
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.button
              type="button"
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              onClick={() => setActive(project)}
              aria-label={`Ouvrir le projet ${project.title}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border text-left"
            >
              <Image
                src={project.thumbnail || '/placeholder.svg'}
                alt={project.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent transition-opacity group-hover:from-background/95" />

              <div className="absolute left-4 top-4">
                <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-foreground backdrop-blur">
                  {project.category}
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex size-14 items-center justify-center rounded-full border border-primary/60 bg-primary/20 text-primary backdrop-blur">
                  <Play className="size-6 fill-current" />
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {project.client} · {project.year}
                </p>
                <h3 className="mt-1 font-heading text-lg font-semibold leading-tight">
                  {project.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {project.shortDescription}
                </p>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Detail modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-dialog-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-card"
            >
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Fermer"
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition-colors hover:text-primary"
              >
                <X className="size-5" />
              </button>

              <div ref={mediaRef} className="relative aspect-video w-full overflow-hidden bg-background">
                {active.videoUrl ? (
                  <video
                    src={active.videoUrl}
                    poster={active.thumbnail}
                    controls
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <Image
                      src={active.thumbnail || '/placeholder.svg'}
                      alt={active.title}
                      fill
                      sizes="(min-width: 768px) 768px, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/35 text-center backdrop-blur-[2px]">
                      <span className="flex size-16 items-center justify-center rounded-full border border-primary/60 bg-primary/20 text-primary backdrop-blur">
                        <Play className="size-7 fill-current" />
                      </span>
                      <span className="max-w-xs px-4 text-xs font-medium uppercase tracking-[0.18em] text-foreground">
                        Vidéo prête à intégrer
                      </span>
                    </div>
                  </>
                )}
                <button
                  type="button"
                  onClick={openFullscreen}
                  className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition-colors hover:text-primary"
                  aria-label="Afficher le média en plein écran"
                >
                  <Maximize2 className="size-4" />
                </button>
              </div>

              <div className="p-6 md:p-8">
                <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-primary">
                  {active.category}
                </span>
                <h3 id="project-dialog-title" className="mt-4 font-heading text-2xl font-bold md:text-3xl">
                  {active.title}
                </h3>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="size-4 text-primary" />
                    {active.client}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-4 text-primary" />
                    {active.year}
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  <Detail label="Contexte" text={active.context} />
                  <Detail label="Objectifs" text={active.objectives} />
                  <Detail label="Résultats" text={active.results} />
                </div>

                {/* Galerie complémentaire (placeholders) */}
                <div className="mt-7">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Galerie complémentaire
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {active.gallery.map((image, i) => (
                      <div
                        key={`${active.id}-${image}-${i}`}
                        className="relative aspect-video overflow-hidden rounded-lg border border-border"
                      >
                        <Image
                          src={image}
                          alt={`${active.title} — visuel ${i + 1}`}
                          fill
                          sizes="(min-width: 768px) 240px, 33vw"
                          className="object-cover opacity-80"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#contact"
                  onClick={() => setActive(null)}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  Lancer un projet similaire
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {label}
      </p>
      <p className="mt-1.5 leading-relaxed text-muted-foreground">{text}</p>
    </div>
  )
}
