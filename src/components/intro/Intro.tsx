import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { useLang } from '../../providers/LanguageProvider'
import { profile } from '../../data/content'
import { getLenis } from '../../hooks/useLenis'

// Ambient network nodes (percent of viewport) + a few connecting edges.
const NODES = [
  [12, 22], [24, 54], [9, 80], [31, 32], [18, 86], [37, 66], [45, 16],
  [55, 84], [64, 30], [73, 60], [83, 22], [88, 74], [78, 88], [93, 46], [50, 10], [61, 54],
]
const EDGES = [
  [0, 3], [3, 6], [6, 14], [1, 5], [5, 3], [2, 4], [4, 5], [8, 9], [9, 11], [10, 8],
  [13, 11], [12, 11], [7, 5], [15, 9], [8, 15], [14, 6], [0, 1], [10, 13],
]

const strings = {
  pull: { en: 'Pull up to enter', vi: 'Kéo lên để vào' },
}

export function Intro({ onDone }: { onDone: () => void }) {
  const { lang } = useLang()
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)

  // lock the page while the intro is up
  useEffect(() => {
    const lenis = getLenis()
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setReady(true), 2600)
    return () => clearTimeout(t)
  }, [])

  const exit = () => {
    if (exiting) return
    setExiting(true)
    document.body.style.overflow = ''
    getLenis()?.start()
    setTimeout(onDone, 850)
  }

  // any "scroll up" intent (wheel / touch / keys) lifts the curtain once ready
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

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-ink-950"
      initial={{ y: 0 }}
      animate={{ y: exiting ? '-100%' : 0 }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* ambient grid + glow */}
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.16),transparent_70%)]" />

      {/* network motif */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {EDGES.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]}
            stroke="#4f8cff" strokeOpacity={0.18} strokeWidth={0.15}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
          />
        ))}
      </svg>
      {NODES.map(([x, y], i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-accent-cyan"
          style={{ left: `${x}%`, top: `${y}%`, boxShadow: '0 0 8px #2dd4ff' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ delay: 0.2 + i * 0.05, type: 'spring', stiffness: 240, damping: 16 }}
        />
      ))}

      {/* centerpiece */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 180, damping: 14 }}
          className="mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-blue font-mono text-3xl font-extrabold text-ink-950 shadow-glow"
        >
          VP
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 1.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-extrabold tracking-tight sm:text-7xl"
          >
            {first} <span className="text-gradient">{last}</span>
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.7 }}
          className="mt-4 font-mono text-sm uppercase tracking-[0.3em] text-accent-cyan sm:text-base"
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
            className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 pb-8"
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
