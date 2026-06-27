'use client'

import { useState, type FormEvent } from 'react'
import { Phone, Mail, MessageCircle, Check } from 'lucide-react'
import {
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  YoutubeIcon,
} from '@/components/social-icons'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import type { ContactInfo } from '@/lib/types'

const PROJECT_TYPES = [
  'Création de contenu vidéo',
  'Community Management',
  'Couverture d’événement',
  'Stratégie de contenu',
  'Accompagnement de marque',
  'Autre',
]

type ContactProps = {
  contact: ContactInfo
}

export function Contact({ contact }: ContactProps) {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const firstName = String(formData.get('firstName') || '')
    const name = String(formData.get('name') || '')
    const email = String(formData.get('email') || '')
    const phone = String(formData.get('phone') || '')
    const type = String(formData.get('type') || '')
    const message = String(formData.get('message') || '')

    const subject = encodeURIComponent(`Nouvelle demande portfolio - ${type}`)
    const body = encodeURIComponent(
      `Prénom: ${firstName}\nNom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\nType de projet: ${type}\n\nMessage:\n${message}`,
    )

    setSent(true)
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
    form.reset()
    setTimeout(() => setSent(false), 5000)
  }

  const whatsappLink = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
    'Bonjour Emmanuel, je souhaite discuter de mon projet.',
  )}`

  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Contact"
        title="Donnons vie à votre projet"
        description="Parlez-moi de votre idée, de vos objectifs et de votre audience. Je vous réponds rapidement."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <ContactItem
              icon={Phone}
              label="Téléphone"
              value={contact.phone}
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
            />
            <ContactItem
              icon={Mail}
              label="Email"
              value={contact.email}
              href={`mailto:${contact.email}`}
            />
            <ContactItem
              icon={MessageCircle}
              label="WhatsApp"
              value="Discutons en direct"
              href={whatsappLink}
            />
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Réseaux sociaux
            </p>
            <div className="flex gap-3">
              {[
                { icon: InstagramIcon, href: contact.instagram, label: 'Instagram' },
                { icon: TiktokIcon, href: contact.tiktok, label: 'TikTok' },
                { icon: LinkedinIcon, href: contact.linkedin, label: 'LinkedIn' },
                { icon: YoutubeIcon, href: contact.youtube, label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <MessageCircle className="size-5" />
            Discutons de votre projet
          </a>
        </div>

        <Reveal className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border bg-card p-6 md:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Prénom"
                name="firstName"
                placeholder="Votre prénom"
                required
              />
              <Field label="Nom" name="name" placeholder="Votre nom" required />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="vous@email.com"
                required
              />
              <Field
                label="Téléphone"
                name="phone"
                type="tel"
                placeholder="+229 ..."
                required
              />
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label
                  htmlFor="type"
                  className="text-sm font-medium text-foreground"
                >
                  Type de projet
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                >
                  {PROJECT_TYPES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-foreground"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Décrivez votre projet, vos objectifs et votre échéance..."
                className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              {sent ? (
                <>
                  <Check className="size-4" /> Message envoyé
                </>
              ) : (
                'Envoyer ma demande'
              )}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
              {sent ? 'Votre application email va préparer la demande.' : ''}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone
  label: string
  value: string
  href: string
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="block font-medium text-foreground">{value}</span>
      </span>
    </a>
  )
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
      />
    </div>
  )
}
