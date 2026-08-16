import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wrench, Server, LayoutDashboard, Database, Cloud, GitPullRequestArrow } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { TechGlyph, hasLogo } from '../diagram/techLogos'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { skillGroups, sectionIds } from '../../data/content'
import type { SkillGroup } from '../../data/content'

const accentHex: Record<string, string> = { cyan: '#2dd4ff', blue: '#4f8cff', sky: '#60a5fa' }
const groupIcon: Record<string, LucideIcon> = {
  backend: Server,
  frontend: LayoutDashboard,
  data: Database,
  devops: Cloud,
  practices: GitPullRequestArrow,
}

const totalItems = (g: SkillGroup) => g.categories.reduce((n, c) => n + c.items.length, 0)

function Chip({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[13px] font-medium text-white/85"
      style={{ boxShadow: `0 0 0 1px ${color}22` }}
    >
      {hasLogo(name) && <TechGlyph name={name} size={14} />}
      {name}
    </span>
  )
}

/** The active layer, broken into named sub-categories (language / framework / pattern …). */
function Breakdown({ group, color }: { group: SkillGroup; color: string }) {
  const { pick } = useLang()
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {group.categories.map((cat, i) => (
        <motion.div
          key={pick(cat.label)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4"
        >
          <div className="mb-2.5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{pick(cat.label)}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cat.items.map((s) => (
              <Chip key={s} name={s} color={color} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function Skills() {
  const { pick } = useLang()
  const [active, setActive] = useState(0)
  const group = skillGroups[active]
  const color = accentHex[group.accent]

  return (
    <section id={sectionIds.skills} className="section-pad relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-page relative">
        <SectionHeading kicker={pick(ui.skills.kicker)} title={pick(ui.skills.title)} Icon={Wrench} />

        <div className="mt-8 flex flex-col gap-5">
          {/* layer tabs */}
          <Reveal className="min-w-0">
            <div className="flex flex-wrap gap-2.5">
              {skillGroups.map((g, i) => {
                const Icon = groupIcon[g.key] ?? Server
                const gc = accentHex[g.accent]
                const on = active === i
                return (
                  <button
                    key={g.key}
                    onClick={() => setActive(i)}
                    className={`group flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-left transition-all ${
                      on ? 'bg-white/[0.07]' : 'border-white/5 bg-transparent hover:border-white/10'
                    }`}
                    style={on ? { borderColor: `${gc}80`, boxShadow: `0 0 0 1px ${gc}40, 0 6px 20px -10px ${gc}` } : undefined}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: on ? `${gc}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${on ? `${gc}66` : 'rgba(255,255,255,0.08)'}` }}>
                      <Icon size={16} color={on ? gc : 'rgba(255,255,255,0.5)'} strokeWidth={2.2} />
                    </span>
                    <span className={`font-semibold ${on ? 'text-white' : 'text-white/60'}`}>{pick(g.title)}</span>
                    <span className="font-mono text-xs" style={{ color: on ? gc : 'rgba(255,255,255,0.3)' }}>{String(totalItems(g)).padStart(2, '0')}</span>
                  </button>
                )
              })}
            </div>
            <p className="mt-3 font-mono text-xs leading-relaxed text-white/40">{pick(ui.skills.hint)}</p>
          </Reveal>

          {/* categorized breakdown of the active layer */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="glass relative overflow-hidden rounded-3xl p-4 sm:p-6">
              <div
                className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl transition-colors duration-500"
                style={{ background: color }}
              />
              <div className="relative mb-4 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${color}1f`, border: `1px solid ${color}55` }}>
                  {(() => {
                    const Icon = groupIcon[group.key] ?? Server
                    return <Icon size={17} color={color} strokeWidth={2} />
                  })()}
                </span>
                <h3 className="text-lg font-bold text-white">{pick(group.title)}</h3>
              </div>
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={group.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Breakdown group={group} color={color} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
