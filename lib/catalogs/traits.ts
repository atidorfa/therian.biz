export interface Trait {
  id: string
  name: string
  mod: {
    vitality: number
    agility: number
    instinct: number
    charisma: number
  }
  lore: string
}

export const TRAITS: Trait[] = [
  {
    id: 'silent',
    name: 'Silencioso',
    mod: { vitality: 0, agility: 0, instinct: 5, charisma: -3 },
    lore: 'Escucha lo que nadie más oye.',
  },
  {
    id: 'impulsive',
    name: 'Impulsivo',
    mod: { vitality: -2, agility: 6, instinct: 0, charisma: 0 },
    lore: 'Actúa antes de pensar.',
  },
  {
    id: 'guardian',
    name: 'Protector',
    mod: { vitality: 6, agility: -2, instinct: 0, charisma: 0 },
    lore: 'Nadie cae mientras él esté.',
  },
  {
    id: 'curious',
    name: 'Curioso',
    mod: { vitality: 0, agility: 3, instinct: 4, charisma: 0 },
    lore: 'El mundo es demasiado pequeño.',
  },
  {
    id: 'charismatic',
    name: 'Carismático',
    mod: { vitality: -2, agility: 0, instinct: 0, charisma: 8 },
    lore: 'Todos le prestan atención.',
  },
  {
    id: 'feral',
    name: 'Salvaje',
    mod: { vitality: 5, agility: 0, instinct: 0, charisma: -5 },
    lore: 'No necesita reglas.',
  },
  {
    id: 'mystic',
    name: 'Místico',
    mod: { vitality: 0, agility: -2, instinct: 7, charisma: 0 },
    lore: 'Ve lo que el tiempo esconde.',
  },
  {
    id: 'loyal',
    name: 'Leal',
    mod: { vitality: 3, agility: 0, instinct: 0, charisma: 4 },
    lore: 'No abandona. Nunca.',
  },
]

export function getTraitById(id: string): Trait | undefined {
  return TRAITS.find(t => t.id === id)
}
