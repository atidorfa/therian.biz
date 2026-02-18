'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { TherianDTO } from '@/lib/therian-dto'
import type { BattleResult } from '@/lib/battle/engine'
import BattleArena from '@/components/BattleArena'

type Phase = 'search' | 'preview' | 'fighting' | 'result'

export default function BitePage() {
  const [phase, setPhase] = useState<Phase>('search')
  const [searchInput, setSearchInput] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const [myTherian, setMyTherian] = useState<TherianDTO | null>(null)
  const [targetTherian, setTargetTherian] = useState<TherianDTO | null>(null)
  const [biting, setBiting] = useState(false)
  const [biteError, setBiteError] = useState<string | null>(null)

  const [battleResult, setBattleResult] = useState<BattleResult | null>(null)
  const [biteAwarded, setBiteAwarded] = useState<boolean | null>(null)
  const [updatedChallenger, setUpdatedChallenger] = useState<TherianDTO | null>(null)
  const [updatedTarget, setUpdatedTarget] = useState<TherianDTO | null>(null)
  const [cooldownInfo, setCooldownInfo] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = searchInput.trim()
    if (!name) return
    setSearching(true)
    setSearchError(null)
    setTargetTherian(null)

    try {
      // Fetch own therian + target in parallel
      const [meRes, targetRes] = await Promise.all([
        fetch('/api/therian'),
        fetch(`/api/therians/search?name=${encodeURIComponent(name)}`),
      ])

      if (!meRes.ok) {
        setSearchError('No tienes un Therian. Primero adopta uno.')
        setSearching(false)
        return
      }
      const me: TherianDTO = await meRes.json()
      setMyTherian(me)

      // Check cooldown
      if (!me.canBite && me.nextBiteAt) {
        const nextBite = new Date(me.nextBiteAt)
        const diff = Math.max(0, nextBite.getTime() - Date.now())
        const hours = Math.floor(diff / 3600000)
        const mins  = Math.floor((diff % 3600000) / 60000)
        setCooldownInfo(`Tu próxima mordida disponible en ${hours}h ${mins}m`)
      } else {
        setCooldownInfo(null)
      }

      if (!targetRes.ok) {
        if (targetRes.status === 404) setSearchError(`No se encontró ningún Therian llamado "${name}".`)
        else setSearchError('Error al buscar el Therian.')
        setSearching(false)
        return
      }

      const tgt: TherianDTO = await targetRes.json()
      setTargetTherian(tgt)
      setPhase('preview')
    } catch {
      setSearchError('Error de conexión.')
    } finally {
      setSearching(false)
    }
  }

  const handleBite = async () => {
    if (!targetTherian) return
    setBiting(true)
    setBiteError(null)

    try {
      const res = await fetch('/api/therian/bite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_name: targetTherian.name }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          const next = new Date(data.nextBiteAt)
          const diff = Math.max(0, next.getTime() - Date.now())
          const hours = Math.floor(diff / 3600000)
          const mins  = Math.floor((diff % 3600000) / 60000)
          setBiteError(`Cooldown activo. Próxima mordida en ${hours}h ${mins}m.`)
        } else if (res.status === 400 && data.error === 'CANNOT_BITE_SELF') {
          setBiteError('No puedes morderte a ti mismo.')
        } else {
          setBiteError(data.error ?? 'Algo salió mal.')
        }
        setBiting(false)
        return
      }

      setBattleResult(data.battle)
      setBiteAwarded(data.biteAwarded)
      setUpdatedChallenger(data.challenger)
      setUpdatedTarget(data.target)
      setPhase('fighting')
    } catch {
      setBiteError('Error de conexión.')
      setBiting(false)
    }
  }

  const handleReset = () => {
    setPhase('search')
    setSearchInput('')
    setSearchError(null)
    setBiteError(null)
    setTargetTherian(null)
    setBattleResult(null)
    setBiteAwarded(null)
    setMyTherian(null)
    setCooldownInfo(null)
  }

  const isSelf = myTherian && targetTherian && myTherian.id === targetTherian.id
  const canBite = myTherian?.canBite && !isSelf

  return (
    <div className="min-h-screen bg-[#08080F] relative">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-8"
          style={{ background: 'radial-gradient(ellipse, #7c3aed, transparent)' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-[#08080F]/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <Link href="/therian" className="text-xl font-bold gradient-text">FOXI</Link>
        <div className="flex items-center gap-4">
          <Link href="/therian" className="text-[#8B84B0] hover:text-white text-sm transition-colors">Mi Therian</Link>
          <Link href="/leaderboard" className="text-[#8B84B0] hover:text-white text-sm transition-colors">🏆 Top</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-md mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black text-white">⚔️ Morder</h1>
          <p className="text-[#8B84B0] text-sm">Reta al Therian de otro jugador. Una vez cada 24 horas.</p>
        </div>

        {/* Cooldown banner */}
        {cooldownInfo && (
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-yellow-300 text-sm text-center">
            ⏳ {cooldownInfo}
          </div>
        )}

        {/* SEARCH PHASE */}
        {(phase === 'search' || phase === 'preview') && (
          <form onSubmit={handleSearch} className="space-y-3">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Nombre del Therian rival..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#4A4468] outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all"
            />
            <button
              type="submit"
              disabled={searching || !searchInput.trim()}
              className="w-full py-3 rounded-xl font-bold text-white bg-purple-700 hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {searching ? 'Buscando...' : '🔍 Buscar Therian'}
            </button>
            {searchError && (
              <p className="text-red-400 text-sm text-center">{searchError}</p>
            )}
          </form>
        )}

        {/* TARGET PREVIEW */}
        {phase === 'preview' && targetTherian && (
          <div className="rounded-2xl border border-white/10 bg-[#13131F] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-bold text-lg">{targetTherian.name}</div>
                <div className="text-[#8B84B0] text-sm">{targetTherian.species.emoji} {targetTherian.species.name} · Nv {targetTherian.level}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold ${
                  targetTherian.rarity === 'LEGENDARY' ? 'text-amber-400'
                  : targetTherian.rarity === 'EPIC' ? 'text-purple-400'
                  : targetTherian.rarity === 'RARE' ? 'text-blue-400'
                  : 'text-slate-400'
                }`}>{targetTherian.rarity}</div>
                <div className="text-[#8B84B0] text-sm">{targetTherian.bites} 🦷</div>
              </div>
            </div>

            {/* Stats mini */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { key: 'vitality', label: '🌿 Vitalidad' },
                { key: 'agility', label: '⚡ Agilidad' },
                { key: 'instinct', label: '🌌 Instinto' },
                { key: 'charisma', label: '✨ Carisma' },
              ].map(s => (
                <div key={s.key} className="flex justify-between bg-white/5 rounded-lg px-3 py-1">
                  <span className="text-[#8B84B0]">{s.label}</span>
                  <span className="text-white font-mono">{targetTherian.stats[s.key as keyof typeof targetTherian.stats]}</span>
                </div>
              ))}
            </div>

            {isSelf && (
              <p className="text-amber-400 text-sm text-center">No puedes morderte a ti mismo.</p>
            )}

            {biteError && (
              <p className="text-red-400 text-sm text-center">{biteError}</p>
            )}

            <button
              onClick={handleBite}
              disabled={biting || !canBite}
              className="w-full py-3 rounded-xl font-bold text-white bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {biting ? 'Iniciando batalla...' : canBite ? '🦷 ¡Morder!' : '⏳ En cooldown'}
            </button>
          </div>
        )}

        {/* BATTLE */}
        {(phase === 'fighting' || phase === 'result') && battleResult && myTherian && targetTherian && (
          <BattleArena
            challenger={myTherian}
            target={targetTherian}
            result={battleResult}
            onComplete={() => setPhase('result')}
          />
        )}

        {/* RESULT actions */}
        {phase === 'result' && (
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl font-bold border border-white/10 text-[#8B84B0] hover:text-white hover:border-white/20 transition-colors"
            >
              Buscar otro rival
            </button>
            <Link
              href="/leaderboard"
              className="flex-1 py-3 rounded-xl font-bold bg-purple-700 hover:bg-purple-600 text-white text-center transition-colors"
            >
              🏆 Leaderboard
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
