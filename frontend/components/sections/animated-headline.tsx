'use client'

import { useEffect, useState } from 'react'

const WORDS = [
  'Coders',
  'Data Analysts',
  'Code Writers',
  'Doctors',
  'Youtubers',
  'Engineers',
  'Programmer',
]

export function AnimatedWord() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Show the word for 2.6s, then fade out for 0.4s, then swap + fade in
    const showTimer = setTimeout(() => {
      setVisible(false)

      const swapTimer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % WORDS.length)
        setVisible(true)
      }, 400) // matches the CSS transition duration

      return () => clearTimeout(swapTimer)
    }, 2600)

    return () => clearTimeout(showTimer)
  }, [index])

  return (
    <span
      className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        willChange: 'opacity, transform',
        // Prevent layout shift: fix line height to avoid reflow
        display: 'block',
        minHeight: '1.15em',
      }}
    >
      {WORDS[index]}
    </span>
  )
}
