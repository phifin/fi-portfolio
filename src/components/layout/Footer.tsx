import { Github, Linkedin, Mail } from 'lucide-react'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { contacts, profile } from '../../data/content'

const socials = [
  { href: contacts.github, Icon: Github, label: 'GitHub' },
  { href: contacts.linkedin, Icon: Linkedin, label: 'LinkedIn' },
  { href: `mailto:${contacts.email}`, Icon: Mail, label: 'Email' },
]

export function Footer() {
  const { pick } = useLang()
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-page flex flex-col items-center justify-between gap-4 text-sm text-white/50 sm:flex-row">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="font-mono text-xs">{pick(ui.footer.built)}</span>
        <div className="flex items-center gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <s.Icon size={17} strokeWidth={2} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
