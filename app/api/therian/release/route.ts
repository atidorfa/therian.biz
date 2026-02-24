import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { toTherianDTO } from '@/lib/therian-dto'
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
    where: { id: body.therianId, userId, status: 'capsule' },
  })
  if (!therian) {
    return NextResponse.json({ error: 'THERIAN_NOT_FOUND' }, { status: 404 })
  }

  // Check active slot limit
  const user = await db.user.findUnique({ where: { id: userId }, select: { therianSlots: true } })
  const activeCount = await db.therian.count({ where: { userId, status: 'active' } })
  const slots = user?.therianSlots ?? 1

  if (activeCount >= slots) {
    return NextResponse.json({ error: 'SLOTS_FULL', slots }, { status: 400 })
  }

  const updated = await db.therian.update({
    where: { id: therian.id },
    data: { status: 'active' },
  })

  return NextResponse.json({ therian: toTherianDTO(updated) })
}
