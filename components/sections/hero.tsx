'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Play } from 'lucide-react'
import Image from 'next/image'
import type { HeroContent } from '@/lib/types'

type HeroProps = {
  content: HeroContent
}

export function Hero({ content }: HeroProps) {
  return (
    <section
      id="intro"
      className="relative flex min-h-screen items-center overflow-hidden bg-background"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-card/40" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pt-28 pb-16 md:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Texte descriptif */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-primary backdrop-blur"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            {content.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-heading text-5xl font-extrabold leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {content.titleLine1}
            <br />
            <span className="text-primary">{content.titleLine2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 text-base font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-lg"
          >
            {content.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <a
              href="#work"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              <Play className="size-4 fill-current" />
              Voir mes réalisations
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/30 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
            >
              Travaillons ensemble
            </a>
          </motion.div>
        </div>

        {/* Photo à droite */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border">
            <Image
              src={content.portraitImage}
              alt={`Portrait de ${content.titleLine1} ${content.titleLine2}`}
              width={960}
              height={1200}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          <div className="absolute -bottom-5 -left-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-xl md:-left-6">
            <p className="font-heading text-2xl font-bold text-primary">
              {content.experienceValue}
            </p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {content.experienceLabel}
            </p>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground"
        aria-label="Défiler vers le bas"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ArrowDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  )
}
