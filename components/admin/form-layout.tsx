'use client'

import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Bloc logique à l'intérieur d'une rubrique */
export function FormGroup({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="border-b border-border/60 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

/** Grille 2 colonnes sur écran moyen+ */
export function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>
}

/** Carte d'un élément de liste (projet, service, témoignage…) */
export function ItemCard({
  index,
  title,
  subtitle,
  onDelete,
  children,
}: {
  index?: number
  title: string
  subtitle?: string
  onDelete: () => void
  children: React.ReactNode
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-background/50">
      <header className="flex items-start justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3">
        <div className="min-w-0">
          {index !== undefined && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Élément {index + 1}
            </p>
          )}
          <h4 className="truncate font-medium text-foreground">{title || 'Sans titre'}</h4>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Supprimer"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </button>
      </header>
      <div className="space-y-5 p-4">{children}</div>
    </article>
  )
}

/** Conteneur principal d'une rubrique */
export function Rubric({
  hint,
  children,
  onAdd,
  addLabel = 'Ajouter',
}: {
  hint?: string
  children: React.ReactNode
  onAdd?: () => void
  addLabel?: string
}) {
  return (
    <div className="space-y-6">
      {hint && (
        <p className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      <div className="space-y-6">{children}</div>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          + {addLabel}
        </button>
      )}
    </div>
  )
}

/** Liste de commentaires groupée par statut */
export function CommentGroup({
  title,
  count,
  children,
}: {
  title: string
  count: number
  children: React.ReactNode
}) {
  if (count === 0) return null
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {title} ({count})
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
