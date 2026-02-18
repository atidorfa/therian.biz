import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { toTherianDTO } from '@/lib/therian-dto'
import { calculateBattle } from '@/lib/battle/engine'

const COOLDOWN_MS = 24 * 60 * 60 * 1000

const BodySchema = z.object({
  target_name: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 })
  }
  const { target_name } = parsed.data

  // Load challenger
  let challenger = await db.therian.findUnique({
    where: { userId: session.user.id },
  })
  if (!challenger) {
    return NextResponse.json({ error: 'NO_THERIAN' }, { status: 404 })
  }

  // Cooldown check
  if (challenger.lastBiteAt) {
    const elapsed = Date.now() - new Date(challenger.lastBiteAt).getTime()
    if (elapsed < COOLDOWN_MS) {
      const nextBiteAt = new Date(new Date(challenger.lastBiteAt).getTime() + COOLDOWN_MS).toISOString()
      return NextResponse.json({ error: 'COOLDOWN_ACTIVE', nextBiteAt }, { status: 429 })
    }
  }

  // Load target
  const target = await db.therian.findFirst({
    where: { name: { equals: target_name, mode: 'insensitive' } },
  })
  if (!target) {
    return NextResponse.json({ error: 'TARGET_NOT_FOUND' }, { status: 404 })
  }

  // Cannot bite own Therian
  if (target.id === challenger.id) {
    return NextResponse.json({ error: 'CANNOT_BITE_SELF' }, { status: 400 })
  }

  const secret = process.env.SERVER_SECRET ?? 'default-secret'
  const timestamp = Date.now()

  const challengerStats = JSON.parse(challenger.stats)
  const targetStats = JSON.parse(target.stats)

  const result = calculateBattle(
    { id: challenger.id, name: challenger.name ?? challenger.id, stats: challengerStats, rarity: challenger.rarity },
    { id: target.id, name: target.name ?? target.id, stats: targetStats, rarity: target.rarity },
    secret,
    timestamp,
  )

  const challengerWon = result.winner === 'challenger'

  // Persist in a transaction
  const [updatedChallenger, updatedTarget] = await db.$transaction(async (tx) => {
    await tx.battleLog.create({
      data: {
        challengerId: challenger!.id,
        targetId: target.id,
        winnerId: challengerWon ? challenger!.id : target.id,
        rounds: JSON.stringify(result.rounds),
      },
    })

    const uc = await tx.therian.update({
      where: { id: challenger!.id },
      data: {
        lastBiteAt: new Date(),
        bites: challengerWon ? { increment: 1 } : undefined,
      },
    })

    const ut = await tx.therian.update({
      where: { id: target.id },
      data: {
        bites: challengerWon ? undefined : { increment: 1 },
      },
    })

    return [uc, ut]
  })

  return NextResponse.json({
    battle: result,
    challenger: toTherianDTO(updatedChallenger),
    target: toTherianDTO(updatedTarget),
    biteAwarded: challengerWon,
  })
}
