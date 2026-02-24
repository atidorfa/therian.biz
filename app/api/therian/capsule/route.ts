import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({ therianId: z.string() })

export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }

  let body
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  const userId = session.user.id

  const therian = await db.therian.findFirst({
    where: { id: body.therianId, userId, status: 'active' },
  })
  if (!therian) {
    return NextResponse.json({ error: 'THERIAN_NOT_FOUND' }, { status: 404 })
  }

  // Must keep at least 1 active therian
  const activeCount = await db.therian.count({ where: { userId, status: 'active' } })
  if (activeCount <= 1) {
    return NextResponse.json({ error: 'LAST_ACTIVE_THERIAN' }, { status: 400 })
  }

  await db.therian.update({
    where: { id: therian.id },
    data: { status: 'capsule' },
  })

  return NextResponse.json({ success: true })
}
