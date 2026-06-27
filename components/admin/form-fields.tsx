'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, ImageIcon, Film, Upload, Loader2, X } from 'lucide-react'

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

async function uploadMedia(file: File, kind: 'image' | 'video'): Promise<string> {
  const configRes = await fetch('/api/admin/upload', { credentials: 'same-origin' })
  if (!configRes.ok) {
    const errData = await configRes.json().catch(() => ({}))
    throw new Error(errData.error || `Erreur d’authentification (status ${configRes.status}).`)
  }
  const config = (await configRes.json()) as { mode?: 'blob' | 'local'; token?: string }

  if (config.mode === 'blob') {
    const { upload } = await import('@vercel/blob/client')
    const pathname = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]+/g, '-')}`
    const blob = await upload(pathname, file, {
      access: 'public',
      handleUploadUrl: `/api/admin/upload?token=${config.token || ''}`,
      clientPayload: JSON.stringify({ kind }),
    })
    return blob.url
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('kind', kind)

  const res = await fetch(`/api/admin/upload?token=${config.token || ''}`, {
    method: 'POST',
    credentials: 'same-origin',
    body: formData,
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Échec de l’upload.')
  }

  return data.url as string
}

function UploadButton({
  kind,
  uploading,
  onClick,
  label,
}: {
  kind: 'image' | 'video'
  uploading: boolean
  onClick: () => void
  label?: string
}) {
  const Icon = kind === 'video' ? Film : ImageIcon
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={uploading}
      className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 disabled:opacity-60"
    >
      {uploading ? (
        <Loader2 className="size-4 animate-spin text-primary" />
      ) : (
        <Upload className="size-4 text-primary" />
      )}
      {uploading ? 'Envoi en cours...' : label ?? (kind === 'video' ? 'Choisir une vidéo' : 'Choisir une image')}
    </button>
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
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const accept =
    kind === 'video'
      ? 'video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov'
      : 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg'

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadMedia(file, kind)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur upload.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value && kind === 'image' && (
        <div className="relative h-36 w-full overflow-hidden rounded-lg border border-border bg-muted/30">
          <Image
            src={value}
            alt="Aperçu"
            fill
            sizes="400px"
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Retirer l'image"
            className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow hover:text-destructive"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {value && kind === 'video' && (
        <div className="space-y-2">
          <video
            src={value}
            controls
            playsInline
            className="max-h-48 w-full rounded-lg border border-border bg-black"
          />
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            <Film className="size-4 shrink-0 text-primary" />
            <span className="truncate">{value}</span>
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label="Retirer la vidéo"
              className="ml-auto text-muted-foreground hover:text-destructive"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <UploadButton
          kind={kind}
          uploading={uploading}
          onClick={() => inputRef.current?.click()}
          label={value ? (kind === 'video' ? 'Changer la vidéo' : 'Changer l’image') : undefined}
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
      {hint && !error && (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      )}
      {!hint && !error && (
        <p className="text-[11px] text-muted-foreground">
          {kind === 'video'
            ? 'MP4, WebM ou MOV — max 100 Mo.'
            : 'JPG, PNG, WebP, GIF ou SVG — max 10 Mo.'}
        </p>
      )}
    </div>
  )
}

function GalleryItemUpload({
  value,
  onChange,
  onRemove,
}: {
  value: string
  onChange: (url: string) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const pick = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadMedia(file, 'image')
      onChange(url)
    } catch {
      // ignore — parent could show toast later
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background/50 p-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {value ? (
        <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border">
          <Image src={value} alt="" fill sizes="56px" className="object-cover" />
        </div>
      ) : (
        <div className="flex size-14 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted/20">
          {uploading ? (
            <Loader2 className="size-4 animate-spin text-primary" />
          ) : (
            <ImageIcon className="size-4 text-muted-foreground" />
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        {value ? (
          <p className="truncate text-xs text-muted-foreground">{value.split('/').pop()}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Aucune image</p>
        )}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="mt-1 text-xs font-medium text-primary hover:underline disabled:opacity-60"
        >
          {value ? 'Remplacer' : 'Choisir un fichier'}
        </button>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Supprimer"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

export function StringListField({
  label,
  values,
  onChange,
  hint,
  uploadImages = false,
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  hint?: string
  uploadImages?: boolean
}) {
  const batchRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const addEmpty = () => onChange([...values, ''])

  const uploadBatch = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    const urls: string[] = []
    try {
      for (const file of Array.from(files)) {
        const url = await uploadMedia(file, 'image')
        urls.push(url)
      }
      onChange([...values.filter(Boolean), ...urls])
    } finally {
      setUploading(false)
      if (batchRef.current) batchRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="flex gap-2">
          {uploadImages && (
            <>
              <input
                ref={batchRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                multiple
                className="hidden"
                onChange={(e) => uploadBatch(e.target.files)}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => batchRef.current?.click()}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-60"
              >
                {uploading ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />}
                Importer
              </button>
            </>
          )}
          <button
            type="button"
            onClick={addEmpty}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="size-3" /> Ajouter
          </button>
        </div>
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      <div className="space-y-2">
        {values.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            {uploadImages
              ? 'Cliquez sur Importer pour choisir des images sur votre appareil.'
              : 'Aucun élément — cliquez sur Ajouter.'}
          </p>
        )}
        {uploadImages
          ? values.map((item, i) => (
              <GalleryItemUpload
                key={`${i}-${item}`}
                value={item}
                onChange={(url) => {
                  const next = [...values]
                  next[i] = url
                  onChange(next)
                }}
                onRemove={() => onChange(values.filter((_, j) => j !== i))}
              />
            ))
          : values.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => {
                    const next = [...values]
                    next[i] = e.target.value
                    onChange(next)
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
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
