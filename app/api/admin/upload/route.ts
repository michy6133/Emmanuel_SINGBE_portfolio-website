import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/server/auth'
import { isBlobStorageEnabled } from '@/lib/server/blob-storage'
import { requireAdmin } from '@/lib/server/guard'
import {
  saveUploadedFile,
  type UploadKind,
} from '@/lib/server/upload'

export const maxDuration = 60

async function handleBlobClientUpload(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (_pathname, _clientPayload, _multipart) => {
      const ok = await isAdminAuthenticated()
      if (!ok) {
        throw new Error('Authentification requise')
      }
      return {
        allowedContentTypes: ['image/*', 'video/*'],
        maximumSizeInBytes: 1024 * 1024 * 10, // 10MB
        addRandomSuffix: true,
        cacheControlMaxAge: 60 * 60 * 24 * 30, // 30 jours
        validUntil: Date.now() + 60 * 60 * 24 * 30, // 30 jours
      }
    },
    onUploadCompleted: async () => {
      console.log('upload completed')
    },
  })

  return NextResponse.json(jsonResponse)
}

async function handleLocalFormUpload(request: Request): Promise<NextResponse> {
  if (process.env.VERCEL && !isBlobStorageEnabled()) {
    return NextResponse.json(
      {
        error:
          'Upload impossible sur Vercel sans Blob Store. Créez-en un dans Storage → Blob puis redéployez.',
      },
      { status: 503 },
    )
  }

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
}

export async function GET() {
  return NextResponse.json({
    mode: isBlobStorageEnabled() || process.env.VERCEL ? 'blob' : 'local',
  })
}

export async function POST(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const contentType = request.headers.get('content-type') ?? ''

  try {
    if (contentType.includes('application/json')) {
      if (!isBlobStorageEnabled()) {
        return NextResponse.json(
          {
            error:
              'Stockage Blob non configuré. Ajoutez BLOB_READ_WRITE_TOKEN (Storage → Blob sur Vercel).',
          },
          { status: 503 },
        )
      }
      return await handleBlobClientUpload(request)
    }

    return await handleLocalFormUpload(request)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de l'upload."
    const status = message === 'Authentification requise' ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}