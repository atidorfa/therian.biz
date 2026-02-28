'use client'

import TherianAvatarSVG from './TherianAvatarSVG'
import TherianAvatarChibi from './TherianAvatarChibi'
import type { TherianDTO } from '@/lib/therian-dto'

interface Props {
  therian: TherianDTO
  size?: number
  animated?: boolean
  isWalking?: boolean
  isJumping?: boolean
}

export default function TherianAvatar({
  therian,
  size = 300,
  animated = false,
  isWalking,
  isJumping,
}: Props) {
  // Always use chibi form (animated SVG with limbs)
  return (
    <TherianAvatarChibi
      therian={therian}
      size={size}
      animated={animated}
      isWalking={isWalking}
      isJumping={isJumping}
    />
  )
}
