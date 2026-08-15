import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Wrench, Server, LayoutDashboard, Database, Cloud, GitPullRequestArrow } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { skillGroups, sectionIds } from '../../data/content'

const accentHex: Record<string, string> = {
  cyan: '#2dd4ff',
  blue: '#4f8cff',
  sky: '#60a5fa',
}

const groupIcon: Record<string, LucideIcon> = {
  backend: Server,
  frontend: LayoutDashboard,
  data: Database,
  devops: Cloud,
  practices: GitPullRequestArrow,
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
                    <span className={`whitespace-nowrap font-semibold ${on ? 'text-white' : 'text-white/60'}`}>
                      {pick(g.title)}
                    </span>
                    <span className="ml-auto hidden font-mono text-xs text-white/30 lg:block">
                      {String(g.skills.length).padStart(2, '0')}
                    </span>
                  </button>
                )
              })}
            </div>
          </Reveal>

          {/* skill cloud panel */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="glass relative min-h-[320px] overflow-hidden rounded-3xl p-6 sm:p-8">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl"
                style={{ background: color }}
              />
              <div className="relative mb-6 flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `${color}22`, border: `1px solid ${color}66` }}
                >
                  {(() => {
                    const Icon = groupIcon[group.key] ?? Server
                    return <Icon size={18} color={color} strokeWidth={2.2} />
                  })()}
                </span>
                <h3 className="text-xl font-bold">{pick(group.title)}</h3>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={group.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-wrap gap-3"
                >
                  {group.skills.map((skill, i) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 20 }}
                      whileHover={{ scale: 1.06, y: -3 }}
                      className="cursor-default rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/85 hover:border-white/25 hover:bg-white/[0.07]"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              <p className="mt-8 font-mono text-xs text-white/30">{pick(ui.skills.hint)}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
