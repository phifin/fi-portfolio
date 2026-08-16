import { motion } from 'framer-motion'
import { Briefcase, Users, ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { experiences, sectionIds } from '../../data/content'

export function Experience() {
  const { pick } = useLang()
  return (
    <section id={sectionIds.experience} className="section-pad relative">
      <div className="container-page">
        <SectionHeading kicker={pick(ui.experience.kicker)} title={pick(ui.experience.title)} Icon={Briefcase} />

        <div className="relative mt-12">
          {/* timeline spine */}
          <div className="absolute left-[7px] top-2 bottom-6 w-px bg-gradient-to-b from-accent-cyan via-accent-blue to-transparent" />

          {experiences.map((exp) => (
            <div key={exp.company} className="pl-8">
              {/* company header */}
              <Reveal>
                <div className="relative">
                  <span className="absolute -left-8 top-1.5 h-4 w-4 rounded-full bg-accent-cyan shadow-glow" />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="text-2xl font-bold">{exp.company}</h3>
                    <span className="font-mono text-sm text-accent-cyan">{pick(exp.period)}</span>
                  </div>
                  <p className="mt-1 font-semibold text-white/80">{pick(exp.role)}</p>
                  <p className="mt-1 text-sm italic text-white/50">{pick(exp.note)}</p>
                </div>
              </Reveal>

              {/* project cards, full width & stacked */}
              <div className="mt-8 space-y-6">
                {exp.projects.map((proj, pi) => (
                  <Reveal key={proj.name} delay={pi * 0.08}>
                    <div className="glass overflow-hidden rounded-2xl p-6 sm:p-7">
                      <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <ArrowUpRight size={18} className="text-accent-blue" />
                            <h4 className="text-xl font-bold text-gradient">{proj.name}</h4>
                          </div>
                          <p className="mt-2 max-w-2xl text-sm text-white/65">{pick(proj.summary)}</p>
                        </div>
                        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/70">
                          <Users size={13} /> {pick(proj.team)}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {proj.stack.map((t) => (
                          <span key={t} className="rounded-md bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] text-white/60">
                            {t}
                          </span>
                        ))}
                      </div>

                      <p className="mt-5 kicker text-accent-blue">{pick(ui.experience.highlights)}</p>
                      <ul className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                        {proj.highlights.map((h, hi) => (
                          <motion.li
                            key={hi}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (hi % 2) * 0.05 }}
                            className="flex gap-2.5 text-sm leading-relaxed text-white/72"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan" />
                            {pick(h)}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
