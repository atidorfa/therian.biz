import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { generateTherian } from '@/lib/generation/engine'
import { toTherianDTO } from '@/lib/therian-dto'
import { assignUniqueName } from '@/lib/catalogs/names'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const existing = await db.therian.findUnique({
    where: { userId: session.user.id },
  })

  if (existing) {
    return NextResponse.json({ error: 'ALREADY_HAS_THERIAN' }, { status: 409 })
  }

  const secret = process.env.SERVER_SECRET ?? 'default-secret'
  const generated = generateTherian(session.user.id, secret)
  const uniqueName = await assignUniqueName(db)

  const therian = await db.therian.create({
    data: {
      userId:     session.user.id,
      speciesId:  generated.speciesId,
      rarity:     generated.rarity,
      seed:       generated.seed,
      appearance: JSON.stringify(generated.appearance),
      stats:      JSON.stringify(generated.stats),
      traitId:    generated.traitId,
      level:      1,
      xp:         0,
      name:       uniqueName,
    },
  })

  return NextResponse.json(toTherianDTO(therian), { status: 201 })
}
