import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
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

        <div className="relative mt-14">
          {/* timeline spine */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent-cyan via-accent-blue to-transparent" />

          {experiences.map((exp) => (
            <div key={exp.company} className="mb-12 pl-8">
              <Reveal>
                <div className="relative">
                  <span className="absolute -left-8 top-1.5 flex h-4 w-4 items-center justify-center">
                    <span className="h-4 w-4 rounded-full bg-accent-cyan shadow-glow" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h3 className="text-2xl font-bold">{exp.company}</h3>
                      <span className="font-mono text-sm text-accent-cyan">{pick(exp.period)}</span>
                    </div>
                    <p className="mt-1 font-semibold text-white/80">{pick(exp.role)}</p>
                    <p className="mt-1 text-sm italic text-white/50">{pick(exp.note)}</p>
                  </div>
                </div>
              </Reveal>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {exp.projects.map((proj, pi) => (
                  <Reveal key={proj.name} delay={pi * 0.1}>
                    <div className="glass h-full rounded-2xl p-6">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-lg font-bold text-gradient">{proj.name}</h4>
                        <span className="chip shrink-0">{pick(proj.team)}</span>
                      </div>
                      <p className="mt-2 text-sm text-white/65">{pick(proj.summary)}</p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {proj.stack.map((t) => (
                          <span key={t} className="rounded-md bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] text-white/60">
                            {t}
                          </span>
                        ))}
                      </div>

                      <p className="mt-5 font-mono text-xs uppercase tracking-[0.15em] text-accent-blue">
                        {pick(ui.experience.highlights)}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {proj.highlights.map((h, hi) => (
                          <motion.li
                            key={hi}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: hi * 0.05 }}
                            className="flex gap-2 text-sm text-white/70"
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
