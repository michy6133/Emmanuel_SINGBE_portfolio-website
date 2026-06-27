'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme')
    const light = savedTheme === 'light'

    document.documentElement.classList.toggle('light', light)

    const frame = window.requestAnimationFrame(() => {
      setIsLight(light)
      setMounted(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  const toggleTheme = () => {
    const nextIsLight = !isLight

    document.documentElement.classList.toggle('light', nextIsLight)
    window.localStorage.setItem('theme', nextIsLight ? 'light' : 'dark')
    setIsLight(nextIsLight)
  }

  const Icon = isLight ? Moon : Sun
  const label = isLight ? 'Activer le mode sombre' : 'Activer le mode clair'

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
    >
      <Icon className="size-4" aria-hidden="true" />
      <span className="sr-only">{mounted ? label : 'Changer de thème'}</span>
    </button>
  )
}
