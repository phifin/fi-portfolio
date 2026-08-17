import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Wrench, Server, LayoutDashboard, Database, Cloud, GitPullRequestArrow,
  Code2, Layers, Webhook, Boxes, MessageSquare, Diamond, Workflow, BarChart3,
  Rocket, FileJson, Zap, Container, Activity, GitPullRequestArrow as GitIcon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { TechGlyph, hasLogo } from '../diagram/techLogos'
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

const CAT_META: Record<string, { c: string; Icon: LucideIcon }> = {
  Language: { c: '#22d3ee', Icon: Code2 },
  Frameworks: { c: '#34d399', Icon: Layers },
  Framework: { c: '#34d399', Icon: Layers },
  'API & RPC': { c: '#a78bfa', Icon: Webhook },
  Architecture: { c: '#4f8cff', Icon: Boxes },
  Messaging: { c: '#fbbf24', Icon: MessageSquare },
  Patterns: { c: '#f472b6', Icon: Diamond },
  'State & Data': { c: '#38bdf8', Icon: Workflow },
  Visualization: { c: '#2dd4ff', Icon: BarChart3 },
  Delivery: { c: '#818cf8', Icon: Rocket },
  Relational: { c: '#38bdf8', Icon: Database },
  Document: { c: '#34d399', Icon: FileJson },
  'Cache & KV': { c: '#fb7185', Icon: Zap },
  Containers: { c: '#4f8cff', Icon: Container },
  Observability: { c: '#fbbf24', Icon: Activity },
  Cloud: { c: '#22d3ee', Icon: Cloud },
  Process: { c: '#a78bfa', Icon: GitIcon },
  'System Design': { c: '#f472b6', Icon: Boxes },
}
const catMeta = (en: string) => CAT_META[en] ?? { c: '#4f8cff', Icon: Layers }

function gridCols(n: number, w: number) {
  if (w < 520) return 1
  if (w < 768) return Math.min(2, n)
  if (w < 1100) return Math.min(3, n)
  if (w < 1440) return Math.min(n <= 4 ? n : 3, n)
  return Math.min(n, 6)
}

function SkillTile({ name, color }: { name: string; color: string }) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={{ y: -2, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className="inline-flex cursor-default items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-medium sm:text-xs"
      style={{
        borderColor: `${color}35`,
        background: `linear-gradient(145deg, ${color}16, rgba(255,255,255,0.02))`,
        boxShadow: `inset 0 1px 0 ${color}20`,
      }}
    >
      {hasLogo(name) ? (
        <TechGlyph name={name} size={13} />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      )}
      <span className="text-white/88">{name}</span>
    </motion.span>
  )
}

export function Skills() {
  const { pick } = useLang()
  const [active, setActive] = useState(0)
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(rm.matches)
    window.addEventListener('resize', onResize)
    rm.addEventListener('change', (e) => setReducedMotion(e.matches))
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const group = skillGroups[active]
  const color = accentHex[group.accent]
  const GroupIcon = groupIcon[group.key] ?? Server
  const cols = gridCols(group.categories.length, width)
  const total = group.categories.reduce((n, c) => n + c.items.length, 0)

  const cells = useMemo(
    () => group.categories.map((cat) => {
      const { c, Icon } = catMeta(cat.label.en)
      return { label: pick(cat.label), labelEn: cat.label.en, items: cat.items, color: c, Icon }
    }),
    [group.categories, pick],
  )

  return (
    <section id={sectionIds.skills} className="relative flex h-[100svh] flex-col overflow-hidden py-4 sm:py-5">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-35" />

      <div className="container-page relative flex min-h-0 flex-1 flex-col">
        <div className="shrink-0">
          <SectionHeading kicker={pick(ui.skills.kicker)} title={pick(ui.skills.title)} Icon={Wrench} />
        </div>

        {/* ── unified deck: tabs + bento grid in one card ── */}
        <div className="glass relative mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl sm:mt-4">
          {/* ambient glow — shifts with active stack */}
          <motion.div
            key={group.key}
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            style={{ background: color }}
          />
          <motion.div
            key={`${group.key}-2`}
            className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            style={{ background: color }}
          />

          {/* tab bar */}
          <div className="relative shrink-0 border-b border-white/[0.06] px-2 py-2 sm:px-3">
            <div className="flex gap-1 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {skillGroups.map((g, i) => {
                const Icon = groupIcon[g.key] ?? Server
                const gc = accentHex[g.accent]
                const on = active === i
                return (
                  <button
                    key={g.key}
                    onClick={() => setActive(i)}
                    className={`relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                      on ? 'text-white' : 'text-white/50 hover:bg-white/[0.04] hover:text-white/75'
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="skill-tab-bg"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: `${gc}18`, boxShadow: `inset 0 0 0 1px ${gc}50` }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon size={14} color={on ? gc : 'rgba(255,255,255,0.4)'} strokeWidth={2.2} />
                      <span className="text-sm font-semibold">{pick(g.title)}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* deck header — inline, no wasted vertical space */}
          <AnimatePresence mode="wait">
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="relative flex shrink-0 items-center gap-3 border-b border-white/[0.05] px-3 py-2.5 sm:px-4"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10"
                style={{
                  background: `linear-gradient(145deg, ${color}28, ${color}0a)`,
                  border: `1px solid ${color}44`,
                  boxShadow: `0 0 24px -8px ${color}`,
                }}
              >
                <GroupIcon size={18} color={color} strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/90">{pick(group.blurb)}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-white/35">
                {String(total).padStart(2, '0')} · {group.categories.length} {pick({ en: 'groups', vi: 'nhóm' })}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* bento grid — equal cells, fills all remaining height */}
          <div className="relative min-h-0 flex-1 p-2 sm:p-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={group.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid h-full gap-2"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  gridAutoRows: '1fr',
                }}
              >
                {cells.map((cell, ci) => (
                  <motion.div
                    key={cell.labelEn}
                    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.04, duration: 0.28 }}
                    className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-black/25 p-2.5 sm:p-3"
                    style={{ boxShadow: `inset 3px 0 0 ${cell.color}` }}
                  >
                    <div className="mb-2 flex shrink-0 items-center gap-2">
                      <cell.Icon size={14} color={cell.color} strokeWidth={2.2} />
                      <span
                        className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-[11px]"
                        style={{ color: cell.color }}
                      >
                        {cell.label}
                      </span>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-wrap content-start gap-1.5 overflow-y-auto">
                      {cell.items.map((name) => (
                        <SkillTile key={name} name={name} color={cell.color} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
