import { useState } from 'react'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { TiltCard } from '../ui/TiltCard'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { profile, stats, education, languages, sectionIds } from '../../data/content'

export function About() {
  const { pick } = useLang()
  const [loaded, setLoaded] = useState(false)
  const base = import.meta.env.BASE_URL

  return (
    <section id={sectionIds.about} className="section-pad relative">
      <div className="container-page">
        <SectionHeading kicker={pick(ui.about.kicker)} title={pick(ui.about.title)} Icon={User} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr] lg:items-start 2xl:grid-cols-[300px_1fr] 2xl:gap-12">
          {/* avatar */}
          <Reveal>
            <TiltCard max={12} className="relative mx-auto w-full max-w-[240px] 2xl:max-w-[300px]">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-glow-blue">
                <div
                  className="absolute inset-0 scale-110 blur-xl"
                  style={{ backgroundImage: `url(${base}${profile.avatarBlur})`, backgroundSize: 'cover' }}
                />
                <img
                  src={`${base}${profile.avatar}`}
                  srcSet={`${base}${profile.avatarSmall} 480w, ${base}${profile.avatar} 900w`}
                  sizes="(max-width: 768px) 300px, 320px"
                  alt={profile.name}
                  loading="lazy"
                  onLoad={() => setLoaded(true)}
                  className={`relative w-full transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
              </div>
              <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[2rem] bg-gradient-to-br from-accent-cyan/30 to-accent-blue/30 blur-2xl" />
            </TiltCard>
          </Reveal>

          {/* text + stats */}
          <div>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-white/75">{pick(profile.summary)}</p>
            </Reveal>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={i} delay={0.1 + i * 0.08}>
                  <div className="glass rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-gradient sm:text-4xl">
                      <AnimatedCounter value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="mt-1 text-xs text-white/55">{pick(s.label)}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Reveal delay={0.2}>
                <div className="glass h-full rounded-2xl p-5">
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">
                    {pick(ui.education.title)}
                  </h3>
                  <p className="mt-2 font-semibold">{education.school}</p>
                  <p className="text-sm text-white/60">{pick(education.degree)}</p>
                  <p className="mt-1 text-xs text-white/40">{pick(education.period)}</p>
                </div>
              </Reveal>
              <Reveal delay={0.28}>
                <div className="glass h-full rounded-2xl p-5">
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-blue">
                    {pick(ui.education.languages)}
                  </h3>
                  {languages.map((l) => (
                    <div key={l.name} className="mt-2 flex items-center justify-between">
                      <span className="font-semibold">{l.name}</span>
                      <span className="chip">{l.detail}</span>
                    </div>
                  ))}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold">Tiếng Việt</span>
                    <motion.span className="chip">Native</motion.span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
