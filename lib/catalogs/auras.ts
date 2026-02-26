import type { Archetype } from '../pvp/types'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AuraTier = 'standard' | 'premium' | 'premium_plus'

export interface AuraEffectDef {
  // ── Init: aplicados al inicializar la batalla ────────────────────────────
  hpBonus?:          'vit_half' | 'cha_third'  // +VIT*0.5 o +CHA*0.3 por slot
  agiBonus?:         'agi_tenth'               // +AGI*0.1 effectiveAgility por slot
  instinctBonus?:    'cha_tenth'               // +CHA*0.1 instinct por slot
  shield?:           'cha_1_5x' | 'cha_1x'    // shieldHp = CHA*1.5 o CHA*1.0 por slot
  velocidadTerminal?: boolean                   // Round 1: team actúa primero (+9999 AGI temporal)

  // ── Daño saliente ─────────────────────────────────────────────────────────
  flatDamageBonus?:  'agi_8pct' | 'vit_5pct'  // +flat por hit
  basicFlatBonus?:   'cha_15pct'               // +flat en ataques básicos (isInnate)
  critMultiplier?:   number                     // extra multiplier sobre crit (ej. 1.10)
  pierceDef?:        number                     // % defensa ignorada del rival (ej. 0.05)
  vsBuff?:           number                     // % extra si target tiene debuff activo
  supernova?:        number                     // % extra daño en rondas 1-2 (ej. 0.35)
  sacrificioMod?:    number                     // % por aliado caído (ej. 0.12, max ×3)
  lavaFundente?:     boolean                    // bypass completo de shieldHp rival
  voltajeAsalto?:    boolean                    // damageMod += actor.effectiveAgility/1000

  // ── Daño entrante / defensiva ─────────────────────────────────────────────
  incomingReduction?: 'cha_3x1000_cap15'       // reduce dmg entrante: CHA*0.003 cap 15%
  basicDmgReduction?: number                    // reduce daño de básicos recibidos (ej. 0.05)
  evasionBonus?:      number                    // % miss chance añadida al atacante
  evasionReduction?:  number                    // % quita miss chance al rival
  aoeReduction?:      number                    // % menos daño AoE recibido (ej. 0.25)
  stunResist?:        number                    // prob. de resistir stun (ej. 0.50)

  // ── Init triggers ─────────────────────────────────────────────────────────
  polenSedante?:     boolean                    // 15% chance: AGI enemiga -10% al inicio
  ceniCegadora?:     boolean                    // 10% chance: primer ataque enemigo falla

  // ── Hooks por ronda ───────────────────────────────────────────────────────
  ecosistema?:       boolean                    // inicio de ronda: aliado más bajo HP cura VIT*0.04
  mareaCreciente?:   boolean                    // inicio de ronda: +2% dmg acumulable, cap +20%
  escudoHidraulico?: boolean                    // refresh shieldHp cada 3 rondas
  tormentaIones?:    boolean                    // inicio de ronda: enemy random -10% defenseMod
  corrienteRetorno?: boolean                    // 10% por acción de actor: reduce un CD en 1

  // ── Hooks por acción ─────────────────────────────────────────────────────
  circuitoSync?:     boolean                    // +5% AGI stack si usa habilidad de su arquetipo

  // ── On-hit hooks ──────────────────────────────────────────────────────────
  espinas?:          'cha_8pct'                 // thorns: CHA*0.08 dmg al atacante por hit
  bendicion?:        boolean                    // 20% del heal se reparte al aliado más bajo

  // ── Triggered effects ─────────────────────────────────────────────────────
  nuclErupcion?:     boolean                    // al morir aliado: dmg a cada enemigo vivo
  llamarada?:        boolean                    // al recibir crit: team +8% dmg por 2 turnos
  relampagoChain?:   boolean                    // crit: 30% chance de golpear 2do objetivo al 50%
  ojoTormenta?:      boolean                    // al recibir debuff: 20% de reflejarlo al atacante
  singularidad?:     boolean                    // 10% chance por ataque: +1 CD a ability rival

  // ── Supervivencia one-time ────────────────────────────────────────────────
  resurrection?:     boolean                    // primer aliado que muere sobrevive con 1 HP (1 vez)
  avatarCascada?:    boolean                    // el líder del equipo sobrevive primer golpe mortal

  // ── Modificadores de curación ─────────────────────────────────────────────
  healBonus?:        number                     // multiplicador sobre curación recibida (ej. 1.10)
}

export interface AuraDef {
  id:          string
  archetype:   Archetype
  tier:        AuraTier
  name:        string
  description: string
  effect:      AuraEffectDef
}

// ─── Catálogo ──────────────────────────────────────────────────────────────────

export const AURAS: AuraDef[] = [

  // ══════════════════════════════════════════════════════════════
  // 🌿 FORESTAL
  // ══════════════════════════════════════════════════════════════

  // Tier Estándar
  {
    id: 'forestal_vigor_roble',
    archetype: 'forestal', tier: 'standard',
    name: 'Vigor del Roble',
    description: 'El equipo enraíza su fuerza vital en la tierra. Todos los aliados ganan HP máximo igual a la mitad de su Vitalidad.',
    effect: { hpBonus: 'vit_half' },
  },
  {
    id: 'forestal_capa_musgo',
    archetype: 'forestal', tier: 'standard',
    name: 'Capa de Musgo',
    description: 'Una capa de musgo vivo amortigua los golpes directos. Los ataques básicos recibidos infligen un 5% menos de daño.',
    effect: { basicDmgReduction: 0.05 },
  },
  {
    id: 'forestal_raices_hierro',
    archetype: 'forestal', tier: 'standard',
    name: 'Raíces de Hierro',
    description: 'Raíces endurecidas crecen bajo los pies del equipo. Reduce todo el daño entrante según el Carisma del líder (máx. 15%).',
    effect: { incomingReduction: 'cha_3x1000_cap15' },
  },
  {
    id: 'forestal_savia_vida',
    archetype: 'forestal', tier: 'standard',
    name: 'Savia de Vida',
    description: 'La savia del bosque fluye por las heridas. Toda curación recibida por el equipo es un 10% más efectiva.',
    effect: { healBonus: 1.10 },
  },

  // Tier Premium
  {
    id: 'forestal_polen_sedante',
    archetype: 'forestal', tier: 'premium',
    name: 'Polen Sedante',
    description: 'Al inicio del combate, las esporas del líder tienen un 15% de probabilidad de reducir la Agilidad de todo el equipo rival un 10%.',
    effect: { polenSedante: true },
  },
  {
    id: 'forestal_espinas_pantano',
    archetype: 'forestal', tier: 'premium',
    name: 'Espinas del Pantano',
    description: 'Espinas envenenadas crecen sobre el equipo. Cada golpe recibido devuelve daño al atacante igual al Carisma del líder × 0.08.',
    effect: { espinas: 'cha_8pct' },
  },
  {
    id: 'forestal_ecosistema_fertil',
    archetype: 'forestal', tier: 'premium',
    name: 'Ecosistema Fértil',
    description: 'Al inicio de cada ronda, el aliado con menos HP recupera vida igual a la Vitalidad del líder × 0.04.',
    effect: { ecosistema: true },
  },

  // Tier Premium+
  {
    id: 'forestal_santuario_ancestral',
    archetype: 'forestal', tier: 'premium_plus',
    name: 'Santuario Ancestral',
    description: 'El espíritu del bosque ancient otorga a cada aliado un escudo de daño al inicio igual al Carisma del líder × 1.5.',
    effect: { shield: 'cha_1_5x' },
  },
  {
    id: 'forestal_ira_bosque',
    archetype: 'forestal', tier: 'premium_plus',
    name: 'Ira del Bosque',
    description: 'La naturaleza ataca con cada golpe. Todos los ataques del equipo infligen daño adicional fijo igual a la Vitalidad del líder × 0.05.',
    effect: { flatDamageBonus: 'vit_5pct' },
  },
  {
    id: 'forestal_resurreccion_silvestre',
    archetype: 'forestal', tier: 'premium_plus',
    name: 'Resurrección Silvestre',
    description: 'El bosque niega una muerte. Una vez por batalla, el primer aliado que caiga sobrevive con 1 HP.',
    effect: { resurrection: true },
  },

  // ══════════════════════════════════════════════════════════════
  // 🔥 VOLCÁNICO
  // ══════════════════════════════════════════════════════════════

  // Tier Estándar
  {
    id: 'volcanico_fervor_magma',
    archetype: 'volcanico', tier: 'standard',
    name: 'Fervor de Magma',
    description: 'El calor del magma potencia cada golpe. Todos los ataques del equipo infligen daño adicional fijo igual a la Agilidad del líder × 0.08.',
    effect: { flatDamageBonus: 'agi_8pct' },
  },
  {
    id: 'volcanico_caldera_odio',
    archetype: 'volcanico', tier: 'standard',
    name: 'Caldera de Odio',
    description: 'Los golpes críticos explotan con furia volcánica. El multiplicador de daño crítico aumenta un 10% adicional.',
    effect: { critMultiplier: 1.10 },
  },
  {
    id: 'volcanico_ceniza_cegadora',
    archetype: 'volcanico', tier: 'standard',
    name: 'Ceniza Cegadora',
    description: 'Una nube de ceniza ciega al equipo rival al inicio. El primer ataque enemigo tiene un 10% de probabilidad de fallar completamente.',
    effect: { ceniCegadora: true },
  },
  {
    id: 'volcanico_presion_tectonica',
    archetype: 'volcanico', tier: 'standard',
    name: 'Presión Tectónica',
    description: 'La fuerza sísmica del equipo quiebra las defensas. Todos los ataques ignoran un 5% de la reducción de defensa del objetivo.',
    effect: { pierceDef: 0.05 },
  },

  // Tier Premium
  {
    id: 'volcanico_insignia_azufre',
    archetype: 'volcanico', tier: 'premium',
    name: 'Insignia de Azufre',
    description: 'El azufre quema más donde ya hay heridas. Los ataques infligen un 10% más de daño a objetivos con efectos negativos activos.',
    effect: { vsBuff: 0.10 },
  },
  {
    id: 'volcanico_llamarada_vengativa',
    archetype: 'volcanico', tier: 'premium',
    name: 'Llamarada Vengativa',
    description: 'Cada crítico recibido enciende la rabia del equipo. Al recibir un golpe crítico, todos los aliados ganan +8% de daño durante 2 turnos.',
    effect: { llamarada: true },
  },
  {
    id: 'volcanico_nucleo_erupcion',
    archetype: 'volcanico', tier: 'premium',
    name: 'Núcleo en Erupción',
    description: 'Los caídos se vengan en llamas. Al morir un aliado, cada enemigo vivo recibe daño de fuego igual a la Agilidad del caído × 0.25.',
    effect: { nuclErupcion: true },
  },

  // Tier Premium+
  {
    id: 'volcanico_supernova_primordial',
    archetype: 'volcanico', tier: 'premium_plus',
    name: 'Supernova Primordial',
    description: 'El equipo explota con poder primordial en los primeros compases. Durante las primeras 2 rondas, todos los ataques infligen un 35% más de daño.',
    effect: { supernova: 0.35 },
  },
  {
    id: 'volcanico_sacrificio_igneo',
    archetype: 'volcanico', tier: 'premium_plus',
    name: 'Sacrificio Ígneo',
    description: 'Cada caído alimenta la llama. El daño del equipo aumenta un 12% por cada aliado fallecido (máx. +36%).',
    effect: { sacrificioMod: 0.12 },
  },
  {
    id: 'volcanico_lava_fundente',
    archetype: 'volcanico', tier: 'premium_plus',
    name: 'Lava Fundente',
    description: 'La lava lo funde todo. Los ataques del equipo ignoran completamente los escudos de protección del rival.',
    effect: { lavaFundente: true },
  },

  // ══════════════════════════════════════════════════════════════
  // 💧 ACUÁTICO
  // ══════════════════════════════════════════════════════════════

  // Tier Estándar
  {
    id: 'acuatico_muralla_coral',
    archetype: 'acuatico', tier: 'standard',
    name: 'Muralla de Coral',
    description: 'El coral vivo forma una barrera protectora. Todos los aliados ganan HP máximo adicional igual al Carisma del líder × 0.3.',
    effect: { hpBonus: 'cha_third' },
  },
  {
    id: 'acuatico_niebla_abismo',
    archetype: 'acuatico', tier: 'standard',
    name: 'Niebla del Abismo',
    description: 'La niebla profunda envuelve al equipo. Los ataques enemigos tienen un 5% adicional de probabilidad de fallar.',
    effect: { evasionBonus: 0.05 },
  },
  {
    id: 'acuatico_corriente_retorno',
    archetype: 'acuatico', tier: 'standard',
    name: 'Corriente de Retorno',
    description: 'Las corrientes del fondo aceleran el flujo del tiempo. Tras cada acción propia, hay un 10% de probabilidad de reducir en 1 el enfriamiento de una habilidad aleatoria.',
    effect: { corrienteRetorno: true },
  },
  {
    id: 'acuatico_fluidez_manantial',
    archetype: 'acuatico', tier: 'standard',
    name: 'Fluidez de Manantial',
    description: 'El agua fluye por donde la tierra bloquea. Los efectos de aturdimiento sobre el equipo tienen un 50% de probabilidad de ser ignorados.',
    effect: { stunResist: 0.50 },
  },

  // Tier Premium
  {
    id: 'acuatico_escudo_hidraulico',
    archetype: 'acuatico', tier: 'premium',
    name: 'Escudo Hidráulico',
    description: 'Un escudo de agua se forma en torno a cada aliado. Otorga un escudo igual al Carisma del líder que se regenera cada 3 rondas.',
    effect: { shield: 'cha_1x', escudoHidraulico: true },
  },
  {
    id: 'acuatico_marea_creciente',
    archetype: 'acuatico', tier: 'premium',
    name: 'Marea Creciente',
    description: 'Con cada ronda que pasa, el equipo gana impulso. El daño del equipo aumenta un 2% acumulable por ronda (máx. +20%).',
    effect: { mareaCreciente: true },
  },
  {
    id: 'acuatico_bendicion_profundidades',
    archetype: 'acuatico', tier: 'premium',
    name: 'Bendición de las Profundidades',
    description: 'Las aguas sanadoras comparten su don. Las curaciones del equipo distribuyen un 20% de su valor adicional al aliado con menos HP.',
    effect: { bendicion: true },
  },

  // Tier Premium+
  {
    id: 'acuatico_ojo_tormenta',
    archetype: 'acuatico', tier: 'premium_plus',
    name: 'Ojo de la Tormenta',
    description: 'La calma en el centro del caos devuelve el mal. Al recibir un efecto negativo, hay un 20% de probabilidad de reflejarlo de vuelta al atacante.',
    effect: { ojoTormenta: true },
  },
  {
    id: 'acuatico_abismo_calma',
    archetype: 'acuatico', tier: 'premium_plus',
    name: 'Abismo de Calma',
    description: 'Las profundidades absorben el impacto masivo. Los ataques de área sobre el equipo infligen un 25% menos de daño.',
    effect: { aoeReduction: 0.25 },
  },
  {
    id: 'acuatico_avatar_cascada',
    archetype: 'acuatico', tier: 'premium_plus',
    name: 'Avatar de la Cascada',
    description: 'El agua nunca se rompe. El líder del equipo es inmune al primer golpe que lo mataría, sobreviviendo con 1 HP.',
    effect: { avatarCascada: true },
  },

  // ══════════════════════════════════════════════════════════════
  // ⚡ ELÉCTRICO
  // ══════════════════════════════════════════════════════════════

  // Tier Estándar
  {
    id: 'electrico_pulso_galvanico',
    archetype: 'electrico', tier: 'standard',
    name: 'Pulso Galvánico',
    description: 'Una descarga eléctrica acelera los reflejos del equipo. Todos los aliados ganan Agilidad igual a la Agilidad del líder × 0.1.',
    effect: { agiBonus: 'agi_tenth' },
  },
  {
    id: 'electrico_carga_estatica',
    archetype: 'electrico', tier: 'standard',
    name: 'Carga Estática',
    description: 'La electricidad acumulada potencia los golpes directos. Los ataques básicos infligen daño adicional fijo igual al Carisma del líder × 0.15.',
    effect: { basicFlatBonus: 'cha_15pct' },
  },
  {
    id: 'electrico_sentido_voltaico',
    archetype: 'electrico', tier: 'standard',
    name: 'Sentido Voltaico',
    description: 'El campo electromagnético guía cada golpe. La probabilidad de que el equipo rival esquive los ataques se reduce un 10%.',
    effect: { evasionReduction: 0.10 },
  },
  {
    id: 'electrico_sobrecarga_energetica',
    archetype: 'electrico', tier: 'standard',
    name: 'Sobrecarga Energética',
    description: 'La energía eléctrica aguza los sentidos. Todos los aliados ganan Instinto adicional igual al Carisma del líder × 0.1.',
    effect: { instinctBonus: 'cha_tenth' },
  },

  // Tier Premium
  {
    id: 'electrico_circuito_sincronizado',
    archetype: 'electrico', tier: 'premium',
    name: 'Circuito Sincronizado',
    description: 'Cuando los aliados actúan en sincronía usando habilidades de su propio arquetipo, la electricidad los acelera. Cada uso seguido otorga +5% AGI (máx. 3 stacks).',
    effect: { circuitoSync: true },
  },
  {
    id: 'electrico_voltaje_asalto',
    archetype: 'electrico', tier: 'premium',
    name: 'Voltaje de Asalto',
    description: 'La velocidad se convierte en poder destructivo. El daño del equipo escala con la Agilidad actual: +1% por cada 10 puntos de AGI.',
    effect: { voltajeAsalto: true },
  },
  {
    id: 'electrico_tormenta_iones',
    archetype: 'electrico', tier: 'premium',
    name: 'Tormenta de Iones',
    description: 'Al inicio de cada ronda, una tormenta de iones reduce la defensa de un enemigo aleatorio un 10% durante esa ronda.',
    effect: { tormentaIones: true },
  },

  // Tier Premium+
  {
    id: 'electrico_relampago_cadena',
    archetype: 'electrico', tier: 'premium_plus',
    name: 'Relámpago en Cadena',
    description: 'Los golpes críticos se encadenan como el rayo. Al asestar un crítico, hay un 30% de probabilidad de golpear a un segundo enemigo aleatorio por el 50% del daño.',
    effect: { relampagoChain: true },
  },
  {
    id: 'electrico_velocidad_terminal',
    archetype: 'electrico', tier: 'premium_plus',
    name: 'Velocidad Terminal',
    description: 'En la primera ronda, el equipo actúa antes que cualquier rival, ignorando diferencias de Agilidad.',
    effect: { velocidadTerminal: true },
  },
  {
    id: 'electrico_singularidad_plasma',
    archetype: 'electrico', tier: 'premium_plus',
    name: 'Singularidad de Plasma',
    description: 'Cada golpe tiene un 10% de probabilidad de sobrecargar al objetivo, aumentando el enfriamiento de una de sus habilidades en 1.',
    effect: { singularidad: true },
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getAuraById(id: string): AuraDef | undefined {
  return AURAS.find(a => a.id === id)
}

export function getAurasByArchetype(archetype: Archetype): AuraDef[] {
  return AURAS.filter(a => a.archetype === archetype)
}

export function getAurasByTier(archetype: Archetype, tier: AuraTier): AuraDef[] {
  return AURAS.filter(a => a.archetype === archetype && a.tier === tier)
}

// ─── Lógica de asignación por rareza ──────────────────────────────────────────

export type AuraRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC'

export function pickAuraForRarity(
  archetype: Archetype,
  rarity: AuraRarity,
  rng: () => number,
): string {
  const roll = rng()

  let eligibleTiers: AuraTier[]

  if (rarity === 'COMMON' || rarity === 'UNCOMMON' || rarity === 'RARE') {
    eligibleTiers = ['standard']
  } else if (rarity === 'EPIC') {
    eligibleTiers = roll < 0.70 ? ['standard'] : ['premium']
  } else if (rarity === 'LEGENDARY') {
    eligibleTiers = roll < 0.50 ? ['premium'] : ['premium_plus']
  } else {
    // MYTHIC
    eligibleTiers = ['premium_plus']
  }

  const pool = AURAS.filter(
    a => a.archetype === archetype && eligibleTiers.includes(a.tier),
  )

  if (pool.length === 0) {
    // Fallback: any aura of that archetype
    const fallback = AURAS.filter(a => a.archetype === archetype)
    const idx = Math.floor(rng() * fallback.length)
    return fallback[idx]?.id ?? AURAS[0].id
  }

  const idx = Math.floor(rng() * pool.length)
  return pool[idx].id
}

export const TIER_LABEL: Record<AuraTier, string> = {
  standard:     'Estándar',
  premium:      'Premium',
  premium_plus: 'Legendario',
}
