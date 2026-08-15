import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { TiltCard } from '../ui/TiltCard'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { projects, sectionIds } from '../../data/content'

const glow: Record<string, string> = {
  cyan: 'from-accent-cyan/20',
  violet: 'from-accent-violet/20',
  magenta: 'from-accent-magenta/20',
}

export function Projects() {
  const { pick } = useLang()
  return (
    <section id={sectionIds.projects} className="section-pad relative">
      <div className="container-page">
        <SectionHeading kicker={pick(ui.projects.kicker)} title={pick(ui.projects.title)} />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.key} delay={i * 0.1}>
              <TiltCard max={8} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 p-7">
                  <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${glow[p.accent]} to-transparent blur-2xl transition-opacity group-hover:opacity-100 opacity-60`} />
                  <div className="glass absolute inset-0 -z-10" />

                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                    {pick(p.tagline)}
                  </span>
                  <h3 className="mt-2 text-2xl font-bold">{p.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{pick(p.description)}</p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.stack.map((t) => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
