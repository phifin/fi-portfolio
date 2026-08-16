import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLang } from '../../providers/LanguageProvider'
import { profile } from '../../data/content'
import { getLenis } from '../../hooks/useLenis'
import { TechGlyph } from '../diagram/techLogos'

const avatarUrl = `${import.meta.env.BASE_URL}${profile.avatar}`

// ── the engineering system: an inner "application" orbit and an outer "platform"
//    orbit. Colour carries the category; the ring carries the architectural layer.
type Cat = { key: string; label: { en: string; vi: string }; color: string; ring: 0 | 1; techs: string[] }
const CATS: Cat[] = [
  { key: 'frontend', label: { en: 'Frontend', vi: 'Frontend' }, color: '#4f8cff', ring: 0, techs: ['React', 'Next.js', 'TypeScript'] },
  { key: 'backend', label: { en: 'Backend', vi: 'Backend' }, color: '#22d3ee', ring: 0, techs: ['Go', 'Java', 'NestJS'] },
  { key: 'data', label: { en: 'Data & Cache', vi: 'Dữ liệu & Cache' }, color: '#38bdf8', ring: 1, techs: ['Redis', 'MongoDB', 'PostgreSQL'] },
  { key: 'infra', label: { en: 'Infrastructure', vi: 'Hạ tầng' }, color: '#818cf8', ring: 1, techs: ['Kafka', 'Temporal', 'Docker', 'Kubernetes'] },
]

const BOX = 880
const C = BOX / 2
const RINGS = [
  { rx: 250, ry: 150 },
  { rx: 396, ry: 222 },
] as const
const START = -228 // deg — sweep the top and both sides, leaving a gap at bottom-centre for the name
const SPAN = 276
const rad = (d: number) => (d * Math.PI) / 180

type OrbitNode = { t: string; color: string; ring: 0 | 1; cat: { en: string; vi: string }; x: number; y: number }
const byRing: OrbitNode[][] = [[], []]
CATS.forEach((c) => c.techs.forEach((t) => byRing[c.ring].push({ t, color: c.color, ring: c.ring, cat: c.label, x: 0, y: 0 })))
const NODES: OrbitNode[] = byRing.flatMap((arr, ring) => {
  const { rx, ry } = RINGS[ring]
  return arr.map((item, i) => {
    const a = rad(START + ((i + 0.5) / arr.length) * SPAN)
    return { ...item, x: Math.cos(a) * rx, y: Math.sin(a) * ry }
  })
})
const FLAT = CATS.flatMap((c) => c.techs.map((t) => ({ t, color: c.color })))

// closed elliptical path for a particle to slowly traverse
const ellipsePath = (rx: number, ry: number) =>
  `M ${C - rx} ${C} a ${rx} ${ry} 0 1 0 ${2 * rx} 0 a ${rx} ${ry} 0 1 0 ${-2 * rx} 0`

const TAGLINE = {
  en: 'Building scalable products from interface to infrastructure.',
  vi: 'Xây dựng sản phẩm quy mô lớn — từ giao diện đến hạ tầng.',
}
const EXPLORE = { en: 'Scroll to explore', vi: 'Cuộn để khám phá' }
const STATS = [
  { v: '03+', l: { en: 'Years shipping', vi: 'Năm kinh nghiệm' } },
  { v: '30K+', l: { en: 'Merchants', vi: 'Merchant' } },
  { v: '04M+', l: { en: 'Orders / month', vi: 'Đơn / tháng' } },
]

export function Intro({ onDone }: { onDone: () => void }) {
  const { lang, pick } = useLang()
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [hover, setHover] = useState<number | null>(null)
  const exitingRef = useRef(false)

  const rm = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const [scale, setScale] = useState(1)
  const [compact, setCompact] = useState(false)
  const [short, setShort] = useState(false)
  const px = useMotionValue(0)
  const py = useMotionValue(0)

  useEffect(() => {
    const fit = () => {
      setScale(Math.min(1, window.innerWidth / 1040, window.innerHeight / 900))
      setCompact(window.innerWidth < 680)
      setShort(window.innerHeight < 880)
    }
    fit()
    window.addEventListener('resize', fit)
    const lenis = getLenis()
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setReady(true), rm ? 200 : 1500)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', fit)
    }
  }, [rm])

  // subtle pointer parallax on the orbit (transform only, desktop only)
  useEffect(() => {
    if (rm || compact) return
    const onMove = (e: MouseEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 20)
      py.set((e.clientY / window.innerHeight - 0.5) * 16)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rm, compact, px, py])

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
  const hoverRing = hover !== null ? NODES[hover].ring : null
  const stageTop = short ? '36%' : '42%'

  const Name = ({ className }: { className: string }) => (
    <h1 className={className}>
      <span className="text-white">{first}</span>{' '}
      <span className="bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">{last}</span>
    </h1>
  )
  const Stats = ({ className }: { className: string }) => (
    <div className={className}>
      {STATS.map((s) => (
        <div key={s.v} className="px-4 sm:px-7">
          <div className="text-lg font-bold tabular-nums text-white sm:text-2xl">{s.v}</div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 sm:text-[10px]">{pick(s.l)}</div>
        </div>
      ))}
    </div>
  )

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ background: '#05060b' }}
      initial={{ y: 0 }}
      animate={{ y: exiting ? '-100%' : 0 }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* ── background: near-black with one soft core glow + a whisper of grid ── */}
      <div className="grid-bg absolute inset-0 opacity-[0.12]" />
      <div
        className="pointer-events-none absolute left-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
        style={{ top: stageTop, background: 'radial-gradient(circle, rgba(34,211,238,0.14), rgba(79,140,255,0.08) 34%, transparent 66%)' }}
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 42%, transparent 40%, rgba(5,6,11,0.9) 100%)' }} />

      {compact ? (
        /* ── mobile: a calm vertical stack (no absolute overlap) ── */
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pb-24 pt-8 text-center">
          <motion.div
            className="relative mb-7 flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: D(0.2), duration: rm ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {!rm && (
              <div className="absolute h-52 w-52 rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.3), transparent 68%)' }} />
            )}
            <div className="absolute h-40 w-40 rounded-full border border-white/[0.08]" />
            <div
              className="relative h-32 w-32 overflow-hidden rounded-full"
              style={{ boxShadow: '0 0 0 1px rgba(120,200,255,0.25), 0 0 48px -10px rgba(34,211,238,0.6)' }}
            >
              <img src={avatarUrl} alt={profile.name} className="h-full w-full object-cover" width={128} height={128} />
            </div>
          </motion.div>

          <Name className="text-5xl font-extrabold uppercase leading-none tracking-tight" />
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.4em] text-accent-cyan">{profile.role[lang]}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">{TAGLINE[lang]}</p>

          <div className="mt-6 flex max-w-xs flex-wrap items-center justify-center gap-1.5">
            {FLAT.map((n) => (
              <span
                key={n.t}
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium text-white/70"
                style={{ borderColor: `${n.color}30`, background: 'rgba(255,255,255,0.03)' }}
              >
                <TechGlyph name={n.t} size={11} />
                {n.t}
              </span>
            ))}
          </div>

          <Stats className="mt-8 flex items-stretch justify-center divide-x divide-white/10" />
        </div>
      ) : (
        /* ── desktop / tablet: one centred identity column with the orbit haloing the avatar ── */
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          {/* avatar core, with the orbit composition centred on it and overflowing */}
          <div className="relative flex items-center justify-center">
            <motion.div className="pointer-events-none absolute left-1/2 top-1/2" style={{ x: px, y: py }}>
              <motion.div className="relative" style={{ width: BOX, height: BOX, x: '-50%', y: '-50%', scale }}>
                {/* orbit rings (ellipses) — emphasise on related hover */}
                {RINGS.map((r, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2 rounded-full border"
                    style={{
                      width: r.rx * 2, height: r.ry * 2, x: '-50%', y: '-50%',
                      borderColor: hoverRing === i ? 'rgba(120,190,255,0.35)' : 'rgba(255,255,255,0.07)',
                      transition: 'border-color 0.5s ease',
                    }}
                    animate={rm ? undefined : { rotate: i === 0 ? 360 : -360 }}
                    transition={{ duration: i === 0 ? 150 : 200, repeat: Infinity, ease: 'linear' }}
                  />
                ))}

                {/* particles drifting slowly along each orbit */}
                {!rm && (
                  <svg width={BOX} height={BOX} className="absolute inset-0 overflow-visible">
                    {RINGS.map((r, i) => (
                      <circle key={i} r={2.4} fill="#7fe4ff" opacity={0.7} style={{ filter: 'drop-shadow(0 0 5px #22d3ee)' }}>
                        <animateMotion dur={`${26 + i * 8}s`} repeatCount="indefinite" path={ellipsePath(r.rx, r.ry)} />
                      </circle>
                    ))}
                  </svg>
                )}

                {/* technology nodes — small, subtle, colour-coded by category */}
                {NODES.map((o, i) => {
                  const active = hover === i
                  const dim = hover !== null && !active
                  return (
                    <motion.div
                      key={o.t}
                      className="pointer-events-auto absolute left-1/2 top-1/2"
                      style={{ willChange: 'transform' }}
                      initial={{ x: o.x, y: o.y, opacity: 0, scale: 0.85 }}
                      animate={{ x: o.x, y: o.y, opacity: dim ? 0.4 : 1, scale: 1 }}
                      transition={{ delay: D(0.5 + i * 0.045), duration: rm ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(null)}
                    >
                      <div className="relative -translate-x-1/2 -translate-y-1/2">
                        <AnimatePresence>
                          {active && (
                            <motion.span
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                              style={{ color: o.color, background: 'rgba(6,9,18,0.9)', border: `1px solid ${o.color}44` }}
                            >
                              {pick(o.cat)}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <div
                          className="flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 backdrop-blur-sm transition-all duration-300"
                          style={{
                            borderColor: active ? `${o.color}` : `${o.color}33`,
                            background: active ? `${o.color}1f` : 'rgba(255,255,255,0.025)',
                            boxShadow: active ? `0 0 22px -6px ${o.color}` : 'none',
                          }}
                        >
                          <TechGlyph name={o.t} size={15} />
                          <span className={`text-xs font-medium transition-colors ${active ? 'text-white' : 'text-white/65'}`}>{o.t}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>

            {/* soft atmospheric glow hugging the avatar (no heavy border) */}
            {!rm && (
              <motion.div
                className="pointer-events-none absolute h-[260px] w-[260px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.28), transparent 68%)' }}
                animate={{ opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <motion.div
              className="relative overflow-hidden rounded-full"
              style={{
                width: 184, height: 184,
                boxShadow: '0 0 0 1px rgba(120,200,255,0.25), 0 0 60px -10px rgba(34,211,238,0.55)',
                willChange: 'transform',
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: D(0.3), duration: rm ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={avatarUrl} alt={profile.name} className="h-full w-full object-cover" width={184} height={184} />
              <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 30%, transparent 55%, rgba(5,6,11,0.55))' }} />
            </motion.div>
          </div>

          {/* ── identity, tucked directly under the avatar ── */}
          <div className="pointer-events-none relative z-20 mt-5 flex flex-col items-center">
            {/* soft scrim so the name always reads cleanly over any nearby orbit node */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 42%, rgba(5,6,11,0.92) 30%, transparent 72%)' }} />
            <div className="overflow-hidden">
              <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: D(0.9), duration: rm ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}>
                <Name className="text-6xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl" />
              </motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: D(1.25), duration: rm ? 0 : 0.6 }}
              className="mt-3 font-mono text-xs uppercase tracking-[0.5em] text-accent-cyan sm:text-sm"
            >
              {profile.role[lang]}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: D(1.4), duration: rm ? 0 : 0.6 }}
              className="mt-4 max-w-md text-sm leading-relaxed text-white/55 sm:text-base"
            >
              {TAGLINE[lang]}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: D(1.6), duration: rm ? 0 : 0.6 }}
            >
              <Stats className="mt-7 flex items-stretch justify-center divide-x divide-white/10" />
            </motion.div>
          </div>
        </div>
      )}

      {/* ── elegant scroll indicator ── */}
      <AnimatePresence>
        {ready && !exiting && (
          <motion.button
            onClick={exit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="group absolute inset-x-0 bottom-6 z-20 mx-auto flex w-fit flex-col items-center gap-2"
            aria-label="Enter site"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/45 transition-colors group-hover:text-white/70">
              {EXPLORE[lang]}
            </span>
            <motion.span
              animate={rm ? undefined : { y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-accent-cyan"
            >
              <ChevronDown size={18} strokeWidth={2.5} />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
