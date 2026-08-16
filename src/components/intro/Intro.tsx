import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { useLang } from '../../providers/LanguageProvider'
import { profile } from '../../data/content'
import { getLenis } from '../../hooks/useLenis'
import { TechGlyph } from '../diagram/techLogos'

const avatarUrl = `${import.meta.env.BASE_URL}${profile.avatar}`

// techs grouped into MEANINGFUL layers — each cluster sits in its own arc with a label
type Cat = { key: string; label: { en: string; vi: string }; color: string; techs: string[] }
const CATS: Cat[] = [
  { key: 'data', label: { en: 'Data & Cache', vi: 'Dữ liệu & Cache' }, color: '#38bdf8', techs: ['PostgreSQL', 'MongoDB', 'Redis'] },
  { key: 'frontend', label: { en: 'Frontend', vi: 'Frontend' }, color: '#4f8cff', techs: ['React', 'TypeScript', 'Next.js'] },
  { key: 'backend', label: { en: 'Backend', vi: 'Backend' }, color: '#2dd4ff', techs: ['Go', 'Java', 'NestJS'] },
  { key: 'infra', label: { en: 'Infra · Ops', vi: 'Infra · Ops' }, color: '#8b9dff', techs: ['Kafka', 'Temporal', 'Docker', 'Kubernetes'] },
]

const BOX = 860
const C = BOX / 2
const RX = 372
const RY = 256
const START = -232 // degrees; arc sweeps the top + sides, leaving the bottom clear for the name
const SPAN = 284
const rad = (d: number) => (d * Math.PI) / 180

const FLAT = CATS.flatMap((c) => c.techs.map((t) => ({ t, color: c.color })))
const ORBIT = FLAT.map((item, i) => {
  const deg = START + ((i + 0.5) / FLAT.length) * SPAN
  const a = rad(deg)
  return { ...item, x: Math.cos(a) * RX, y: Math.sin(a) * RY, fromX: Math.cos(a) * 1200, fromY: Math.sin(a) * 900 }
})

// one bright category label per cluster, placed just outside its arc
let _cursor = 0
const CAT_LABELS = CATS.map((c) => {
  const mid = _cursor + c.techs.length / 2 - 0.5
  _cursor += c.techs.length
  const deg = START + ((mid + 0.5) / FLAT.length) * SPAN
  const a = rad(deg)
  return { ...c, x: Math.cos(a) * (RX + 74), y: Math.sin(a) * (RY + 58) }
})

const strings = { pull: { en: 'Pull up to enter', vi: 'Kéo lên để vào' } }

export function Intro({ onDone }: { onDone: () => void }) {
  const { lang, pick } = useLang()
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)
  const exitingRef = useRef(false)

  const rm = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const fit = () => setScale(Math.min(1, window.innerWidth / 1000, window.innerHeight / 900))
    fit()
    window.addEventListener('resize', fit)
    const lenis = getLenis()
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setReady(true), rm ? 200 : 2200)
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
  const D = (s: number) => (rm ? 0 : s)

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-ink-950"
      initial={{ y: 0 }}
      animate={{ y: exiting ? '-100%' : 0 }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* ambient backdrop — grid + wide nebula glows so the sides aren't empty */}
      <div className="grid-bg absolute inset-0 opacity-[0.35]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_42%,rgba(79,140,255,0.14),transparent_42%),radial-gradient(circle_at_84%_42%,rgba(45,212,255,0.14),transparent_42%),radial-gradient(circle_at_50%_46%,rgba(79,140,255,0.16),transparent_60%)]" />

      {/* orbit stage — transform/opacity only */}
      <div className="absolute left-1/2 top-[44%] flex items-center justify-center" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div className="relative" style={{ width: BOX, height: BOX }}>
          {/* single slow-rotating dashed ring (cheap) */}
          {!rm && (
            <motion.div
              className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/10"
              style={{ width: RX * 2 + 40, height: RY * 2 + 40, x: '-50%', y: '-50%' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* spokes + a few inward data packets */}
          <svg width={BOX} height={BOX} className="absolute inset-0 overflow-visible">
            {ORBIT.map((o, i) => (
              <motion.line
                key={i}
                x1={C} y1={C} x2={C + o.x} y2={C + o.y}
                stroke={o.color} strokeOpacity={0.18} strokeWidth={1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: D(0.6 + i * 0.03), duration: rm ? 0 : 0.6 }}
              />
            ))}
            {!rm && ORBIT.filter((_, i) => i % 3 === 0).map((o, i) => (
              <motion.circle
                key={i}
                r={2.8}
                fill={o.color}
                style={{ filter: `drop-shadow(0 0 4px ${o.color})` }}
                initial={{ cx: C + o.x, cy: C + o.y, opacity: 0 }}
                animate={{ cx: [C + o.x, C], cy: [C + o.y, C], opacity: [0, 1, 0] }}
                transition={{ duration: 2.6, delay: 2.2 + i * 0.5, repeat: Infinity, repeatDelay: 1.6, ease: 'easeIn' }}
              />
            ))}
          </svg>

          {/* bright category labels — radial on desktop; hidden on phones (no room) */}
          {scale >= 0.62 && CAT_LABELS.map((c, i) => (
            <motion.div
              key={c.key}
              className="absolute left-1/2 top-1/2"
              initial={{ x: c.x, y: c.y, opacity: 0 }}
              animate={{ x: c.x, y: c.y, opacity: 1 }}
              transition={{ delay: D(1.5 + i * 0.1), duration: rm ? 0 : 0.5 }}
            >
              <span
                className="block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: c.color, borderColor: `${c.color}55`, background: `${c.color}12`, textShadow: `0 0 12px ${c.color}66` }}
              >
                {pick(c.label)}
              </span>
            </motion.div>
          ))}

          {/* flying tech chips with real logos (fly-in once, then rest — no infinite loop) */}
          {ORBIT.map((o, i) => (
            <motion.div
              key={o.t}
              className="absolute left-1/2 top-1/2"
              style={{ willChange: 'transform' }}
              initial={{ x: o.fromX, y: o.fromY, opacity: 0, scale: 0.5 }}
              animate={{ x: o.x, y: o.y, opacity: 1, scale: 1 }}
              transition={{ delay: D(0.15 + i * 0.05), type: rm ? 'tween' : 'spring', stiffness: 80, damping: 15, duration: rm ? 0 : undefined }}
            >
              <span
                className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-semibold"
                style={{ borderColor: `${o.color}66`, background: `${o.color}16`, color: '#fff', boxShadow: `0 0 20px -8px ${o.color}` }}
              >
                <TechGlyph name={o.t} size={17} />
                {o.t}
              </span>
            </motion.div>
          ))}

          {/* single pulsing ring behind the avatar */}
          {!rm && (
            <motion.div
              className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-cyan/40"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
            />
          )}

          {/* avatar */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-2 ring-accent-cyan/70"
            style={{ boxShadow: '0 0 70px -12px rgba(45,212,255,0.75)', willChange: 'transform' }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: D(0.4), type: rm ? 'tween' : 'spring', stiffness: 160, damping: 15, duration: rm ? 0 : undefined }}
          >
            <img src={avatarUrl} alt={profile.name} className="h-full w-full object-cover" width={160} height={160} />
          </motion.div>
        </div>
      </div>

      {/* name + role + stats over a scrim */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-28 pt-24 text-center sm:pb-[7%] sm:pt-28">
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-transparent" />
        <div className="relative overflow-hidden">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: D(1.1), duration: rm ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl"
          >
            {first} <span className="text-gradient">{last}</span>
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D(1.5), duration: rm ? 0 : 0.7 }}
          className="relative mt-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan sm:text-sm"
        >
          {profile.role[lang]}
        </motion.p>
        {/* mobile category legend (radial labels are hidden on phones) */}
        {scale < 0.62 && (
          <div className="relative mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider">
            {CATS.map((c) => (
              <span key={c.key} className="inline-flex items-center gap-1" style={{ color: c.color }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
                {pick(c.label)}
              </span>
            ))}
          </div>
        )}
        {scale >= 0.62 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D(1.8), duration: rm ? 0 : 0.7 }}
            className="relative mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-[11px] text-white/50"
          >
            {[
              { v: '3y', l: { en: 'in production', vi: 'kinh nghiệm' } },
              { v: '30k+', l: { en: 'merchants', vi: 'merchant' } },
              { v: '4M+', l: { en: 'orders / mo', vi: 'đơn / tháng' } },
            ].map((s) => (
              <span key={s.v}>
                <span className="font-bold text-white/85">{s.v}</span> {pick(s.l)}
              </span>
            ))}
          </motion.div>
        )}
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
