'use client'

import Image from 'next/image'
import { Plus, Trash2, ImageIcon, Film } from 'lucide-react'

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  hint,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  hint?: string
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  hint,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
  rows?: number
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  )
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

export function MediaPathField({
  label,
  value,
  onChange,
  kind = 'image',
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  kind?: 'image' | 'video'
  hint?: string
}) {
  const Icon = kind === 'video' ? Film : ImageIcon
  const defaultHint =
    kind === 'video'
      ? 'Chemin vers une vidéo dans /public (ex: /videos/projet.mp4). Laissez vide pour afficher uniquement l’image.'
      : 'Chemin vers une image dans /public (ex: /work-event.png)'

  return (
    <div className="space-y-2">
      <Field
        label={label}
        value={value}
        onChange={onChange}
        placeholder={kind === 'video' ? '/videos/mon-projet.mp4' : '/mon-image.png'}
        hint={hint ?? defaultHint}
      />
      {value && kind === 'image' && (
        <div className="relative h-28 w-full overflow-hidden rounded-lg border border-border bg-muted/30">
          <Image
            src={value}
            alt="Aperçu"
            fill
            sizes="320px"
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}
      {value && kind === 'video' && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <Icon className="size-4 shrink-0 text-primary" />
          <span className="truncate">{value}</span>
        </div>
      )}
    </div>
  )
}

export function StringListField({
  label,
  values,
  onChange,
  placeholder = '/image.png',
  hint,
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  hint?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...values, ''])}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <Plus className="size-3" /> Ajouter
        </button>
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      <div className="space-y-2">
        {values.length === 0 && (
          <p className="text-xs text-muted-foreground italic">Aucun élément — cliquez sur Ajouter.</p>
        )}
        {values.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...values]
                next[i] = e.target.value
                onChange(next)
              }}
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {item && (
              <div className="relative hidden h-10 w-14 shrink-0 overflow-hidden rounded border border-border sm:block">
                <Image src={item} alt="" fill sizes="56px" className="object-cover" />
              </div>
            )}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              aria-label="Supprimer"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TextListField({
  label,
  values,
  onChange,
  hint,
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  hint?: string
}) {
  return (
    <StringListField
      label={label}
      values={values}
      onChange={onChange}
      placeholder="Paragraphe de texte..."
      hint={hint}
    />
  )
}

export function SkillsField({
  label,
  values,
  onChange,
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
}) {
  return (
    <StringListField
      label={label}
      values={values}
      onChange={onChange}
      placeholder="Compétence"
      hint="Badges affichés sous chaque formation (ex: Montage, Storytelling)."
    />
  )
}

export const PROJECT_CATEGORIES = [
  'Vidéo',
  'Community Management',
  'Événementiel',
  'Marques',
] as const
