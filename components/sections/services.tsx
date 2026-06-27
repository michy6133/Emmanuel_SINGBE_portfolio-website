'use client'

import { motion } from 'framer-motion'
import { Video, Users, Camera, PenLine, Sparkles, ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import type { Service } from '@/lib/types'

const icons = [Video, Users, Camera, PenLine, Sparkles]

type ServicesProps = {
  services: Service[]
}

export function Services({ services }: ServicesProps) {
  return (
    <section
      id="services"
      className="border-y border-border/60 bg-card/30"
    >
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionHeading
          eyebrow="Services"
          title="Ce que je peux faire pour vous"
          description="Une offre complète pour développer votre visibilité et structurer votre présence digitale."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background p-7 transition-colors hover:border-primary/40"
              >
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-xl border border-border bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.text}
                </p>
              </motion.div>
            )
          })}

          {/* CTA card */}
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group flex flex-col justify-between rounded-2xl border border-primary/40 bg-primary p-7 text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <div>
              <p className="font-heading text-xl font-bold leading-snug">
                Un projet en tête ?
              </p>
              <p className="mt-3 text-sm leading-relaxed opacity-90">
                Discutons de vos besoins et construisons ensemble une stratégie
                de contenu sur mesure.
              </p>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
              Demander un devis
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
