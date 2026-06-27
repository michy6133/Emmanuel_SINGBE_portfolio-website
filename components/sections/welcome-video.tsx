'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import Image from 'next/image'
import type { WelcomeVideoContent } from '@/lib/types'

type WelcomeVideoProps = {
  content: WelcomeVideoContent
}

function safePlay(video: HTMLVideoElement): void {
  const promise = video.play()
  if (promise && typeof promise.catch === 'function') {
    promise.catch(() => {
      // AbortError ou autoplay bloqué — ignoré silencieusement
    })
  }
}

export function WelcomeVideo({ content }: WelcomeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [muted, setMuted] = useState(true)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    if (!content.enabled || videoError) return

    const video = videoRef.current
    if (!video) return

    // Charge la vidéo après le rendu initial pour ne pas bloquer la page
    const loadVideo = () => {
      video.preload = 'auto'
      video.load()
      safePlay(video)
    }

    let idleId: number | undefined
    let timerId: ReturnType<typeof setTimeout> | undefined

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(loadVideo, { timeout: 2000 })
    } else {
      timerId = setTimeout(loadVideo, 300)
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timerId !== undefined) clearTimeout(timerId)
    }
  }, [content.enabled, videoError])

  if (!content.enabled) return null

  return (
    <section
      id="welcome"
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        {/* Poster affiché immédiatement — ne bloque pas le chargement */}
        <Image
          src={content.posterImage}
          alt={content.title}
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${
            videoReady && !videoError ? 'opacity-0' : 'opacity-70'
          }`}
        />

        {!videoError && (
          <video
            ref={videoRef}
            muted={muted}
            loop
            playsInline
            autoPlay
            preload="none"
            poster={content.posterImage}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoReady ? 'opacity-80' : 'opacity-0'
            }`}
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoError(true)}
          >
            <source src={content.videoUrl} type="video/mp4" />
          </video>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 py-24 text-center md:px-8">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-white/90 backdrop-blur"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          Vidéo d&apos;accueil
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          {content.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-4 max-w-xl text-pretty text-base text-white/70 sm:text-lg"
        >
          {content.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex items-center justify-center"
        >
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Activer le son' : 'Couper le son'}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:border-primary/50"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </motion.div>

        {videoError && (
          <p className="mt-4 text-xs text-white/50">
            Placez votre vidéo dans{' '}
            <code className="text-primary">public{content.videoUrl}</code>
          </p>
        )}
      </div>
    </section>
  )
}
