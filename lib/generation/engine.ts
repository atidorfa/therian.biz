import { createSeed, createRNG } from './prng'
import { SPECIES, getSpeciesById } from '../catalogs/species'
import { TRAITS, getTraitById } from '../catalogs/traits'
import { PALETTES, EYES, PATTERNS, SIGNATURES } from '../catalogs/appearance'

export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'

export interface TherianAppearance {
  palette: string
  eyes: string
  pattern: string
  signature: string
}

export interface TherianStats {
  vitality: number
  agility: number
  instinct: number
  charisma: number
}

export interface GeneratedTherian {
  seed: string
  timestamp: number
  rarity: Rarity
  speciesId: string
  traitId: string
  stats: TherianStats
  appearance: TherianAppearance
}

const RARITY_WEIGHTS = [
  { value: 'COMMON' as Rarity,    weight: 70 },
  { value: 'RARE' as Rarity,      weight: 20 },
  { value: 'EPIC' as Rarity,      weight:  9 },
  { value: 'LEGENDARY' as Rarity, weight:  1 },
]

const RARITY_BONUS: Record<Rarity, number> = {
  COMMON: 0,
  RARE: 5,
  EPIC: 12,
  LEGENDARY: 25,
}

function clamp(value: number, min = 1, max = 100): number {
  return Math.min(max, Math.max(min, Math.round(value)))
}

export function generateTherian(userId: string, secret: string): GeneratedTherian {
  const timestamp = Date.now()
  const seed = createSeed(userId, timestamp, secret)
  const rng = createRNG(seed)

  // 1. Rareza
  const rarity = rng.weighted(RARITY_WEIGHTS)

  // 2. Especie
  const species = rng.choice(SPECIES)

  // 3. Trait
  const trait = rng.choice(TRAITS)

  // 4. Stats
  const rarityBonus = RARITY_BONUS[rarity]
  const base = 50

  const stats: TherianStats = {
    vitality: clamp(base + rng.range(-10, 10) + species.bias.vitality + trait.mod.vitality + rarityBonus),
    agility:  clamp(base + rng.range(-10, 10) + species.bias.agility  + trait.mod.agility  + rarityBonus),
    instinct: clamp(base + rng.range(-10, 10) + species.bias.instinct + trait.mod.instinct + rarityBonus),
    charisma: clamp(base + rng.range(-10, 10) + species.bias.charisma + trait.mod.charisma + rarityBonus),
  }

  // 5. Apariencia
  const appearance: TherianAppearance = {
    palette:   rng.choice(PALETTES).id,
    eyes:      rng.choice(EYES).id,
    pattern:   rng.choice(PATTERNS).id,
    signature: rng.choice(SIGNATURES).id,
  }

  return { seed, timestamp, rarity, speciesId: species.id, traitId: trait.id, stats, appearance }
}

// Re-exportar para conveniencia
export { getSpeciesById, getTraitById }
