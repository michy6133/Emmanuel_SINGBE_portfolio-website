import { NextResponse } from 'next/server'
import { addComment, getApprovedComments } from '@/lib/server/db'

export async function GET() {
  const comments = await getApprovedComments()
  return NextResponse.json(comments)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, company, role, text } = body

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !text?.trim()) {
      return NextResponse.json(
        { error: 'Prénom, nom, email et message sont requis.' },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email invalide.' }, { status: 400 })
    }

    if (text.trim().length < 20) {
      return NextResponse.json(
        { error: 'Le message doit contenir au moins 20 caractères.' },
        { status: 400 },
      )
    }

    const comment = await addComment({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      company: (company || '').trim(),
      role: (role || '').trim(),
      text: text.trim(),
    })

    return NextResponse.json({
      success: true,
      message:
        'Merci ! Votre commentaire a été envoyé et sera visible après validation.',
      id: comment.id,
    })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
