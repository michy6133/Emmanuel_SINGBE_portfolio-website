'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Stat } from '@/lib/types'

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf = 0
    const duration = 1600
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * value))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

type StatsProps = {
  stats: Stat[]
}

export function Stats({ stats }: StatsProps) {
  return (
    <section id="stats" className="border-y border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-0 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex flex-col items-center gap-2 px-6 py-12 text-center md:py-16"
          >
            <span className="font-heading text-5xl font-extrabold tracking-tight text-primary md:text-6xl">
              <Counter value={stat.value} suffix={stat.suffix} />
            </span>
            <span className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
