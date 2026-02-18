'use client'

import { useState } from 'react'
import type { TherianDTO } from '@/lib/therian-dto'
import TherianAvatar from './TherianAvatar'
import StatBar from './StatBar'
import RarityBadge from './RarityBadge'
import DailyActionButtons from './DailyActionButtons'
import FlavorText from './FlavorText'

interface Props {
  therian: TherianDTO
}

const STAT_CONFIG = [
  { key: 'vitality' as const, label: 'Vitalidad', icon: '🌿', color: 'vitality' },
  { key: 'agility'  as const, label: 'Agilidad',  icon: '⚡', color: 'agility' },
  { key: 'instinct' as const, label: 'Instinto',  icon: '🌌', color: 'instinct' },
  { key: 'charisma' as const, label: 'Carisma',   icon: '✨', color: 'charisma' },
]

const RARITY_GLOW: Record<string, string> = {
  COMMON:    'border-white/10',
  RARE:      'border-blue-500/30 shadow-[0_0_30px_rgba(96,165,250,0.1)]',
  EPIC:      'border-purple-500/40 shadow-[0_0_40px_rgba(192,132,252,0.15)]',
  LEGENDARY: 'border-amber-500/50 shadow-[0_0_50px_rgba(252,211,77,0.2),0_0_100px_rgba(252,211,77,0.05)]',
}

export default function TherianCard({ therian: initialTherian }: Props) {
  const [therian, setTherian] = useState(initialTherian)
  const [narrative, setNarrative] = useState<string | null>(null)
  const [lastDelta, setLastDelta] = useState<{ stat: string; amount: number } | null>(null)
  const [levelUp, setLevelUp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAction = async (actionType: string) => {
    setError(null)
    setNarrative(null)
    setLastDelta(null)
    setLevelUp(false)

    try {
      const res = await fetch('/api/therian/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: actionType }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.message ?? 'Tu Therian necesita descansar.')
          setTherian(prev => ({ ...prev, canAct: false, nextActionAt: data.nextActionAt }))
        } else {
          setError('Algo salió mal. Intenta de nuevo.')
        }
        return
      }

      setTherian(data.therian)
      setNarrative(data.narrative)
      setLastDelta(data.delta)
      if (data.levelUp) setLevelUp(true)
    } catch {
      setError('Error de conexión.')
    }
  }

  const xpPct = Math.min(100, (therian.xp / therian.xpToNext) * 100)
  const glowClass = RARITY_GLOW[therian.rarity] ?? RARITY_GLOW.COMMON

  return (
    <div className={`
      relative rounded-2xl border bg-[#13131F] overflow-hidden
      ${glowClass} transition-shadow duration-500
    `}>
      {/* Fondo decorativo */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${therian.appearance.paletteColors.primary}, transparent 70%)`,
        }}
      />

      <div className="relative p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {therian.species.emoji} {therian.species.name}
            </h2>
            <p className="text-[#8B84B0] text-sm mt-0.5">Nivel {therian.level}</p>
          </div>
          <RarityBadge rarity={therian.rarity} />
        </div>

        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <TherianAvatar therian={therian} size={220} animated />
            {levelUp && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl animate-bounce">⬆️</span>
              </div>
            )}
          </div>
        </div>

        {/* Trait */}
        <div className="rounded-xl border border-white/5 bg-white/3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#8B84B0] text-xs uppercase tracking-widest">Arquetipo</span>
            <span className="text-white font-semibold text-sm">{therian.trait.name}</span>
          </div>
          <p className="text-[#A99DC0] italic text-sm mt-1">{therian.trait.lore}</p>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <h3 className="text-[#8B84B0] text-xs uppercase tracking-widest">Stats</h3>
          {STAT_CONFIG.map((cfg) => (
            <StatBar
              key={cfg.key}
              label={cfg.label}
              icon={cfg.icon}
              value={therian.stats[cfg.key]}
              color={cfg.color}
              delta={lastDelta?.stat === cfg.key ? lastDelta.amount : undefined}
            />
          ))}
        </div>

        {/* XP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[#8B84B0]">
            <span>XP</span>
            <span className="font-mono">{therian.xp} / {therian.xpToNext}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-700 to-purple-400 rounded-full transition-all duration-1000"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5"/>

        {/* Acciones */}
        <div className="space-y-3">
          <h3 className="text-[#8B84B0] text-xs uppercase tracking-widest">Acción del día</h3>
          <DailyActionButtons
            therian={therian}
            onAction={handleAction}
          />
        </div>

        {/* Narrativa */}
        {narrative && (
          <FlavorText text={narrative} key={narrative} />
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-red-300 text-sm text-center italic">
            {error}
          </div>
        )}

        {/* Level up */}
        {levelUp && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-amber-300 text-sm text-center">
            ✦ ¡Tu Therian alcanzó el nivel {therian.level}! ✦
          </div>
        )}
      </div>
    </div>
  )
}
