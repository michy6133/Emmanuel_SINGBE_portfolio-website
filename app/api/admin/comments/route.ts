import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { deleteComment, getAllComments, updateCommentStatus } from '@/lib/server/db'
import { requireAdmin } from '@/lib/server/guard'
import type { CommentStatus } from '@/lib/types'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const comments = await getAllComments()
  return NextResponse.json(comments)
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id, status } = (await request.json()) as { id: string; status: CommentStatus }
    if (!id || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const updated = await updateCommentStatus(id, status)
    if (!updated) {
      return NextResponse.json({ error: 'Commentaire introuvable' }, { status: 404 })
    }

    revalidatePath('/', 'layout')
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 })
  }

  const deleted = await deleteComment(id)
  if (!deleted) {
    return NextResponse.json({ error: 'Commentaire introuvable' }, { status: 404 })
  }

  revalidatePath('/', 'layout')
  return NextResponse.json({ success: true })
}
