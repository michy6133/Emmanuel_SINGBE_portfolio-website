import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/server/guard'
import { saveUploadedFile, type UploadKind } from '@/lib/server/upload'

export async function POST(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const kind = (formData.get('kind') as UploadKind) || 'image'

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Aucun fichier reçu.' }, { status: 400 })
    }

    if (kind !== 'image' && kind !== 'video') {
      return NextResponse.json({ error: 'Type de média invalide.' }, { status: 400 })
    }

    const result = await saveUploadedFile(file, kind)
    return NextResponse.json({ success: true, url: result.url, filename: result.filename })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de l’upload.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
