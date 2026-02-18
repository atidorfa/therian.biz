'use client'

import React from 'react'

interface LeaderboardEntry {
  rank: number
  id: string
  name: string | null
  species: { id: string; name: string; emoji: string }
  rarity: string
  level: number
  bites: number
  appearance: {
    paletteColors: { primary: string; secondary: string; accent: string }
  }
}

interface Props {
  entries: LeaderboardEntry[]
  userRank: number | null
}

const RARITY_LABEL: Record<string, string> = {
  COMMON: 'Común',
  RARE: 'Raro',
  EPIC: 'Épico',
  LEGENDARY: 'Legendario',
}

const RARITY_COLOR: Record<string, string> = {
  COMMON: 'text-slate-400',
  RARE: 'text-blue-400',
  EPIC: 'text-purple-400',
  LEGENDARY: 'text-amber-400',
}

const RANK_MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function LeaderboardTable({ entries, userRank }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center text-[#8B84B0] italic py-8">
        Aún no hay batallas. ¡Sé el primero en morder!
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#13131F] px-4 py-3"
          style={{
            boxShadow: entry.rank <= 3 ? `0 0 16px ${entry.appearance.paletteColors.primary}22` : undefined,
          }}
        >
          {/* Rank */}
          <div className="w-8 text-center flex-shrink-0">
            {RANK_MEDAL[entry.rank] ?? (
              <span className="text-[#4A4468] font-mono text-sm">#{entry.rank}</span>
            )}
          </div>

          {/* Color accent bar */}
          <div
            className="w-1 h-10 rounded-full flex-shrink-0"
            style={{ background: entry.appearance.paletteColors.primary }}
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold truncate">{entry.name}</span>
              <span className={`text-xs font-semibold ${RARITY_COLOR[entry.rarity] ?? 'text-slate-400'}`}>
                {RARITY_LABEL[entry.rarity] ?? entry.rarity}
              </span>
            </div>
            <div className="text-[#8B84B0] text-xs">
              {entry.species.emoji} {entry.species.name} · Nv {entry.level}
            </div>
          </div>

          {/* Bites */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-white font-bold font-mono text-lg">{entry.bites}</span>
            <span className="text-base">🦷</span>
          </div>
        </div>
      ))}

      {/* User rank (if not in top list) */}
      {userRank !== null && userRank > entries.length && (
        <div className="text-center text-[#8B84B0] text-sm pt-2 italic">
          Tu posición global: <span className="text-white font-bold">#{userRank}</span>
        </div>
      )}
    </div>
  )
}
