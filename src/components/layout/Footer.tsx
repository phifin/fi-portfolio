import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { contacts, profile } from '../../data/content'

export function Footer() {
  const { pick } = useLang()
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-page flex flex-col items-center justify-between gap-4 text-sm text-white/50 sm:flex-row">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="font-mono text-xs">{pick(ui.footer.built)}</span>
        <div className="flex items-center gap-4">
          <a href={contacts.github} target="_blank" rel="noreferrer" className="hover:text-white">
            GitHub
          </a>
          <a href={contacts.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">
            LinkedIn
          </a>
          <a href={`mailto:${contacts.email}`} className="hover:text-white">
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
