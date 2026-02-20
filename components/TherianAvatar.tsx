'use client'

import React from 'react'
import type { TherianDTO } from '@/lib/therian-dto'

interface Props {
  therian: TherianDTO
  size?: number
  animated?: boolean
}

const EYE_SHAPES: Record<string, string> = {
  round:   'M-6,0 a6,5 0 1,0 12,0 a6,5 0 1,0 -12,0',
  sharp:   'M-8,0 L0,-4 L8,0 L0,4 Z',
  sleepy:  'M-6,-1 a6,4 0 0,0 12,0',
  fierce:  'M-8,-2 L8,-2 L6,2 L-6,2 Z',
  gentle:  'M-5,0 a5,6 0 1,0 10,0 a5,6 0 1,0 -10,0',
  hollow:  'M-6,0 a6,5 0 1,0 12,0 a6,5 0 1,0 -12,0 M-3,0 a3,2.5 0 1,0 6,0 a3,2.5 0 1,0 -6,0',
  glowing: 'M-6,0 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0',
  star:    'M0,-7 L2,-2 L7,-2 L3,1 L5,6 L0,3 L-5,6 L-3,1 L-7,-2 L-2,-2 Z',
}

const PATTERN_DEFS: Record<string, (_primary: string, secondary: string) => React.ReactElement> = {
  solid:    () => <></>,
  stripe:   (_p, s) => (
    <>
      <rect x="80" y="80" width="15" height="140" rx="7" fill={s} opacity="0.0"/>
      <rect x="105" y="60" width="15" height="160" rx="7" fill={s} opacity="0.0"/>
    </>
  ),
  spot:     (_p, s) => (
    <>
      <circle cx="100" cy="100" r="18" fill={s} opacity="0.0"/>
      <circle cx="150" cy="130" r="12" fill={s} opacity="0.0"/>
      <circle cx="80"  cy="150" r="10" fill={s} opacity="0.0"/>
    </>
  ),
  gradient: () => <></>,
  void:     (_p, _s) => (
    <rect x="60" y="60" width="180" height="180" rx="90" fill="url(#voidGrad)" opacity="0.15"/>
  ),
  ember:    (_p, s) => (
    <>
      <ellipse cx="120" cy="200" rx="30" ry="40" fill={s} opacity="0.0"/>
      <ellipse cx="180" cy="210" rx="20" ry="35" fill={s} opacity="0.0"/>
    </>
  ),
  frost:    (_p, s) => (
    <>
      <line x1="150" y1="80" x2="150" y2="220" stroke={s} strokeWidth="1.5" opacity="0.0"/>
      <line x1="90"  y1="110" x2="210" y2="190" stroke={s} strokeWidth="1.5" opacity="0.0"/>
      <line x1="90"  y1="190" x2="210" y2="110" stroke={s} strokeWidth="1.5" opacity="0.0"/>
    </>
  ),
  dual:     (_p, s) => (
    <path d="M150 60 C150 60, 240 150, 150 240 C60 150, 150 60" fill={s} opacity="0.0"/>
  ),
}

const SIGNATURE_ELEMENTS: Record<string, (primary: string, accent: string) => React.ReactElement> = {
  tail_long:    (p, a) => (
    <path d="M195 190 Q248 206 265 246 Q274 266 250 260 Q230 253 216 222 Q202 202 195 190"
          fill={p} stroke={a} strokeWidth="1" opacity="0.0"/>
  ),
  tail_fluffy:  (p, a) => (
    <ellipse cx="218" cy="205" rx="34" ry="24" fill={p} stroke={a} strokeWidth="1" opacity="0.0" transform="rotate(30,218,205)"/>
  ),
  horns_small:  (p, a) => (
    <>
      <path d="M115 72 Q106 44 112 34 Q120 52 118 76" fill={a} stroke={p} strokeWidth="1"/>
      <path d="M185 72 Q194 44 188 34 Q180 52 182 76" fill={a} stroke={p} strokeWidth="1"/>
    </>
  ),
  horns_grand:  (p, a) => (
    <>
      <path d="M110 74 Q86 32 98 14 Q112 42 116 78" fill={a} stroke={p} strokeWidth="1.5"/>
      <path d="M190 74 Q214 32 202 14 Q188 42 184 78" fill={a} stroke={p} strokeWidth="1.5"/>
    </>
  ),
  wings_small:  (p, a) => (
    <>
      <path d="M78 148 Q48 118 54 138 Q59 162 84 160" fill={p} stroke={a} strokeWidth="1" opacity="0.0"/>
      <path d="M222 148 Q252 118 246 138 Q241 162 216 160" fill={p} stroke={a} strokeWidth="1" opacity="0.0"/>
    </>
  ),
  mane:         (_p, a) => (
    <ellipse cx="150" cy="118" rx="56" ry="46" fill={a} opacity="0.0"/>
  ),
  crown:        (p, a) => (
    <path d="M116 72 L126 48 L150 62 L174 48 L184 72 L165 68 L150 58 L135 68 Z"
          fill={a} stroke={p} strokeWidth="1.5"/>
  ),
  no_signature: () => <></>,
}

// viewBox 300×300 — proporciones chibi
// Cabeza: ellipse cx=150, cy=110, rx=80, ry=78 → top y=32, bottom y=188
// Cuerpo pequeño debajo, brazos como nubs, patas cortas y rechonchas
const EAR_L = "M104,76 Q96,40 118,28 Q133,56 120,80 Z"
const EAR_R = "M196,76 Q204,40 182,28 Q167,56 180,80 Z"

// Patas con rotación en render (mismo ángulo que brazos)

export default function TherianAvatar({ therian, size = 300, animated = false }: Props) {
  const { appearance } = therian
  const { primary, secondary, accent } = appearance.paletteColors
  const eyeShape = EYE_SHAPES[appearance.eyes] ?? EYE_SHAPES.round
  const PatternEl = PATTERN_DEFS[appearance.pattern] ?? PATTERN_DEFS.solid
  const SignatureEl = SIGNATURE_ELEMENTS[appearance.signature] ?? SIGNATURE_ELEMENTS.no_signature

  const isGradient = appearance.pattern === 'gradient'
  const fill = isGradient ? 'url(#bodyGrad)' : primary

  return (
    <svg
      viewBox="0 0 300 300"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: animated ? 'drop-shadow(0 0 15px rgba(155,89,182,0.4))' : undefined }}
    >
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="40%">
          <stop offset="0%" stopColor={secondary}/>
          <stop offset="100%" stopColor={primary}/>
        </radialGradient>
        <radialGradient id="voidGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={primary} stopOpacity="0"/>
        </radialGradient>
        {therian.rarity === 'LEGENDARY' && (
          <filter id="legendary-glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        )}
      </defs>

      {/* Sombra del suelo */}
      <ellipse cx="150" cy="278" rx="48" ry="8" fill={primary} opacity="0.2"/>

      {/* Signature (detrás del cuerpo) */}
      {SignatureEl(primary, accent)}

      {/* Patas — mismo ángulo que brazos (30°), pivote en base del cuerpo */}
      <g transform="translate(135,243) rotate(10)">
        <path d="M-9,-5 L9,-5 L9,32 Q9,40 0,40 Q-9,40 -9,32 Z" fill={fill}/>
      </g>
      <g transform="translate(165,243) rotate(-10)">
        <path d="M-9,-5 L9,-5 L9,32 Q9,40 0,40 Q-9,40 -9,32 Z" fill={fill}/>
      </g>

      {/* Brazos — pivote en la esquina superior del cuerpo, top extendido para cubrir unión */}
      <g transform="translate(128,185) rotate(30)">
        <path d="M-9,-8 L9,-8 L9,52 Q9,60 0,60 Q-9,60 -9,52 Z" fill={fill}/>
      </g>
      <g transform="translate(172,185) rotate(-30)">
        <path d="M-9,-8 L9,-8 L9,52 Q9,60 0,60 Q-9,60 -9,52 Z" fill={fill}/>
      </g>

      {/* Cuerpo — parte superior estrecha con diagonales, base recta */}
      <path d="M128,185 L172,185 L187,210 L187,237 Q187,245 179,245 L121,245 Q113,245 113,237 L113,210 Z" fill={fill}/>

      {/* Patrón sobre cuerpo */}
      {PatternEl(primary, secondary)}

      {/* Orejas — dibujadas antes de la cabeza, la cabeza cubre la base */}
      <path d={EAR_L} fill={fill} stroke={accent} strokeWidth="1"/>
      <path d={EAR_R} fill={fill} stroke={accent} strokeWidth="1"/>
      <path d="M106,73 Q99,45 118,32 Q129,56 119,77 Z" fill={secondary} opacity="0.6"/>
      <path d="M194,73 Q201,45 182,32 Q171,56 181,77 Z" fill={secondary} opacity="0.6"/>

      {/* Cabeza — elipse aplastada (círculo aplastado) */}
      <ellipse cx="150" cy="128" rx="77" ry="57" fill={fill}/>

      {/* Nariz */}
      <ellipse cx="150" cy="130" rx="7" ry="5" fill={accent} opacity="0.85"/>

      {/* Ojos */}
      <g transform="translate(120, 112)">
        <path d={eyeShape} fill={accent}
              filter={therian.rarity === 'LEGENDARY' ? 'url(#legendary-glow)' : undefined}/>
        <circle cx="0" cy="0" r="2" fill="white" opacity="0.8"/>
      </g>
      <g transform="translate(180, 112)">
        <path d={eyeShape} fill={accent}
              filter={therian.rarity === 'LEGENDARY' ? 'url(#legendary-glow)' : undefined}/>
        <circle cx="0" cy="0" r="2" fill="white" opacity="0.8"/>
      </g>

      {/* Efecto rareza */}
      {therian.rarity === 'LEGENDARY' && (
        <>
          <ellipse cx="150" cy="150" rx="88" ry="120" fill="none" stroke={accent} strokeWidth="1" opacity="0.25"/>
          <ellipse cx="150" cy="150" rx="82" ry="114" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.15" strokeDasharray="5 8"/>
        </>
      )}
      {therian.rarity === 'EPIC' && (
        <ellipse cx="150" cy="150" rx="90" ry="122" fill="none" stroke="#C084FC" strokeWidth="1" opacity="0.2"/>
      )}
    </svg>
  )
}
