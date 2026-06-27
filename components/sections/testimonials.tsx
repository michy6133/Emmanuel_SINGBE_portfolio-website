'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Check, Send } from 'lucide-react'
import Image from 'next/image'
import { SectionHeading } from '@/components/section-heading'
import type { Comment, Testimonial } from '@/lib/types'

type DisplayItem = {
  id: string
  name: string
  role: string
  company: string
  photo: string
  text: string
}

type TestimonialsProps = {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [approvedComments, setApprovedComments] = useState<Comment[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    fetch('/api/comments')
      .then((res) => res.json())
      .then((data) => setApprovedComments(data))
      .catch(() => {})
  }, [])

  const allItems: DisplayItem[] = [
    ...testimonials.map((t, i) => ({
      id: `static-${i}`,
      name: t.name,
      role: t.role,
      company: t.company,
      photo: t.photo,
      text: t.text,
    })),
    ...approvedComments.map((c) => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName.charAt(0)}.`,
      role: c.role || 'Client',
      company: c.company || '',
      photo: '/placeholder.svg',
      text: c.text,
    })),
  ]

  const paginate = (d: number) => {
    setDir(d)
    setIndex((prev) => (prev + d + allItems.length) % allItems.length)
  }

  const t = allItems[index] || allItems[0]

  const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    setSubmitMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          company: formData.get('company'),
          role: formData.get('role'),
          text: formData.get('text'),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || 'Erreur lors de l\'envoi.')
        return
      }

      setSubmitMessage(data.message)
      form.reset()
    } catch {
      setSubmitError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!t) return null

  return (
    <section id="testimonials" className="border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-4xl px-5 py-24 md:px-8 md:py-32">
        <SectionHeading
          eyebrow="Témoignages"
          title="Ils me font confiance"
          align="center"
        />

        <div className="relative mt-14 min-h-[280px]">
          <Quote className="mx-auto mb-6 size-10 text-primary/50" />
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={t.id}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <blockquote className="text-balance text-lg font-medium leading-relaxed text-foreground md:text-2xl">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex flex-col items-center gap-3">
                <Image
                  src={t.photo || '/placeholder.svg'}
                  alt={t.name}
                  width={64}
                  height={64}
                  className="size-16 rounded-full border border-border object-cover"
                />
                <div>
                  <p className="font-heading font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.role}
                    {t.company ? ` · ${t.company}` : ''}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Témoignage précédent"
            onClick={() => paginate(-1)}
            className="flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="flex gap-2">
            {allItems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Aller au témoignage ${i + 1}`}
                onClick={() => {
                  setDir(i > index ? 1 : -1)
                  setIndex(i)
                }}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-8 bg-primary' : 'w-2 bg-border'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Témoignage suivant"
            onClick={() => paginate(1)}
            className="flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Formulaire de commentaire */}
        <div className="mt-20 rounded-3xl border border-border bg-card p-6 md:p-8">
          <h3 className="font-heading text-xl font-bold">Laisser un commentaire</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Votre avis sera publié après validation par Emmanuel.
          </p>

          <form onSubmit={handleCommentSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <CommentField label="Prénom" name="firstName" required />
            <CommentField label="Nom" name="lastName" required />
            <CommentField label="Email" name="email" type="email" required />
            <CommentField label="Entreprise" name="company" />
            <CommentField label="Fonction" name="role" />
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="comment-text" className="text-sm font-medium">
                Votre message
              </label>
              <textarea
                id="comment-text"
                name="text"
                rows={4}
                required
                minLength={20}
                placeholder="Partagez votre expérience de collaboration..."
                className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {submitting ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    <Send className="size-4" />
                    Envoyer mon commentaire
                  </>
                )}
              </button>
              {submitMessage && (
                <p className="mt-3 flex items-center gap-2 text-sm text-primary">
                  <Check className="size-4" />
                  {submitMessage}
                </p>
              )}
              {submitError && (
                <p className="mt-3 text-sm text-destructive">{submitError}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

function CommentField({
  label,
  name,
  type = 'text',
  required,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </div>
  )
}
