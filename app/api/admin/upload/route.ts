import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated, createUploadToken, verifyUploadToken } from '@/lib/server/auth'
import { isBlobStorageEnabled } from '@/lib/server/blob-storage'
import { requireAdmin } from '@/lib/server/guard'
import {
  IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  VIDEO_MIME_TYPES,
  saveUploadedFile,
  type UploadKind,
} from '@/lib/server/upload'

export const maxDuration = 60

function parseUploadKind(clientPayload: string | null | undefined): UploadKind {
  if (!clientPayload) return 'image'
  try {
    const parsed = JSON.parse(clientPayload) as { kind?: UploadKind }
    return parsed.kind === 'video' ? 'video' : 'image'
  } catch {
    return clientPayload === 'video' ? 'video' : 'image'
  }
}

async function isUploadAuthorized(request: Request): Promise<boolean> {
  const ok = await isAdminAuthenticated()
  if (ok) return true

  const url = new URL(request.url)
  const token = url.searchParams.get('token') || request.headers.get('x-upload-token')
  if (token) {
    return verifyUploadToken(token)
  }
  return false
}

async function handleBlobClientUpload(request: Request) {
  const body = (await request.json()) as HandleUploadBody

  const jsonResponse = await handleUpload({
    body,
    request,

    onBeforeGenerateToken: async (_pathname, clientPayload) => {
      const ok = await isUploadAuthorized(request)
      if (!ok) {
        throw new Error('Authentification requise')
      }

      const kind = parseUploadKind(clientPayload)

      return {
        allowedContentTypes:
          kind === 'image'
            ? [...IMAGE_MIME_TYPES]
            : [...VIDEO_MIME_TYPES],
        maximumSizeInBytes:
          kind === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ kind }),
      }
    },

    onUploadCompleted: async ({ blob, tokenPayload }) => {
      // Optionnel : logs ou persistance en base
      const parsed = tokenPayload ? JSON.parse(tokenPayload) : null

      console.log('Upload terminé:', {
        blob,
        kind: parsed?.kind,
      })

      // Ici tu peux ajouter :
      // - insertion DB
      // - update utilisateur
      // - notification
    },
  })

  return NextResponse.json(jsonResponse)
}

async function handleLocalFormUpload(request: Request) {
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
  const ok = await isAdminAuthenticated()
  if (!ok) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }

  const token = createUploadToken()
  return NextResponse.json({
    mode: isBlobStorageEnabled() || process.env.VERCEL ? 'blob' : 'local',
    token,
  })
}

export async function POST(request: Request) {
  const authorized = await isUploadAuthorized(request)
  if (!authorized) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }

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
    console.error('Error in POST /api/admin/upload:', error)
    const message =
      error instanceof Error ? error.message : 'Erreur lors de l’upload.'
    const status = message === 'Authentification requise' ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
