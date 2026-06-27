import { NextResponse } from 'next/server'
import { getSiteContent } from '@/lib/server/db'

export async function GET() {
  const content = await getSiteContent()
  return NextResponse.json(content)
}
