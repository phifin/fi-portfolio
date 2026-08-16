import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { useLang } from '../../providers/LanguageProvider'
import { profile } from '../../data/content'
import { getLenis } from '../../hooks/useLenis'

const avatarUrl = `${import.meta.env.BASE_URL}${profile.avatar}`

// tech tokens that fly in and settle into orbit around the avatar
const TECHS = [
  { t: 'React', c: '#61dafb' },
  { t: 'Go', c: '#2dd4ff' },
  { t: 'Java', c: '#f89820' },
  { t: 'Kafka', c: '#4f8cff' },
  { t: 'Temporal', c: '#8b9dff' },
  { t: 'gRPC', c: '#34d399' },
  { t: 'PostgreSQL', c: '#38bdf8' },
  { t: 'TypeScript', c: '#5b9bff' },
  { t: 'Kubernetes', c: '#60a5fa' },
  { t: 'Redis', c: '#fb7185' },
]

const BOX = 600 // design size of the orbit; scaled to fit viewport
const CENTER = BOX / 2

// precompute a settled orbit position + an off-screen fly-in origin for each chip
const ORBIT = TECHS.map((tech, i) => {
  const angle = (i / TECHS.length) * Math.PI * 2 - Math.PI / 2
  const r = i % 2 === 0 ? 208 : 258
  const x = Math.cos(angle) * r
  const y = Math.sin(angle) * r
  return { ...tech, x, y, fromX: Math.cos(angle) * 780, fromY: Math.sin(angle) * 780, bob: 5 + (i % 3) * 2 }
})

const strings = { pull: { en: 'Pull up to enter', vi: 'Kéo lên để vào' } }

export function Intro({ onDone }: { onDone: () => void }) {
  const { lang } = useLang()
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)
  const exitingRef = useRef(false)

  const rm = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const fit = () => setScale(Math.min(1, window.innerWidth / 740, window.innerHeight / 780))
    fit()
    window.addEventListener('resize', fit)
    const lenis = getLenis()
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setReady(true), rm ? 200 : 2300)
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
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.18),transparent_68%)]" />

      {/* orbit: everything animates transform/opacity only (GPU compositing) */}
      <div className="absolute left-1/2 top-[46%] flex items-center justify-center" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div className="relative" style={{ width: BOX, height: BOX }}>
          {/* spokes from centre to each settled chip */}
          <svg width={BOX} height={BOX} className="absolute inset-0 overflow-visible">
            {ORBIT.map((o, i) => (
              <motion.line
                key={i}
                x1={CENTER} y1={CENTER} x2={CENTER + o.x} y2={CENTER + o.y}
                stroke={o.c} strokeOpacity={0.22} strokeWidth={1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: D(0.6 + i * 0.05), duration: rm ? 0 : 0.6 }}
              />
            ))}
          </svg>

          {/* flying tech chips */}
          {ORBIT.map((o, i) => (
            <motion.div
              key={o.t}
              className="absolute left-1/2 top-1/2"
              style={{ willChange: 'transform' }}
              initial={{ x: o.fromX, y: o.fromY, opacity: 0, scale: 0.4 }}
              animate={{ x: o.x, y: o.y, opacity: 1, scale: 1 }}
              transition={{ delay: D(0.15 + i * 0.07), type: rm ? 'tween' : 'spring', stiffness: 90, damping: 14, duration: rm ? 0 : undefined }}
            >
              <motion.span
                animate={rm ? undefined : { y: [0, -o.bob, 0] }}
                transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                className="block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold"
                style={{ borderColor: `${o.c}66`, background: `${o.c}18`, color: '#fff', boxShadow: `0 0 18px -6px ${o.c}` }}
              >
                {o.t}
              </motion.span>
            </motion.div>
          ))}

          {/* pulsing ring behind the avatar */}
          {!rm && (
            <motion.div
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-cyan/40"
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
            />
          )}

          {/* avatar */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-2 ring-accent-cyan/70"
            style={{ boxShadow: '0 0 60px -12px rgba(45,212,255,0.7)', willChange: 'transform' }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: D(0.5), type: rm ? 'tween' : 'spring', stiffness: 160, damping: 15, duration: rm ? 0 : undefined }}
          >
            <img src={avatarUrl} alt={profile.name} className="h-full w-full object-cover" width={144} height={144} />
          </motion.div>
        </div>
      </div>

      {/* name + role */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[8%] z-10 flex flex-col items-center px-6 text-center">
        <div className="overflow-hidden">
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
          className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan sm:text-sm"
        >
          {profile.role[lang]}
        </motion.p>
      </div>

      {/* pull-up handle */}
      <AnimatePresence>
        {ready && !exiting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 pb-7"
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
