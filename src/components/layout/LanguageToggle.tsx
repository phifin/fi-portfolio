import { useLang } from '../../providers/LanguageProvider'

export function LanguageToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="glass flex items-center rounded-full p-0.5 text-xs font-semibold">
      {(['en', 'vi'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`relative rounded-full px-3 py-1 uppercase tracking-wide transition-colors ${
            lang === l ? 'text-ink-950' : 'text-white/60 hover:text-white'
          }`}
        >
          {lang === l && (
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue" />
          )}
          <span className="relative">{l}</span>
        </button>
      ))}
    </div>
  )
}
