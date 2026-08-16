import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { useLang } from '../../providers/LanguageProvider'
import { profile } from '../../data/content'
import { getLenis } from '../../hooks/useLenis'
import { TechGlyph, logoHex } from '../diagram/techLogos'

const avatarUrl = `${import.meta.env.BASE_URL}${profile.avatar}`

// tech tokens (all have real brand glyphs) that fly in and settle into orbit
const TECHS = ['React', 'TypeScript', 'Go', 'Java', 'NestJS', 'Kafka', 'Temporal', 'PostgreSQL', 'MongoDB', 'Redis', 'Kubernetes', 'Docker']

const BOX = 640 // design size of the orbit; scaled to fit viewport
const CENTER = BOX / 2

// spread chips around the top + sides, leaving a gap at the bottom for the name
const ORBIT = TECHS.map((t, i) => {
  const deg = -235 + (i / (TECHS.length - 1)) * 290 // -235°..55°, 70° gap at bottom
  const angle = (deg * Math.PI) / 180
  const r = i % 2 === 0 ? 210 : 262
  const hex = logoHex(t) ?? '#4f8cff'
  return {
    t, hex, angle,
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r,
    fromX: Math.cos(angle) * 900,
    fromY: Math.sin(angle) * 900,
    bob: 4 + (i % 3) * 2,
  }
})

// floating glass keyword/stat cards drifting behind the orbit for depth
const KEYWORDS = [
  { t: { en: 'Event-Driven', vi: 'Event-Driven' }, x: -360, y: -230 },
  { t: { en: 'Microservices', vi: 'Microservices' }, x: 360, y: -230 },
  { t: { en: 'Saga · Temporal', vi: 'Saga · Temporal' }, x: 386, y: 60 },
  { t: { en: 'API Gateway', vi: 'API Gateway' }, x: -386, y: 60 },
]

const strings = { pull: { en: 'Pull up to enter', vi: 'Kéo lên để vào' } }

export function Intro({ onDone }: { onDone: () => void }) {
  const { lang, pick } = useLang()
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)
  const exitingRef = useRef(false)

  const rm = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const fit = () => setScale(Math.min(1, window.innerWidth / 820, window.innerHeight / 860))
    fit()
    window.addEventListener('resize', fit)
    const lenis = getLenis()
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setReady(true), rm ? 200 : 2400)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', fit)
    }
  }, [rm])

  const exit = () => {
    if (exitingRef.current) return
    exitingRef.current = true
    setExiting(true)
    document.body.style.overflow = ''
    getLenis()?.start()
    setTimeout(onDone, 850)
  }

  useEffect(() => {
    if (!ready) return
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 4) exit() }
    const onKey = (e: KeyboardEvent) => { if (['ArrowUp', 'Enter', ' ', 'ArrowDown'].includes(e.key)) exit() }
    let startY = 0
    const onTS = (e: TouchEvent) => { startY = e.touches[0].clientY }
    const onTM = (e: TouchEvent) => { if (startY - e.touches[0].clientY > 24) exit() }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTS, { passive: true })
    window.addEventListener('touchmove', onTM, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTS)
      window.removeEventListener('touchmove', onTM)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  const first = profile.name.split(' ').slice(0, -1).join(' ')
  const last = profile.name.split(' ').slice(-1)
  const D = (s: number) => (rm ? 0 : s) // delay helper honouring reduced-motion

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-ink-950"
      initial={{ y: 0 }}
      animate={{ y: exiting ? '-100%' : 0 }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* ambient grid + radial glow (static, cheap) */}
      <div className="grid-bg absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-[42%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.20),transparent_68%)]" />

      {/* orbit stage: everything animates transform/opacity only (GPU compositing) */}
      <div className="absolute left-1/2 top-[42%] flex items-center justify-center" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div className="relative" style={{ width: BOX, height: BOX }}>
          {/* slow rotating dashed rings for depth */}
          {!rm && [0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full border border-dashed"
              style={{
                width: i ? 540 : 400, height: i ? 540 : 400, x: '-50%', y: '-50%',
                borderColor: i ? 'rgba(79,140,255,0.16)' : 'rgba(45,212,255,0.18)',
              }}
              animate={{ rotate: i ? -360 : 360 }}
              transition={{ duration: i ? 90 : 60, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          {/* floating keyword cards (parallax depth) — desktop only, they'd clip on phones */}
          {scale > 0.7 && KEYWORDS.map((k, i) => (
            <motion.div
              key={k.t.en}
              className="absolute left-1/2 top-1/2"
              initial={{ x: k.x, y: k.y, opacity: 0, scale: 0.8 }}
              animate={{ x: k.x, y: k.y, opacity: 1, scale: 1 }}
              transition={{ delay: D(1.4 + i * 0.12), duration: rm ? 0 : 0.7 }}
              style={{ willChange: 'transform' }}
            >
              <motion.span
                animate={rm ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                className="block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] tracking-wide text-white/45 backdrop-blur-sm"
              >
                {pick(k.t)}
              </motion.span>
            </motion.div>
          ))}

          {/* spokes + inward data packets */}
          <svg width={BOX} height={BOX} className="absolute inset-0 overflow-visible">
            {ORBIT.map((o, i) => (
              <motion.line
                key={i}
                x1={CENTER} y1={CENTER} x2={CENTER + o.x} y2={CENTER + o.y}
                stroke={o.hex} strokeOpacity={0.2} strokeWidth={1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: D(0.6 + i * 0.04), duration: rm ? 0 : 0.6 }}
              />
            ))}
            {!rm && ORBIT.filter((_, i) => i % 2 === 0).map((o, i) => (
              <motion.circle
                key={i}
                r={2.6}
                fill={o.hex}
                style={{ filter: `drop-shadow(0 0 4px ${o.hex})` }}
                initial={{ cx: CENTER + o.x, cy: CENTER + o.y, opacity: 0 }}
                animate={{ cx: [CENTER + o.x, CENTER], cy: [CENTER + o.y, CENTER], opacity: [0, 1, 0] }}
                transition={{ duration: 2.4, delay: 2.4 + i * 0.3, repeat: Infinity, repeatDelay: 1.2, ease: 'easeIn' }}
              />
            ))}
          </svg>

          {/* flying tech chips with real logos */}
          {ORBIT.map((o, i) => (
            <motion.div
              key={o.t}
              className="absolute left-1/2 top-1/2"
              style={{ willChange: 'transform' }}
              initial={{ x: o.fromX, y: o.fromY, opacity: 0, scale: 0.4 }}
              animate={{ x: o.x, y: o.y, opacity: 1, scale: 1 }}
              transition={{ delay: D(0.15 + i * 0.06), type: rm ? 'tween' : 'spring', stiffness: 90, damping: 14, duration: rm ? 0 : undefined }}
            >
              <motion.span
                animate={rm ? undefined : { y: [0, -o.bob, 0] }}
                transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-semibold backdrop-blur-sm"
                style={{ borderColor: `${o.hex}66`, background: `${o.hex}14`, color: '#fff', boxShadow: `0 0 20px -8px ${o.hex}` }}
              >
                <TechGlyph name={o.t} size={17} />
                {o.t}
              </motion.span>
            </motion.div>
          ))}

          {/* pulsing rings behind the avatar */}
          {!rm && [0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-cyan/40"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: i * 1.4 }}
            />
          ))}

          {/* avatar */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-2 ring-accent-cyan/70"
            style={{ boxShadow: '0 0 70px -12px rgba(45,212,255,0.75)', willChange: 'transform' }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: D(0.5), type: rm ? 'tween' : 'spring', stiffness: 160, damping: 15, duration: rm ? 0 : undefined }}
          >
            <img src={avatarUrl} alt={profile.name} className="h-full w-full object-cover" width={144} height={144} />
          </motion.div>
        </div>
      </div>

      {/* name + role, over a scrim so it never collides with the orbit */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-[8%] pt-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-transparent" />
        <div className="relative overflow-hidden">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: D(1.15), duration: rm ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl"
          >
            {first} <span className="text-gradient">{last}</span>
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D(1.6), duration: rm ? 0 : 0.7 }}
          className="relative mt-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan sm:text-sm"
        >
          {profile.role[lang]}
        </motion.p>
        {/* live stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D(1.9), duration: rm ? 0 : 0.7 }}
          className="relative mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-[11px] text-white/45"
        >
          {[
            { v: '3y', l: { en: 'in production', vi: 'kinh nghiệm' } },
            { v: '30k+', l: { en: 'merchants', vi: 'merchant' } },
            { v: '4M+', l: { en: 'orders / mo', vi: 'đơn / tháng' } },
          ].map((s) => (
            <span key={s.v}>
              <span className="font-bold text-white/80">{s.v}</span> {pick(s.l)}
            </span>
          ))}
        </motion.div>
      </div>

      {/* pull-up handle */}
      <AnimatePresence>
        {ready && !exiting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 pb-6"
          >
            <motion.button
              onClick={exit}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.5}
              onDragEnd={(_, info) => { if (info.offset.y < -40 || info.velocity.y < -250) exit() }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex cursor-grab flex-col items-center gap-2 active:cursor-grabbing"
              aria-label="Enter site"
            >
              <span className="glass flex h-12 w-12 items-center justify-center rounded-full text-accent-cyan">
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
                  <ChevronUp size={22} strokeWidth={2.5} />
                </motion.span>
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">{strings.pull[lang]}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
