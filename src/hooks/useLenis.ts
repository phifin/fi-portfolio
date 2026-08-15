import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisSingleton: Lenis | null = null

export function getLenis() {
  return lenisSingleton
}

/**
 * Smooth scrolling via Lenis, synced with GSAP ScrollTrigger.
 * Disabled when the user prefers reduced motion (native scroll instead).
 */
export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    lenisSingleton = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const onRaf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onRaf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onRaf)
      lenis.destroy()
      lenisSingleton = null
    }
  }, [])
}

/** Smoothly scroll to a section id (works with or without Lenis). */
export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = getLenis()
  if (lenis) lenis.scrollTo(el, { offset: -10, immediate })
  else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
}
