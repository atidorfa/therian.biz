# Motor de Generación Procedural

El motor genera Therians únicos y deterministas a partir de una semilla criptográfica.

**Archivos relevantes:**
- `lib/generation/prng.ts` — PRNG wrapper
- `lib/generation/engine.ts` — orquestador principal
- `lib/catalogs/species.ts` — 6 especies
- `lib/catalogs/traits.ts` — 8 arquetipos de personalidad
- `lib/catalogs/appearance.ts` — paletas, ojos, patrones, signatures
- `lib/catalogs/auras.ts` — 40 auras (4 arquetipos × 3 tiers)

---

## Seed y PRNG

```typescript
// lib/generation/prng.ts
export function createSeed(userId: string, timestamp: number, secret: string): string {
  return createHmac('sha256', secret).update(`${userId}:${timestamp}`).digest('hex')
}

export function createRNG(seed: string) {
  const rng = seedrandom(seed)
  return {
    next:     () => rng(),
    range:    (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min,
    choice:   <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)],
    weighted: <T>(items: Array<{ value: T; weight: number }>): T => { /* ruleta */ },
  }
}
```

- La semilla es un HMAC-SHA256 de `userId:timestamp` con `SERVER_SECRET`
- `seedrandom` garantiza resultados idénticos dado el mismo seed
- El timestamp se persiste en `Therian.seed` para reproducibilidad

---

## Flujo de generación

```
createSeed(userId, timestamp, SERVER_SECRET)
  ↓
createRNG(seed)
  ↓
1. Rareza     → rng.weighted(RARITY_WEIGHTS)
2. Especie    → rng.choice(SPECIES)
3. Trait      → rng.choice(TRAITS)
4. Stats      → base + varianza + bias de especie + mod de trait + rarityBonus
5. Apariencia → palette, eyes, pattern, signature
6. Aura       → pickAuraForRarity(archetype, rarity, rng) → auraId (permanente)
```

### Tipo de retorno `GeneratedTherian`

```typescript
interface GeneratedTherian {
  seed:       string
  timestamp:  number
  rarity:     Rarity
  speciesId:  string
  traitId:    string
  stats:      TherianStats
  appearance: TherianAppearance
  auraId:     string   // ID del catálogo lib/catalogs/auras.ts
}
```

---

## Rareza

```typescript
const RARITY_WEIGHTS = [
  { value: 'COMMON',    weight: 60000 },
  { value: 'UNCOMMON',  weight: 25000 },
  { value: 'RARE',      weight: 10000 },
  { value: 'EPIC',      weight:  4000 },
  { value: 'LEGENDARY', weight:   999 },
  { value: 'MYTHIC',    weight:     1 },
]
```

Probabilidades aproximadas:
| Rareza | % |
|--------|---|
| COMMON | 60% |
| UNCOMMON | 25% |
| RARE | 10% |
| EPIC | 4% |
| LEGENDARY | ~1% |
| MYTHIC | ~0.001% |

---

## Stats

### Fórmula
```
stat = clamp(base + varianza + species.bias[stat] + trait.mod[stat] + rarityBonus)
```

donde:
- `base = 50`
- `varianza = rng.range(-RARITY_VARIANCE, +RARITY_VARIANCE)`
- `clamp(x, 1, 100)`

### Bonus y varianza por rareza

| Rareza | `rarityBonus` | `variance` |
|--------|--------------|------------|
| COMMON | -20 | ±10 |
| UNCOMMON | -10 | ±10 |
| RARE | 0 | ±10 |
| EPIC | +10 | ±10 |
| LEGENDARY | +25 | ±15 |
| MYTHIC | +40 | ±10 |

---

## Catálogo de Especies

| ID | Nombre | Vitality | Agility | Instinct | Charisma |
|----|--------|----------|---------|----------|---------|
| `wolf` | Lobo | +8 | +5 | +3 | -2 |
| `fox` | Zorro | -2 | +8 | +5 | +3 |
| `cat` | Gato | +2 | +5 | +8 | -1 |
| `crow` | Cuervo | -3 | +3 | +7 | +8 |
| `deer` | Ciervo | +5 | +3 | +4 | +5 |
| `bear` | Oso | +10 | -3 | +2 | +1 |

---

## Catálogo de Traits (Personalidad)

| ID | Nombre | Vitality | Agility | Instinct | Charisma |
|----|--------|----------|---------|----------|---------|
| `silent` | Silencioso | — | — | +5 | -3 |
| `impulsive` | Impulsivo | -2 | +6 | — | — |
| `guardian` | Protector | +6 | -2 | — | — |
| `curious` | Curioso | — | +3 | +4 | — |
| `charismatic` | Carismático | -2 | — | — | +8 |
| `feral` | Salvaje | +5 | — | — | -5 |
| `mystic` | Místico | — | -2 | +7 | — |
| `loyal` | Leal | +3 | — | — | +4 |

---

## Catálogo de Apariencia

### Paletas (8)
| ID | Primary | Secondary | Accent |
|----|---------|-----------|--------|
| `ember` | `#C0392B` | `#E67E22` | `#F39C12` |
| `shadow` | `#2C3E50` | `#34495E` | `#95A5A6` |
| `forest` | `#27AE60` | `#1E8449` | `#A9DFBF` |
| `frost` | `#2980B9` | `#85C1E9` | `#EBF5FB` |
| `dusk` | `#8E44AD` | `#D7BDE2` | `#F8F9FA` |
| `gold` | `#D4AC0D` | `#F9E79F` | `#7D6608` |
| `void` | `#1A1A2E` | `#16213E` | `#E94560` |
| `dawn` | `#F06292` | `#FFB74D` | `#FFF9C4` |

### Ojos (8 estilos)
`round`, `sharp`, `sleepy`, `fierce`, `gentle`, `hollow`, `glowing`, `star`

### Patrones (8)
`solid`, `stripe`, `spot`, `gradient`, `void`, `ember`, `frost`, `dual`

### Signatures (8 rasgos únicos)
`tail_long`, `tail_fluffy`, `horns_small`, `horns_grand`, `wings_small`, `mane`, `no_signature`, `crown`

---

## Asignación de Auras por Rareza

El paso 6 del flujo asigna un `auraId` permanente al Therian. La función `pickAuraForRarity(archetype, rarity, rng)` en `lib/catalogs/auras.ts` filtra el catálogo por tier y escoge una aura aleatoria:

| Rareza | Tiers disponibles | Probabilidades |
|--------|------------------|----------------|
| COMMON | standard | 100% standard (auras 1–4) |
| UNCOMMON | standard | 100% standard |
| RARE | standard | 100% standard |
| EPIC | standard + premium | 70% standard / 30% premium |
| LEGENDARY | premium + premium_plus | 50% premium / 50% premium_plus |
| MYTHIC | premium_plus | 100% premium_plus (auras 8–10) |

El arquetipo se resuelve a partir del `traitId` via `resolveArchetype()`:
- Si el traitId es ya un arquetipo válido (`forestal`, `electrico`, `acuatico`, `volcanico`) → se usa directamente.
- Si es un trait legacy (`silent`, `mystic`, `guardian`, etc.) → se mapea via `LEGACY_ARCHETYPE_MAP`.

---

## Generación con rareza forzada

Para el sistema de fusión, existe `generateTherianWithRarity()`:

```typescript
export function generateTherianWithRarity(
  userId: string,
  secret: string,
  forcedRarity: Rarity
): GeneratedTherian
```

Omite el paso de selección de rareza y aplica directamente `RARITY_BONUS[forcedRarity]`.

---

## Progresión de nivel

```typescript
function xpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}
```

| Nivel | XP para siguiente |
|-------|------------------|
| 1 | 100 |
| 2 | 150 |
| 3 | 225 |
| 4 | 337 |
| 5 | 506 |

---

## Rareza y fusión

```
COMMON → UNCOMMON → RARE → EPIC → LEGENDARY → MYTHIC
```

```typescript
export function getNextRarity(rarity: Rarity): Rarity | null
```

La fusión requiere dos Therians de la **misma rareza**. El resultado se genera con `generateTherianWithRarity(nextRarity)`. Los dos Therians originales se eliminan (o uno puede sustituirse con un huevo del inventario).
