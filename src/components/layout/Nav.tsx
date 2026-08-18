import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { scrollToId } from '../../hooks/useLenis'
import { sectionIds, profile } from '../../data/content'
import { LanguageToggle } from './LanguageToggle'

const avatarUrl = `${import.meta.env.BASE_URL}${profile.avatarSmall}`

const links = [
  { id: sectionIds.about, label: ui.nav.about },
  { id: sectionIds.skills, label: ui.nav.skills },
  { id: sectionIds.experience, label: ui.nav.experience },
  { id: sectionIds.contact, label: ui.nav.contact },
]

export function Nav() {
  const { pick } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      // hide when scrolling down past the hero, reveal on any upward scroll
      if (y > last + 6 && y > 140) setHidden(true)
      else if (y < last - 6) setHidden(false)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden && !open ? -120 : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`container-page mt-3 flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
            scrolled ? 'glass-strong shadow-glow' : 'bg-transparent'
          }`}
        >
          <button onClick={() => go(sectionIds.hero)} className="group flex items-center gap-2.5 active:scale-95">
            <span className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-accent-blue/60 ring-offset-2 ring-offset-transparent transition-all group-hover:ring-accent-cyan">
              <img src={avatarUrl} alt="Vo Nhu Phi" className="h-full w-full object-cover" width={36} height={36} />
            </span>
            <span className="hidden font-semibold tracking-tight transition-colors group-hover:text-accent-cyan sm:block">
              Vo Nhu Phi
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="rounded-lg px-3 py-1.5 text-sm text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/5 hover:text-white active:translate-y-0 active:scale-95"
              >
                {pick(l.label)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              className="glass flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10 active:scale-95 md:hidden"
            >
              <span className="relative flex h-3 w-4 flex-col justify-between">
                <span className={`h-0.5 w-full bg-white transition-transform ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
                <span className={`h-0.5 w-full bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 w-full bg-white transition-transform ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-lg" onClick={() => setOpen(false)} />
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="container-page relative mt-24 flex flex-col gap-2"
            >
              {links.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => go(l.id)}
                  className="glass rounded-xl px-5 py-4 text-left text-lg font-semibold transition-colors duration-200 hover:bg-white/10 active:scale-[0.98]"
                >
                  {pick(l.label)}
                </motion.button>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
