import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Wrench, Server, LayoutDashboard, Database, Cloud, GitPullRequestArrow } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { skillGroups, sectionIds } from '../../data/content'

const accentHex: Record<string, string> = { cyan: '#2dd4ff', blue: '#4f8cff', sky: '#60a5fa' }
const groupIcon: Record<string, LucideIcon> = {
  backend: Server,
  frontend: LayoutDashboard,
  data: Database,
  devops: Cloud,
  practices: GitPullRequestArrow,
}

type Pos = { x: number; y: number }

/** Radial node positions (percent), alternating two rings to reduce crowding. */
function layout(n: number): Pos[] {
  return Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const ring = i % 2 === 0 ? 1 : 0.62
    const rx = 40 * ring
    const ry = 39 * ring
    return { x: 50 + Math.cos(angle) * rx, y: 50 + Math.sin(angle) * ry }
  })
}

function Constellation({ groupKey, skills, color, Icon }: { groupKey: string; skills: string[]; color: string; Icon: LucideIcon }) {
  const pos = layout(skills.length)
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[560px]">
      {/* connection lines */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {pos.map((p, i) => (
          <motion.line
            key={i}
            x1={50}
            y1={50}
            x2={p.x}
            y2={p.y}
            stroke={color}
            strokeOpacity={0.22}
            strokeWidth={0.3}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.03, duration: 0.5 }}
          />
        ))}
      </svg>

      {/* flow particles travelling outward along each spoke */}
      {pos.map((p, i) => (
        <motion.span
          key={`d-${i}`}
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}`, marginLeft: -3, marginTop: -3 }}
          initial={{ left: '50%', top: '50%', opacity: 0 }}
          animate={{ left: [`50%`, `${p.x}%`], top: [`50%`, `${p.y}%`], opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, delay: 0.4 + (i % 4) * 0.25, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
        />
      ))}

      {/* hub */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl"
        style={{ background: `${color}1f`, border: `1px solid ${color}55`, boxShadow: `0 0 40px -8px ${color}` }}
      >
        <Icon size={30} color={color} strokeWidth={1.8} />
      </motion.div>

      {/* skill nodes */}
      {skills.map((s, i) => (
        <motion.div
          key={`${groupKey}-${s}`}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 + i * 0.045, type: 'spring', stiffness: 260, damping: 20 }}
        >
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
            className="block whitespace-nowrap rounded-lg border border-white/10 bg-ink-800/80 px-2.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur-sm"
            style={{ boxShadow: `0 0 0 1px ${color}22` }}
          >
            {s}
          </motion.span>
        </motion.div>
      ))}
    </div>
  )
}

/** Compact animated chip list — used on mobile where the radial graph is too cramped. */
function ChipList({ groupKey, skills, color, Icon, title }: { groupKey: string; skills: string[]; color: string; Icon: LucideIcon; title: string }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${color}1f`, border: `1px solid ${color}55` }}>
          <Icon size={20} color={color} strokeWidth={2} />
        </span>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {skills.map((s, i) => (
          <motion.span
            key={`${groupKey}-${s}`}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 20 }}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white/85"
            style={{ boxShadow: `0 0 0 1px ${color}22` }}
          >
            {s}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  const { pick } = useLang()
  const { isMobile } = useDeviceTier()
  const [active, setActive] = useState(0)
  const group = skillGroups[active]
  const color = accentHex[group.accent]
  const HubIcon = groupIcon[group.key] ?? Server

  return (
    <section id={sectionIds.skills} className="section-pad relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-page relative">
        <SectionHeading kicker={pick(ui.skills.kicker)} title={pick(ui.skills.title)} Icon={Wrench} />

        <div className="mt-12 grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* group selector */}
          <Reveal className="min-w-0">
            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {skillGroups.map((g, i) => {
                const Icon = groupIcon[g.key] ?? Server
                const gc = accentHex[g.accent]
                const on = active === i
                return (
                  <button
                    key={g.key}
                    onClick={() => setActive(i)}
                    className={`group relative flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all lg:w-full ${
                      on ? 'border-white/20 bg-white/[0.06]' : 'border-white/5 bg-transparent hover:border-white/10'
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: on ? `${gc}22` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${on ? `${gc}66` : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      <Icon size={16} color={on ? gc : 'rgba(255,255,255,0.5)'} strokeWidth={2.2} />
                    </span>
                    <span className={`whitespace-nowrap font-semibold ${on ? 'text-white' : 'text-white/60'}`}>{pick(g.title)}</span>
                    <span className="ml-auto hidden font-mono text-xs text-white/30 lg:block">{String(g.skills.length).padStart(2, '0')}</span>
                  </button>
                )
              })}
            </div>
          </Reveal>

          {/* constellation panel */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="glass relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-3xl p-5 pb-10 sm:p-6">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
                style={{ background: color }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={group.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {isMobile ? (
                    <ChipList groupKey={group.key} skills={group.skills} color={color} Icon={HubIcon} title={pick(group.title)} />
                  ) : (
                    <Constellation groupKey={group.key} skills={group.skills} color={color} Icon={HubIcon} />
                  )}
                </motion.div>
              </AnimatePresence>
              <p className="absolute bottom-3 left-0 right-0 text-center font-mono text-xs text-white/30">{pick(ui.skills.hint)}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
