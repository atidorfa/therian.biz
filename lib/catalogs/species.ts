export interface Species {
  id: string
  name: string
  emoji: string
  bias: {
    vitality: number
    agility: number
    instinct: number
    charisma: number
  }
  lore: string
}

export const SPECIES: Species[] = [
  {
    id: 'wolf',
    name: 'Lobo',
    emoji: '🐺',
    bias: { vitality: 8, agility: 5, instinct: 3, charisma: -2 },
    lore: 'Fuerza en la manada. Solo, igualmente peligroso.',
  },
  {
    id: 'fox',
    name: 'Zorro',
    emoji: '🦊',
    bias: { vitality: -2, agility: 8, instinct: 5, charisma: 3 },
    lore: 'Astucia que supera la fuerza. Velocidad que engaña al ojo.',
  },
  {
    id: 'cat',
    name: 'Gato',
    emoji: '🐱',
    bias: { vitality: 2, agility: 5, instinct: 8, charisma: -1 },
    lore: 'Independiente. Misterioso. Te elige, no al revés.',
  },
  {
    id: 'crow',
    name: 'Cuervo',
    emoji: '🪶',
    bias: { vitality: -3, agility: 3, instinct: 7, charisma: 8 },
    lore: 'Memoria eterna. Sabiduría oscura. Mensajero entre mundos.',
  },
  {
    id: 'deer',
    name: 'Ciervo',
    emoji: '🦌',
    bias: { vitality: 5, agility: 3, instinct: 4, charisma: 5 },
    lore: 'Gracia sin pretensión. Equilibrio en cada paso.',
  },
  {
    id: 'bear',
    name: 'Oso',
    emoji: '🐻',
    bias: { vitality: 12, agility: -4, instinct: 2, charisma: 1 },
    lore: 'Resistencia absoluta. Calma que precede al trueno.',
  },
]

export function getSpeciesById(id: string): Species | undefined {
  return SPECIES.find(s => s.id === id)
}
