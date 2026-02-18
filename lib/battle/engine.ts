import { createHmac } from 'crypto'
import seedrandom from 'seedrandom'

export interface BattleRound {
  attacker: 'challenger' | 'target'
  evaded: boolean
  critical: boolean
  damage: number
  challengerHp: number
  targetHp: number
}

export interface BattleResult {
  rounds: BattleRound[]
  winner: 'challenger' | 'target'
  challengerFinalHp: number
  targetFinalHp: number
}

export interface Combatant {
  id: string
  name: string
  stats: { vitality: number; agility: number; instinct: number; charisma: number }
  rarity: string
}

const RARITY_BONUS: Record<string, number> = {
  COMMON: 1.0,
  RARE: 1.1,
  EPIC: 1.2,
  LEGENDARY: 1.35,
}

function getRarityBonus(rarity: string): number {
  return RARITY_BONUS[rarity] ?? 1.0
}

export function calculateBattle(
  challenger: Combatant,
  target: Combatant,
  serverSecret: string,
  timestamp: number,
): BattleResult {
  // Deterministic seed
  const seed = createHmac('sha256', serverSecret)
    .update(`battle:${challenger.id}:${target.id}:${timestamp}`)
    .digest('hex')

  const rng = seedrandom(seed)
  const range = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

  let challengerHp = challenger.stats.vitality
  let targetHp = target.stats.vitality

  const rounds: BattleRound[] = []
  const MAX_ROUNDS = 40

  // Determine who attacks first each round (higher agility goes first)
  // We alternate: every even round challenger attacks first, odd round target attacks first
  // but if agility differs by > 5, faster always goes first
  const chalFaster = challenger.stats.agility > target.stats.agility + 5
  const targFaster = target.stats.agility > challenger.stats.agility + 5

  let roundNum = 0
  while (challengerHp > 0 && targetHp > 0 && roundNum < MAX_ROUNDS) {
    // Determine attacker for this round
    let attacker: 'challenger' | 'target'
    if (chalFaster) {
      attacker = 'challenger'
    } else if (targFaster) {
      attacker = 'target'
    } else {
      // Alternate, starting with challenger
      attacker = roundNum % 2 === 0 ? 'challenger' : 'target'
    }

    const atk = attacker === 'challenger' ? challenger : target
    const def = attacker === 'challenger' ? target : challenger

    // Evasion chance: defender.agility / 350 (max ~28% at agility=100)
    const evadeChance = def.stats.agility / 350
    const evaded = rng() < evadeChance

    // Critical hit: attacker.instinct / 250 (max ~40% at instinct=100)
    const critChance = atk.stats.instinct / 250
    const critical = rng() < critChance

    // Damage calculation
    const baseDamage = 4 + range(1, 6) // 5-10
    const charismaMod = 1 + (atk.stats.charisma - 50) / 200 // ±25%
    const rarityBonus = getRarityBonus(atk.rarity)
    const critMult = critical ? 2 : 1

    const damage = evaded
      ? 0
      : Math.round(baseDamage * charismaMod * rarityBonus * critMult)

    // Apply damage
    if (attacker === 'challenger') {
      targetHp = Math.max(0, targetHp - damage)
    } else {
      challengerHp = Math.max(0, challengerHp - damage)
    }

    rounds.push({
      attacker,
      evaded,
      critical,
      damage,
      challengerHp,
      targetHp,
    })

    roundNum++
  }

  // Determine winner
  let winner: 'challenger' | 'target'
  if (challengerHp <= 0 && targetHp <= 0) {
    winner = 'challenger' // tie goes to challenger (home advantage)
  } else if (targetHp <= 0) {
    winner = 'challenger'
  } else if (challengerHp <= 0) {
    winner = 'target'
  } else {
    // Max rounds reached — higher HP wins; tie → challenger
    winner = challengerHp >= targetHp ? 'challenger' : 'target'
  }

  return {
    rounds,
    winner,
    challengerFinalHp: challengerHp,
    targetFinalHp: targetHp,
  }
}
