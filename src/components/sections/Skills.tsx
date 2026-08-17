import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Wrench, Server, LayoutDashboard, Database, Cloud, GitPullRequestArrow } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { SkillOrbit, SkillPills } from './SkillOrbit'
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

// category accent colours (shared with SkillOrbit)
const CAT_COLOR: Record<string, string> = {
  Language: '#22d3ee', Frameworks: '#34d399', Framework: '#34d399', 'API & RPC': '#a78bfa',
  Architecture: '#4f8cff', Messaging: '#fbbf24', Patterns: '#f472b6', 'State & Data': '#38bdf8',
  Visualization: '#2dd4ff', Delivery: '#818cf8', Relational: '#38bdf8', Document: '#34d399',
  'Cache & KV': '#fb7185', Containers: '#4f8cff', Observability: '#fbbf24', Cloud: '#22d3ee',
  Process: '#a78bfa', 'System Design': '#f472b6',
}
const catColor = (en: string) => CAT_COLOR[en] ?? '#4f8cff'

export function Skills() {
  const { pick } = useLang()
  const [active, setActive] = useState(0)
  const [hoverCat, setHoverCat] = useState<number | null>(null)
  const [compact, setCompact] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const fit = () => setCompact(window.innerWidth < 768)
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(rm.matches)
    fit()
    window.addEventListener('resize', fit)
    rm.addEventListener('change', (e) => setReducedMotion(e.matches))
    return () => window.removeEventListener('resize', fit)
  }, [])

  const group = skillGroups[active]
  const color = accentHex[group.accent]
  const GroupIcon = groupIcon[group.key] ?? Server
  const focusCat = hoverCat

  const rows = useMemo(
    () => group.categories.map((cat, i) => ({
      i,
      label: pick(cat.label),
      labelEn: cat.label.en,
      items: cat.items,
      color: catColor(cat.label.en),
      dim: focusCat !== null && focusCat !== i,
      focus: focusCat === i,
    })),
    [group.categories, pick, focusCat],
  )

  const onGroupChange = (i: number) => {
    setActive(i)
    setHoverCat(null)
  }

  return (
    <section
      id={sectionIds.skills}
      className="relative flex h-[100svh] flex-col overflow-hidden py-4 sm:py-5 lg:py-6"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="container-page relative flex min-h-0 flex-1 flex-col">
        {/* ── compact header ── */}
        <div className="shrink-0">
          <SectionHeading kicker={pick(ui.skills.kicker)} title={pick(ui.skills.title)} Icon={Wrench} />
          <p className="mt-1.5 max-w-lg text-sm text-white/45">{pick(ui.skills.hint)}</p>
        </div>

        {/* ── domain selector ── */}
        <div className="mt-4 shrink-0 sm:mt-5">
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/[0.07] bg-white/[0.02] p-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {skillGroups.map((g, i) => {
              const Icon = groupIcon[g.key] ?? Server
              const gc = accentHex[g.accent]
              const on = active === i
              const count = g.categories.reduce((n, c) => n + c.items.length, 0)
              return (
                <button
                  key={g.key}
                  onClick={() => onGroupChange(i)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left transition-all sm:px-4 ${
                    on ? 'bg-white/[0.08] text-white' : 'text-white/55 hover:bg-white/[0.04] hover:text-white/80'
                  }`}
                  style={on ? { boxShadow: `inset 0 0 0 1px ${gc}55, 0 4px 16px -8px ${gc}` } : undefined}
                >
                  <Icon size={15} color={on ? gc : 'rgba(255,255,255,0.45)'} strokeWidth={2.2} />
                  <span className="text-sm font-semibold">{pick(g.title)}</span>
                  <span className="font-mono text-[10px] tabular-nums" style={{ color: on ? gc : 'rgba(255,255,255,0.28)' }}>
                    {String(count).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── main stage: orbit + skill strip ── */}
        <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2 sm:mt-4 lg:flex-row lg:items-stretch lg:gap-6">
          {/* orbit hub */}
          <div className="flex shrink-0 items-center justify-center lg:min-h-0 lg:w-[min(44%,400px)] lg:flex-col lg:justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={group.key}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28 }}
                className="w-full"
              >
                <SkillOrbit
                  group={group}
                  groupColor={color}
                  GroupIcon={GroupIcon}
                  groupTitle={pick(group.title)}
                  activeCat={focusCat}
                  onCatChange={setHoverCat}
                  compact={compact}
                  reducedMotion={reducedMotion}
                  pick={pick}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* skill detail strip — compact rows, no card boxes */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl p-3 sm:p-4"
            >
              <div className="mb-2 flex shrink-0 items-center justify-between gap-2 border-b border-white/[0.06] pb-2">
                <p className="line-clamp-2 text-xs text-white/65 sm:text-sm">{pick(group.blurb)}</p>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {group.categories.reduce((n, c) => n + c.items.length, 0)} tools
                </span>
              </div>

              <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5 sm:space-y-2">
                {rows.map((row) => (
                  <motion.div
                    key={row.labelEn}
                    animate={{ opacity: row.dim ? 0.35 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 gap-1.5 sm:grid-cols-[7.5rem_1fr] sm:items-start sm:gap-3"
                  >
                    <span
                      className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] sm:pt-1"
                      style={{ color: row.focus ? row.color : `${row.color}99` }}
                    >
                      {row.label}
                    </span>
                    <SkillPills items={row.items} color={row.color} highlight={row.focus} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
