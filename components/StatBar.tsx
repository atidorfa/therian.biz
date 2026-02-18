'use client'

import { useEffect, useState } from 'react'

interface Props {
  label: string
  value: number
  maxValue?: number
  color?: string
  icon?: string
  delta?: number
}

const STAT_COLORS: Record<string, string> = {
  vitality: 'from-emerald-600 to-emerald-400',
  agility:  'from-amber-600  to-amber-400',
  instinct: 'from-blue-600   to-blue-400',
  charisma: 'from-pink-600   to-pink-400',
}

export default function StatBar({ label, value, maxValue = 100, color, icon, delta }: Props) {
  const [displayed, setDisplayed] = useState(0)
  const pct = Math.min(100, (displayed / maxValue) * 100)
  const colorClass = color ? STAT_COLORS[color] ?? 'from-purple-600 to-purple-400' : 'from-purple-600 to-purple-400'

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(value), 100)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-[#8B84B0]">
          {icon && <span>{icon}</span>}
          {label}
        </span>
        <span className="font-mono font-bold text-white flex items-center gap-1">
          {value}
          {delta !== undefined && delta > 0 && (
            <span className="text-xs text-emerald-400 animate-bounce">+{delta}</span>
          )}
        </span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
