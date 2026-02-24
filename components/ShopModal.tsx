'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { TherianDTO } from '@/lib/therian-dto'
import { SHOP_ITEMS } from '@/lib/shop/catalog'
import { EGGS } from '@/lib/items/eggs'

interface Wallet {
  gold: number
  essence: number
  therianSlots: number
}

interface Props {
  therian: TherianDTO
  wallet: Wallet
  onClose: () => void
  onPurchase: (newWallet: Wallet, updatedTherian?: TherianDTO) => void
}

type Tab = 'accessories' | 'eggs'

const EXCHANGE_RATE = 200

const RARITY_COLOR: Record<string, string> = {
  COMMON: 'text-gray-400', UNCOMMON: 'text-emerald-400', RARE: 'text-blue-400',
  EPIC: 'text-purple-400', LEGENDARY: 'text-amber-400', MYTHIC: 'text-red-400',
}

const SLOT_LABEL: Record<string, string> = {
  orejas: 'Orejas', cola: 'Cola', ojos: 'Ojos',
  cabeza: 'Cabeza', anteojos: 'Anteojos', garras: 'Garras',
}

export default function ShopModal({ therian, wallet, onClose, onPurchase }: Props) {
  const [tab, setTab] = useState<Tab>('accessories')
  const [renameInput, setRenameInput] = useState('')
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [exchanging, setExchanging] = useState(false)
  const [eggQty, setEggQty] = useState<Record<string, number>>({})

  function getEggQty(id: string) { return eggQty[id] ?? 1 }
  function setQty(id: string, val: number) {
    setEggQty(prev => ({ ...prev, [id]: Math.max(1, Math.min(99, val)) }))
  }

  async function handleBuy(itemId: string, quantity = 1) {
    setError(null)
    if (itemId === 'rename') {
      if (renamingId !== itemId) { setRenamingId(itemId); return }
      if (!renameInput.trim()) return
    }
    setLoading(itemId)
    try {
      const res = await fetch('/api/shop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId, quantity,
          ...(itemId === 'rename' ? { newName: renameInput.trim() } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const messages: Record<string, string> = {
          INSUFFICIENT_ESSENCIA: `GOLD insuficiente (necesitas ${data.required}, tienes ${data.available})`,
          INSUFFICIENT_COIN: `ESENCIA insuficiente (necesitas ${data.required}, tienes ${data.available})`,
          NAME_TAKEN: 'Ese nombre ya está en uso.',
          ALREADY_OWNED: 'Ya tienes este accesorio.',
          NAME_REQUIRED: 'Ingresa un nombre.',
        }
        setError(messages[data.error] ?? 'Error al comprar.')
        return
      }
      setRenamingId(null)
      setRenameInput('')
      window.dispatchEvent(new Event('inventory-updated'))
      onPurchase(data.newBalance, data.updatedTherian)
    } catch {
      setError('Error de conexión.')
    } finally {
      setLoading(null)
    }
  }

  async function handleExchange() {
    setError(null)
    setExchanging(true)
    try {
      const res = await fetch('/api/wallet/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: EXCHANGE_RATE }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error === 'INSUFFICIENT_ESSENCIA'
          ? `Necesitas ${EXCHANGE_RATE} GOLD para cambiar.`
          : 'Error al cambiar.')
        return
      }
      onPurchase({ gold: data.gold, essence: data.essence, therianSlots: wallet.therianSlots })
    } catch {
      setError('Error de conexión.')
    } finally {
      setExchanging(false)
    }
  }

  const serviceItems = SHOP_ITEMS.filter(i => i.type === 'service' || i.type === 'slot')
  const accessorySlots = ['orejas', 'cola', 'ojos', 'garras', 'anteojos', 'cabeza']
  const accessoriesBySlot = accessorySlots
    .map(slot => ({ slot, items: SHOP_ITEMS.filter(i => i.slot === slot) }))
    .filter(g => g.items.length > 0)

  const equippedTypeIds = new Set(
    Object.values(therian.equippedAccessories ?? {}).map(v =>
      v.includes(':') ? v.split(':')[0] : v
    )
  )

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#13131F] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#13131F] border-b border-white/5 px-5 pt-5 pb-3 z-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-sm uppercase tracking-widest">Tienda</h2>
            <button onClick={onClose} className="text-white/30 hover:text-white/70 text-xl leading-none transition-colors">✕</button>
          </div>

          {/* Balance */}
          <div className="flex items-center gap-3 text-xs font-mono mb-3">
            <span className="flex items-center gap-1 text-amber-400">
              <span>🪙</span>
              <span className="font-semibold">{wallet.gold.toLocaleString('es-AR')} GOLD</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1 text-blue-400">
              <span>💎</span>
              <span className="font-semibold">{wallet.essence.toLocaleString('es-AR')} ESENCIA</span>
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            <button
              onClick={() => { setTab('accessories'); setError(null); setRenamingId(null) }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
                tab === 'accessories'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              🎨 Accesorios
            </button>
            <button
              onClick={() => { setTab('eggs'); setError(null); setRenamingId(null) }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
                tab === 'eggs'
                  ? 'bg-purple-900/40 text-purple-300 border border-purple-700/40'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              🥚 Huevos
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-3">
          {error && <p className="text-red-400 text-xs text-center italic">{error}</p>}

          {/* ── ACCESORIOS TAB ── */}
          {tab === 'accessories' && (
            <>
              {/* Exchange gold → essence */}
              <button
                onClick={handleExchange}
                disabled={exchanging || wallet.gold < EXCHANGE_RATE}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/15 hover:border-amber-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {exchanging ? '⏳ Canjeando...' : `🪙 ${EXCHANGE_RATE} GOLD → 💎 1 ESENCIA`}
              </button>

              {/* Services */}
              {serviceItems.map(item => {
                const owned = item.type === 'slot' ? wallet.therianSlots >= 8 : false
                const isLoadingThis = loading === item.id
                const cost = item.costGold > 0 ? item.costGold : item.costCoin
                const costLabel = item.costGold > 0 ? `${cost.toLocaleString('es-AR')} 🪙` : `${cost} 💎`
                const canAfford = item.costGold > 0 ? wallet.gold >= item.costGold : wallet.essence >= item.costCoin
                return (
                  <div key={item.id} className="rounded-xl border border-white/5 bg-white/3 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <p className="text-white font-semibold text-sm">{item.name}</p>
                          <p className="text-[#8B84B0] text-xs">{item.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-white/60 flex-shrink-0 mt-0.5">{costLabel}</span>
                    </div>
                    {item.id === 'rename' && renamingId === 'rename' && (
                      <input
                        type="text" value={renameInput}
                        onChange={e => setRenameInput(e.target.value)}
                        placeholder="Nuevo nombre..." maxLength={24}
                        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/50"
                        autoFocus
                      />
                    )}
                    {owned ? (
                      <div className="text-center text-xs text-[#8B84B0] italic py-0.5">✓ Máximo de slots (8/8)</div>
                    ) : (
                      <button
                        onClick={() => handleBuy(item.id)}
                        disabled={isLoadingThis || !canAfford}
                        className={`w-full rounded-lg py-2 text-xs font-semibold transition-all ${
                          !canAfford ? 'bg-white/5 text-white/20 cursor-not-allowed'
                          : item.id === 'rename' && renamingId !== 'rename'
                          ? 'border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                          : 'bg-gradient-to-r from-purple-700 to-purple-500 text-white hover:from-purple-600 hover:to-purple-400'
                        }`}
                      >
                        {isLoadingThis ? '⏳ Procesando...'
                          : item.id === 'rename' && renamingId === 'rename' ? 'Confirmar nombre'
                          : item.id === 'rename' ? 'Cambiar nombre'
                          : 'Comprar'}
                      </button>
                    )}
                  </div>
                )
              })}

              {/* Accessories grouped by slot */}
              {accessoriesBySlot.map(({ slot, items }) => (
                <div key={slot}>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 pt-1 pb-1.5">
                    {SLOT_LABEL[slot] ?? slot}
                  </p>
                  <div className="space-y-2">
                    {items.map(item => {
                      const owned = !!item.accessoryId && equippedTypeIds.has(item.accessoryId)
                      const isLoadingThis = loading === item.id
                      const cost = item.costGold > 0 ? item.costGold : item.costCoin
                      const costLabel = item.costGold > 0 ? `${cost.toLocaleString('es-AR')} 🪙` : `${cost} 💎`
                      const canAfford = item.costGold > 0 ? wallet.gold >= item.costGold : wallet.essence >= item.costCoin
                      return (
                        <div key={item.id} className="rounded-xl border border-white/5 bg-white/3 p-3 space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{item.emoji}</span>
                              <div>
                                <p className="text-white font-semibold text-xs">{item.name}</p>
                                <p className="text-[#8B84B0] text-[10px]">{item.description}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-white/60 flex-shrink-0">{costLabel}</span>
                          </div>
                          {owned ? (
                            <div className="text-center text-[10px] text-amber-400/60 italic">✓ Equipado</div>
                          ) : (
                            <button
                              onClick={() => handleBuy(item.id)}
                              disabled={isLoadingThis || !canAfford}
                              className={`w-full rounded-lg py-1.5 text-[10px] font-semibold transition-all ${
                                !canAfford ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                : 'bg-gradient-to-r from-amber-700 to-amber-500 text-white hover:from-amber-600 hover:to-amber-400'
                              }`}
                            >
                              {isLoadingThis ? '⏳...' : 'Comprar'}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ── HUEVOS TAB ── */}
          {tab === 'eggs' && (
            <>
              <p className="text-white/30 text-xs text-center italic pb-1">
                Los huevos reemplazan un slot de Therian en la fusión
              </p>
              {EGGS.map(egg => {
                const isLoadingThis = loading === egg.id
                const qty = getEggQty(egg.id)
                const totalCost = egg.price * qty
                const canAfford = egg.currency === 'gold'
                  ? wallet.gold >= totalCost
                  : wallet.essence >= totalCost
                const costLabel = egg.currency === 'gold'
                  ? `${egg.price.toLocaleString('es-AR')} 🪙 c/u`
                  : `${egg.price} 💎 c/u`
                const totalLabel = egg.currency === 'gold'
                  ? `${totalCost.toLocaleString('es-AR')} 🪙`
                  : `${totalCost} 💎`
                return (
                  <div key={egg.id} className="rounded-xl border border-white/5 bg-white/3 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{egg.emoji}</span>
                        <div>
                          <p className="text-white font-semibold text-sm">{egg.name}</p>
                          <p className={`text-xs font-semibold ${RARITY_COLOR[egg.rarity]}`}>{egg.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-white/60 flex-shrink-0 mt-0.5">{costLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                        <button
                          onClick={() => setQty(egg.id, qty - 1)} disabled={qty <= 1}
                          className="px-2.5 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >−</button>
                        <span className="w-8 text-center text-sm font-mono text-white font-semibold">{qty}</span>
                        <button
                          onClick={() => setQty(egg.id, qty + 1)} disabled={qty >= 99}
                          className="px-2.5 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >+</button>
                      </div>
                      <button
                        onClick={() => handleBuy(egg.id, qty)}
                        disabled={isLoadingThis || !canAfford}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                          !canAfford ? 'bg-white/5 text-white/20 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-700 to-purple-500 text-white hover:from-purple-600 hover:to-purple-400'
                        }`}
                      >
                        {isLoadingThis ? '⏳...' : `Comprar ×${qty} · ${totalLabel}`}
                      </button>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
