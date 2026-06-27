'use client'

import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import Image from 'next/image'
import { SectionHeading } from '@/components/section-heading'
import type { Certification } from '@/lib/types'

type CertificationsProps = {
  certifications: Certification[]
}

export function Certifications({ certifications }: CertificationsProps) {
  return (
    <section
      id="certifications"
      className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32"
    >
      <SectionHeading
        eyebrow="Formations & Certifications"
        title="Un parcours en constante évolution"
        description="Une expertise nourrie par des formations reconnues et une exigence permanente."
      />

      <div className="relative mt-14">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2" />

        <div className="space-y-10">
          {certifications.map((cert, i) => {
            const isRight = i % 2 === 1
            return (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className={`relative flex items-start gap-6 md:w-1/2 ${
                  isRight ? 'md:ml-auto md:flex-row' : 'md:flex-row-reverse md:text-right'
                }`}
              >
                {/* Node */}
                <div
                  className={`absolute z-10 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/50 bg-card text-primary ${
                    isRight ? 'left-0 md:-left-5' : 'left-0 md:-right-5 md:left-auto'
                  }`}
                >
                  {cert.logo ? (
                    <Image
                      src={cert.logo}
                      alt={`Logo ${cert.org}`}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Award className="size-5" />
                  )}
                </div>

                <div
                  className={`ml-16 flex-1 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40 md:ml-0 ${
                    isRight ? 'md:ml-10' : 'md:mr-10'
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {cert.year} · {cert.org}
                  </span>
                  <h3 className="mt-2 font-heading text-lg font-semibold">
                    {cert.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {cert.description}
                  </p>
                  <div
                    className={`mt-4 flex flex-wrap gap-2 ${
                      isRight ? '' : 'md:justify-end'
                    }`}
                  >
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
