export interface Palette {
  id: string
  primary: string
  secondary: string
  accent: string
  name: string
}

export const PALETTES: Palette[] = [
  // ── Paletas fantásticas ────────────────────────────────────────────────────
  { id: 'ember',    name: 'Ember',    primary: '#C0392B', secondary: '#E67E22', accent: '#F39C12' },
  { id: 'shadow',   name: 'Shadow',   primary: '#2C3E50', secondary: '#4A5568', accent: '#95A5A6' },
  { id: 'forest',   name: 'Forest',   primary: '#27AE60', secondary: '#1E8449', accent: '#A9DFBF' },
  { id: 'frost',    name: 'Frost',    primary: '#2980B9', secondary: '#85C1E9', accent: '#EBF5FB' },
  { id: 'dusk',     name: 'Dusk',     primary: '#8E44AD', secondary: '#D7BDE2', accent: '#F4ECF7' },
  { id: 'gold',     name: 'Gold',     primary: '#D4AC0D', secondary: '#F9E79F', accent: '#7D6608' },
  { id: 'void',     name: 'Void',     primary: '#6C5CE7', secondary: '#A29BFE', accent: '#E94560' },
  { id: 'dawn',     name: 'Dawn',     primary: '#F06292', secondary: '#FFB74D', accent: '#FFF9C4' },
  // ── Paletas naturalistas ───────────────────────────────────────────────────
  { id: 'fox',      name: 'Zorro',    primary: '#D4701A', secondary: '#FFF0D4', accent: '#4A1A00' },
  { id: 'wolf',     name: 'Lobo',     primary: '#6E7F80', secondary: '#C8D0CF', accent: '#1C2424' },
  { id: 'polar',    name: 'Polar',    primary: '#EEF4F7', secondary: '#C4D8E2', accent: '#4A7A9B' },
  { id: 'mahogany', name: 'Caoba',    primary: '#7B3F00', secondary: '#D4956A', accent: '#1A0800' },
  { id: 'midnight', name: 'Medianoche', primary: '#1A1A2E', secondary: '#2E2E50', accent: '#6070FF' },
  { id: 'sage',     name: 'Salvia',   primary: '#4A6741', secondary: '#96B88E', accent: '#1E361A' },
  { id: 'amber',    name: 'Ámbar',    primary: '#B86A10', secondary: '#F0C060', accent: '#3A1400' },
  { id: 'coral',    name: 'Coral',    primary: '#C83050', secondary: '#FFB8C8', accent: '#500818' },
]

export const EYES = [
  { id: 'round',   name: 'Redondos' },
  { id: 'sharp',   name: 'Afilados' },
  { id: 'sleepy',  name: 'Soñolientos' },
  { id: 'fierce',  name: 'Feroces' },
  { id: 'gentle',  name: 'Gentiles' },
  { id: 'hollow',  name: 'Huecos' },
  { id: 'glowing', name: 'Brillantes' },
  { id: 'star',    name: 'Estelares' },
]

export const PATTERNS = [
  { id: 'solid',    name: 'Sólido' },
  { id: 'stripe',   name: 'Rayas' },
  { id: 'spot',     name: 'Manchas' },
  { id: 'gradient', name: 'Degradé' },
  { id: 'void',     name: 'Vacío' },
  { id: 'ember',    name: 'Llamas' },
  { id: 'frost',    name: 'Escarcha' },
  { id: 'dual',     name: 'Dual' },
]

export const SIGNATURES = [
  { id: 'tail_long',     name: 'Cola Larga' },
  { id: 'tail_fluffy',   name: 'Cola Esponjosa' },
  { id: 'horns_small',   name: 'Cuernos Pequeños' },
  { id: 'horns_grand',   name: 'Cuernos Grandes' },
  { id: 'wings_small',   name: 'Alas Pequeñas' },
  { id: 'mane',          name: 'Melena' },
  { id: 'no_signature',  name: 'Sin Firma' },
  { id: 'crown',         name: 'Corona' },
]

export function getPaletteById(id: string): Palette | undefined {
  return PALETTES.find(p => p.id === id)
}
