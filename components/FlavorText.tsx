'use client'

import { useEffect, useState } from 'react'

interface Props {
  text: string
  key?: string | number
}

export default function FlavorText({ text }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [text])

  return (
    <div
      className={`
        rounded-xl border border-white/5 bg-white/3 px-5 py-4
        text-[#A99DC0] italic text-sm leading-relaxed
        transition-all duration-700 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <span className="text-purple-400/60 mr-1">"</span>
      {text}
      <span className="text-purple-400/60 ml-1">"</span>
    </div>
  )
}
