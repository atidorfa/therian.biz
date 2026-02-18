import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { toTherianDTO } from '@/lib/therian-dto'

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name')?.trim()

  if (!name) {
    return NextResponse.json({ error: 'MISSING_NAME' }, { status: 400 })
  }

  const therian = await db.therian.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  })

  if (!therian) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  return NextResponse.json(toTherianDTO(therian))
}
