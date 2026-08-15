import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { skillGroups, sectionIds } from '../../data/content'

const accentMap: Record<string, string> = {
  cyan: 'from-accent-cyan/80 to-accent-cyan/10 text-accent-cyan',
  violet: 'from-accent-violet/80 to-accent-violet/10 text-accent-violet',
  magenta: 'from-accent-magenta/80 to-accent-magenta/10 text-accent-magenta',
}
const dotMap: Record<string, string> = {
  cyan: 'bg-accent-cyan',
  violet: 'bg-accent-violet',
  magenta: 'bg-accent-magenta',
}

export function Skills() {
  const { pick } = useLang()
  const [active, setActive] = useState(0)
  const group = skillGroups[active]

  return (
    <section id={sectionIds.skills} className="section-pad relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-page relative">
        <SectionHeading kicker={pick(ui.skills.kicker)} title={pick(ui.skills.title)} />

        <div className="mt-12 grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* group selector */}
          <Reveal className="min-w-0">
            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {skillGroups.map((g, i) => (
                <button
                  key={g.key}
                  onClick={() => setActive(i)}
                  className={`group relative flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all lg:w-full ${
                    active === i
                      ? 'border-white/20 bg-white/[0.06]'
                      : 'border-white/5 bg-transparent hover:border-white/10'
                  }`}
                >
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotMap[g.accent]} ${active === i ? 'shadow-glow' : 'opacity-50'}`} />
                  <span className={`whitespace-nowrap font-semibold ${active === i ? 'text-white' : 'text-white/60'}`}>
                    {pick(g.title)}
                  </span>
                  <span className="ml-auto hidden font-mono text-xs text-white/30 lg:block">
                    {String(g.skills.length).padStart(2, '0')}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          {/* skill cloud panel */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="glass relative min-h-[320px] overflow-hidden rounded-3xl p-6 sm:p-8">
              <div
                className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br opacity-30 blur-3xl ${accentMap[group.accent]}`}
              />
              <div className="relative mb-6 flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${dotMap[group.accent]} shadow-glow`} />
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
