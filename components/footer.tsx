'use client'

import { ArrowUp } from 'lucide-react'
import {
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  YoutubeIcon,
} from '@/components/social-icons'
import { NAV_LINKS, CONTACT } from '@/lib/data'

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <a
              href="#"
              className="font-heading text-lg font-bold uppercase tracking-[0.2em]"
            >
              Emmanuel<span className="text-primary"> SINGBE</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Vidéaste mobile, créateur de contenu et community manager. Je
              transforme vos idées en contenus qui marquent.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Navigation
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Suivez-moi
            </p>
            <div className="mt-4 flex gap-3">
              {[
                { icon: InstagramIcon, href: CONTACT.instagram, label: 'Instagram' },
                { icon: TiktokIcon, href: CONTACT.tiktok, label: 'TikTok' },
                { icon: LinkedinIcon, href: CONTACT.linkedin, label: 'LinkedIn' },
                { icon: YoutubeIcon, href: CONTACT.youtube, label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              {CONTACT.email}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Emmanuel SINGBE. Tous droits réservés.
          </p>
          <a
            href="https://mchy.cloud"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            by Mchy
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Retour en haut
            <ArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
