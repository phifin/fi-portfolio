import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Github, Linkedin } from 'lucide-react'
import { HeroScene } from '../three/HeroScene'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { profile, contacts, sectionIds } from '../../data/content'
import { scrollToId } from '../../hooks/useLenis'

export function Hero() {
  const { pick } = useLang()
  const { tier, dpr } = useDeviceTier()
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(true)
  const [degraded, setDegraded] = useState(false)

  // Pause the WebGL render loop entirely when the hero is scrolled out of view.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '120px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const bloomOn = tier !== 'low' && !degraded

  return (
    <section ref={sectionRef} id={sectionIds.hero} className="relative min-h-[100svh] w-full overflow-hidden">
      {/* 3D canvas backdrop — frozen when off-screen */}
      <div className="absolute inset-0">
        <Canvas
          frameloop={visible ? 'always' : 'never'}
          dpr={dpr}
          camera={{ position: [0, 0, 5.5], fov: 50 }}
          gl={{ antialias: tier === 'high', powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <PerformanceMonitor onDecline={() => setDegraded(true)}>
              <HeroScene tier={degraded ? 'low' : tier} />
              {bloomOn && (
                <EffectComposer>
                  <Bloom
                    intensity={tier === 'high' ? 0.9 : 0.6}
                    luminanceThreshold={0.22}
                    luminanceSmoothing={0.9}
                    mipmapBlur
                  />
                </EffectComposer>
              )}
            </PerformanceMonitor>
            <AdaptiveDpr pixelated />
          </Suspense>
        </Canvas>
      </div>

      {/* gradient vignette so text stays legible over the scene */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_30%,rgba(5,6,14,0.7)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />

      {/* overlay content */}
      <div className="container-page relative flex min-h-[100svh] flex-col justify-center pb-28 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="chip mb-6 w-fit"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {pick(ui.hero.available)}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          {profile.name.split(' ').slice(0, -1).join(' ')}{' '}
          <span className="text-gradient glow-cyan">{profile.name.split(' ').slice(-1)}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-4 font-mono text-base uppercase tracking-[0.25em] text-accent-cyan sm:text-lg"
        >
          {pick(profile.role)}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-6 max-w-2xl text-lg text-white/70 sm:text-xl"
        >
          {pick(profile.tagline)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={() => scrollToId(sectionIds.about)}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue px-6 py-3 font-semibold text-ink-950 shadow-glow transition-transform hover:scale-[1.03]"
          >
            {pick(ui.hero.cta)}
          </button>
          <a
            href={`${import.meta.env.BASE_URL}${profile.cv}`}
            target="_blank"
            rel="noreferrer"
            className="glass rounded-full px-6 py-3 font-semibold text-white/90 transition-colors hover:bg-white/10"
          >
            {pick(ui.hero.resume)}
          </a>
          <div className="ml-1 flex items-center gap-2">
            <a
              href={contacts.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex h-11 w-11 items-center justify-center rounded-full glass text-white/70 transition-colors hover:text-accent-cyan"
            >
              <Github size={19} strokeWidth={2} />
            </a>
            <a
              href={contacts.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full glass text-white/70 transition-colors hover:text-accent-cyan"
            >
              <Linkedin size={19} strokeWidth={2} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* scroll hint — hidden on short viewports to avoid overlapping the CTAs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 hidden flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 [@media(min-height:760px)]:flex"
      >
        {pick(ui.hero.scroll)}
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="h-8 w-px bg-gradient-to-b from-accent-cyan to-transparent"
        />
      </motion.div>
    </section>
  )
}
