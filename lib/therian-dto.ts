import type { Therian } from '@prisma/client'
import { getSpeciesById } from './catalogs/species'
import { getTraitById } from './catalogs/traits'
import { getPaletteById } from './catalogs/appearance'
import type { TherianStats, TherianAppearance, Rarity } from './generation/engine'

const COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24 horas

function xpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

export function toTherianDTO(therian: Therian) {
  const stats: TherianStats = JSON.parse(therian.stats)
  const appearance: TherianAppearance = JSON.parse(therian.appearance)
  const species = getSpeciesById(therian.speciesId)
  const trait = getTraitById(therian.traitId)
  const palette = getPaletteById(appearance.palette)

  const now = Date.now()
  const lastActionAt = therian.lastActionAt
  const canAct = !lastActionAt || (now - new Date(lastActionAt).getTime() > COOLDOWN_MS)
  const nextActionAt = lastActionAt
    ? new Date(new Date(lastActionAt).getTime() + COOLDOWN_MS).toISOString()
    : null

  return {
    id: therian.id,
    species: species
      ? { id: species.id, name: species.name, emoji: species.emoji, lore: species.lore }
      : { id: therian.speciesId, name: therian.speciesId, emoji: '?', lore: '' },
    rarity: therian.rarity as Rarity,
    trait: trait
      ? { id: trait.id, name: trait.name, lore: trait.lore }
      : { id: therian.traitId, name: therian.traitId, lore: '' },
    appearance: {
      palette: appearance.palette,
      paletteColors: palette
        ? { primary: palette.primary, secondary: palette.secondary, accent: palette.accent }
        : { primary: '#888', secondary: '#555', accent: '#aaa' },
      eyes: appearance.eyes,
      pattern: appearance.pattern,
      signature: appearance.signature,
    },
    stats,
    level: therian.level,
    xp: therian.xp,
    xpToNext: xpToNextLevel(therian.level),
    lastActionAt: lastActionAt ? lastActionAt.toISOString() : null,
    canAct,
    nextActionAt,
    createdAt: therian.createdAt.toISOString(),
  }
}

export type TherianDTO = ReturnType<typeof toTherianDTO>
