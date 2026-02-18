import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { toTherianDTO } from '@/lib/therian-dto'

export async function GET() {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const therian = await db.therian.findUnique({
    where: { userId: session.user.id },
  })

  if (!therian) {
    return NextResponse.json({ error: 'NO_THERIAN' }, { status: 404 })
  }

  return NextResponse.json(toTherianDTO(therian))
}
