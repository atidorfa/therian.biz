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
      <rect x="80" y="80" width="15" height="140" rx="7" fill={s} opacity="0.5"/>
      <rect x="105" y="60" width="15" height="160" rx="7" fill={s} opacity="0.3"/>
    </>
  ),
  spot:     (_p, s) => (
    <>
      <circle cx="100" cy="100" r="18" fill={s} opacity="0.4"/>
      <circle cx="150" cy="130" r="12" fill={s} opacity="0.35"/>
      <circle cx="80"  cy="150" r="10" fill={s} opacity="0.3"/>
    </>
  ),
  gradient: () => <></>,
  void:     (_p, _s) => (
    <rect x="60" y="60" width="180" height="180" rx="90" fill="url(#voidGrad)" opacity="0.15"/>
  ),
  ember:    (_p, s) => (
    <>
      <ellipse cx="120" cy="200" rx="30" ry="40" fill={s} opacity="0.3"/>
      <ellipse cx="180" cy="210" rx="20" ry="35" fill={s} opacity="0.25"/>
    </>
  ),
  frost:    (_p, s) => (
    <>
      <line x1="150" y1="80" x2="150" y2="220" stroke={s} strokeWidth="1.5" opacity="0.3"/>
      <line x1="90"  y1="110" x2="210" y2="190" stroke={s} strokeWidth="1.5" opacity="0.3"/>
      <line x1="90"  y1="190" x2="210" y2="110" stroke={s} strokeWidth="1.5" opacity="0.3"/>
    </>
  ),
  dual:     (_p, s) => (
    <path d="M150 60 C150 60, 240 150, 150 240 C60 150, 150 60" fill={s} opacity="0.2"/>
  ),
}

const SIGNATURE_ELEMENTS: Record<string, (primary: string, accent: string) => React.ReactElement> = {
  tail_long:    (p, a) => (
    <path d="M195 185 Q250 200 270 240 Q280 260 255 255 Q235 250 220 220 Q205 200 195 185"
          fill={p} stroke={a} strokeWidth="1" opacity="0.9"/>
  ),
  tail_fluffy:  (p, a) => (
    <ellipse cx="220" cy="200" rx="35" ry="25" fill={p} stroke={a} strokeWidth="1" opacity="0.8" transform="rotate(30,220,200)"/>
  ),
  horns_small:  (p, a) => (
    <>
      <path d="M115 85 Q105 55 110 45 Q118 60 118 85" fill={a} stroke={p} strokeWidth="1"/>
      <path d="M185 85 Q195 55 190 45 Q182 60 182 85" fill={a} stroke={p} strokeWidth="1"/>
    </>
  ),
  horns_grand:  (p, a) => (
    <>
      <path d="M110 85 Q85 40 95 20 Q108 45 115 85" fill={a} stroke={p} strokeWidth="1.5"/>
      <path d="M190 85 Q215 40 205 20 Q192 45 185 85" fill={a} stroke={p} strokeWidth="1.5"/>
    </>
  ),
  wings_small:  (p, a) => (
    <>
      <path d="M80 140 Q50 110 55 130 Q60 155 85 155" fill={p} stroke={a} strokeWidth="1" opacity="0.7"/>
      <path d="M220 140 Q250 110 245 130 Q240 155 215 155" fill={p} stroke={a} strokeWidth="1" opacity="0.7"/>
    </>
  ),
  mane:         (_p, a) => (
    <ellipse cx="150" cy="120" rx="55" ry="45" fill={a} opacity="0.35"/>
  ),
  crown:        (p, a) => (
    <path d="M115 80 L125 55 L150 70 L175 55 L185 80 L165 75 L150 65 L135 75 Z"
          fill={a} stroke={p} strokeWidth="1.5"/>
  ),
  no_signature: () => <></>,
}

type PaletteColors = { primary: string; secondary: string; accent: string }

const ACCESSORY_RENDERERS: Record<string, (c: PaletteColors) => React.ReactNode> = {
  glasses: ({ accent }) => (
    <g stroke={accent} strokeWidth="3.5" fill="none" opacity="0.92">
      <circle cx="125" cy="105" r="17" />
      <circle cx="175" cy="105" r="17" />
      <line x1="142" y1="105" x2="158" y2="105" />
      <line x1="108" y1="103" x2="97"  y2="106" />
      <line x1="192" y1="103" x2="203" y2="106" />
    </g>
  ),
  crown: ({ accent, secondary }) => (
    <g>
      <polygon points="150,46 131,68 150,60 169,68" fill={accent} stroke={secondary} strokeWidth="1.5" opacity="0.95"/>
      <rect x="129" y="67" width="42" height="9" rx="2" fill={accent} opacity="0.85"/>
      <circle cx="150" cy="46" r="3" fill={secondary} opacity="0.9"/>
      <circle cx="131" cy="68" r="2.5" fill={secondary} opacity="0.9"/>
      <circle cx="169" cy="68" r="2.5" fill={secondary} opacity="0.9"/>
    </g>
  ),
}

const BODY_SHAPE = "M150,90 C120,90 95,110 90,140 C85,165 88,200 95,215 C105,235 125,245 150,245 C175,245 195,235 205,215 C212,200 215,165 210,140 C205,110 180,90 150,90 Z"
const HEAD_SHAPE = "M150,55 C125,55 105,70 100,88 C96,103 98,120 108,130 C118,140 133,145 150,145 C167,145 182,140 192,130 C202,120 204,103 200,88 C195,70 175,55 150,55 Z"
const EAR_L = "M108 78 Q100 45 118 38 Q128 60 115 82 Z"
const EAR_R = "M192 78 Q200 45 182 38 Q172 60 185 82 Z"

export default function TherianAvatar({ therian, size = 300, animated = false }: Props) {
  const { appearance } = therian
  const { primary, secondary, accent } = appearance.paletteColors
  const eyeShape = EYE_SHAPES[appearance.eyes] ?? EYE_SHAPES.round
  const PatternEl = PATTERN_DEFS[appearance.pattern] ?? PATTERN_DEFS.solid
  const SignatureEl = SIGNATURE_ELEMENTS[appearance.signature] ?? SIGNATURE_ELEMENTS.no_signature

  const isGradient = appearance.pattern === 'gradient'

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

      {/* Signature (detrás del cuerpo) */}
      {SignatureEl(primary, accent)}

      {/* Cuerpo */}
      <path d={BODY_SHAPE} fill={isGradient ? 'url(#bodyGrad)' : primary}/>

      {/* Patrón sobre cuerpo */}
      {PatternEl(primary, secondary)}

      {/* Orejas */}
      <path d={EAR_L} fill={primary} stroke={accent} strokeWidth="1"/>
      <path d={EAR_R} fill={primary} stroke={accent} strokeWidth="1"/>
      <path d="M110 76 Q103 50 118 42 Q125 58 116 79 Z" fill={secondary} opacity="0.6"/>
      <path d="M190 76 Q197 50 182 42 Q175 58 184 79 Z" fill={secondary} opacity="0.6"/>

      {/* Cabeza */}
      <path d={HEAD_SHAPE} fill={isGradient ? 'url(#bodyGrad)' : primary}/>

      {/* Nariz */}
      <ellipse cx="150" cy="120" rx="8" ry="5" fill={accent} opacity="0.9"/>

      {/* Ojos */}
      <g transform="translate(120, 103)">
        <path d={eyeShape} fill={accent}
              filter={therian.rarity === 'LEGENDARY' ? 'url(#legendary-glow)' : undefined}/>
        <circle cx="0" cy="0" r="2" fill="white" opacity="0.8"/>
      </g>
      <g transform="translate(180, 103)">
        <path d={eyeShape} fill={accent}
              filter={therian.rarity === 'LEGENDARY' ? 'url(#legendary-glow)' : undefined}/>
        <circle cx="0" cy="0" r="2" fill="white" opacity="0.8"/>
      </g>

      {/* Accesorios */}
      {therian.accessories?.map(id => (
        <React.Fragment key={id}>
          {ACCESSORY_RENDERERS[id]?.({ primary, secondary, accent })}
        </React.Fragment>
      ))}

      {/* Efecto rareza */}
      {therian.rarity === 'LEGENDARY' && (
        <>
          <circle cx="150" cy="150" r="140" fill="none" stroke={accent} strokeWidth="1" opacity="0.2"/>
          <circle cx="150" cy="150" r="130" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.15" strokeDasharray="5 8"/>
        </>
      )}
      {therian.rarity === 'EPIC' && (
        <circle cx="150" cy="150" r="140" fill="none" stroke="#C084FC" strokeWidth="1" opacity="0.15"/>
      )}
    </svg>
  )
}
