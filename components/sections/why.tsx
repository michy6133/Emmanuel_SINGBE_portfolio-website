'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Zap, Target, Layers } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import type { WhyItem } from '@/lib/types'

const icons = [Lightbulb, Zap, Target, Layers]

type WhyProps = {
  items: WhyItem[]
}

export function Why({ items }: WhyProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Pourquoi travailler avec moi"
        title="Une approche pensée pour vos résultats"
        description="Bien plus qu’un prestataire, un véritable partenaire créatif au service de votre visibilité."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = icons[i]
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40"
            >
              <div className="absolute -right-10 -top-10 size-28 rounded-full bg-primary/5 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
              <div className="mb-6 inline-flex size-12 items-center justify-center rounded-xl border border-border bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-6" />
              </div>
              <h3 className="font-heading text-xl font-semibold">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
