'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import type { AboutContent } from '@/lib/types'

type AboutProps = {
  content: AboutContent
}

export function About({ content }: AboutProps) {
  const [open, setOpen] = useState(false)

  return (
    <section
      id="about"
      className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border">
            <Image
              src={content.portraitImage}
              alt="Portrait professionnel d'Emmanuel SINGBE"
              width={960}
              height={1200}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          <div className="absolute -bottom-5 -right-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-xl md:-right-6">
            <p className="font-heading text-2xl font-bold text-primary">
              {content.experienceValue}
            </p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {content.experienceLabel}
            </p>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />À propos
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              {content.title}
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
              {content.description}
            </p>
          </Reveal>

          <Reveal delay={3}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary"
            >
              Découvrir mon parcours
              <motion.span animate={{ rotate: open ? 180 : 0 }}>
                <ChevronDown className="size-4" />
              </motion.span>
            </button>
          </Reveal>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="mt-6 space-y-4 border-l-2 border-primary/40 pl-6 text-sm leading-relaxed text-muted-foreground">
                  {content.extendedBio.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
