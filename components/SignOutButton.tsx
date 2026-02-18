'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="text-[#8B84B0] hover:text-white text-sm transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-white/5"
    >
      Salir
    </button>
  )
}
