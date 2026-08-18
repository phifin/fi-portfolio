import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Phone, Download } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Reveal } from '../ui/Reveal'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { contacts, profile, sectionIds } from '../../data/content'

const links: { label: string; value: string; href: string; Icon: LucideIcon }[] = [
  { label: 'Email', value: contacts.email, href: `mailto:${contacts.email}`, Icon: Mail },
  { label: 'GitHub', value: contacts.githubHandle, href: contacts.github, Icon: Github },
  { label: 'LinkedIn', value: contacts.linkedinHandle, href: contacts.linkedin, Icon: Linkedin },
  { label: 'Phone', value: contacts.phone, href: `tel:${contacts.phone.replace(/\s/g, '')}`, Icon: Phone },
]

export function Contact() {
  const { pick } = useLang()
  return (
    <section id={sectionIds.contact} className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[400px] w-[600px] max-w-full rounded-full bg-gradient-to-b from-accent-blue/20 to-transparent blur-3xl" />
      <div className="container-page relative">
        <div className="glass-strong relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-14">
          <Reveal>
            <span className="kicker mx-auto w-fit text-accent-cyan">
              <Mail size={15} strokeWidth={2.2} />
              {pick(ui.contact.kicker)}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-bold sm:text-5xl">{pick(ui.contact.title)}</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/65">{pick(ui.contact.body)}</p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${contacts.email}`}
                className="i-btn flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue px-7 py-3.5 font-semibold text-ink-950 shadow-glow hover:shadow-glow-blue"
              >
                <Mail size={18} strokeWidth={2.4} /> {pick(ui.contact.email)}
              </a>
              <a
                href={`${import.meta.env.BASE_URL}${profile.cv}`}
                target="_blank"
                rel="noreferrer"
                className="i-btn glass flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white/90 hover:border-white/25 hover:bg-white/10"
              >
                <Download size={18} strokeWidth={2.4} /> {pick(ui.hero.resume)}
              </a>
            </div>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-2xl gap-3 sm:grid-cols-2">
            {links.map((l, i) => (
              <Reveal key={l.label} delay={0.3 + i * 0.06}>
                <motion.a
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  whileHover={{ y: -3 }}
                  className="i-card glass group flex items-center gap-3 rounded-xl px-5 py-4 text-left hover:bg-white/[0.07]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-accent-cyan transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-cyan/15">
                    <l.Icon size={17} strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-white/40">{l.label}</span>
                    <span className="block truncate text-sm font-medium text-white/85 transition-colors duration-300 group-hover:text-white">
                      {l.value}
                    </span>
                  </span>
                </motion.a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
