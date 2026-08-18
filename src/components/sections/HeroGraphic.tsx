import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useLang } from '../../providers/LanguageProvider'
import { profile } from '../../data/content'

/**
 * A playful "whoami" terminal — a mac-style window that prints a personal,
 * slightly cheeky session instead of a dry tech list. Pure HTML/CSS so it
 * renders regardless of WebGL.
 */

// token colours
const G = ({ children }: { children: ReactNode }) => <span style={{ color: '#4ade80' }}>{children}</span> // prompt / ok
const C = ({ children }: { children: ReactNode }) => <span style={{ color: '#22d3ee' }}>{children}</span> // path / cyan
const W = ({ children }: { children: ReactNode }) => <span className="text-white/90">{children}</span> // command
const KEY = ({ children }: { children: ReactNode }) => <span style={{ color: '#7dd3fc' }}>{children}</span>
const STR = ({ children }: { children: ReactNode }) => <span style={{ color: '#86efac' }}>{children}</span>
const NUM = ({ children }: { children: ReactNode }) => <span style={{ color: '#fbbf24' }}>{children}</span>
const BOOL = ({ children }: { children: ReactNode }) => <span style={{ color: '#c084fc' }}>{children}</span>
const P = ({ children }: { children: ReactNode }) => <span style={{ color: '#8ea2c0' }}>{children}</span>
const Muted = ({ children }: { children: ReactNode }) => <span className="text-white/45">{children}</span>

const Prompt = () => (
  <>
    <G>➜</G> <C>~</C>{' '}
  </>
)

export function HeroGraphic() {
  const rm = useReducedMotion()
  const { lang, pick } = useLang()

  const role = profile.role[lang]
  const based = pick({ en: 'Saigon, VN', vi: 'Sài Gòn, VN' })
  const coffee = pick({ en: 'dangerously high', vi: 'cao nguy hiểm' })
  const shipped = pick({ en: '4M+ orders/month · still sleeps fine', vi: 'ship 4M+ đơn/tháng · vẫn ngủ ngon' })

  // each terminal line is a staggered child
  const lines: ReactNode[] = [
    <><Prompt /><W>whoami</W></>,
    <span className="text-white/80"><span className="font-semibold text-white">Vo Nhu Phi</span> — {role}</span>,
    <span />,
    <><Prompt /><W>cat traits.json</W></>,
    <P>{'{'}</P>,
    <>{'  '}<KEY>"based_in"</KEY><P>:</P> <STR>"{based} 🇻🇳"</STR><P>,</P></>,
    <>{'  '}<KEY>"years_shipping"</KEY><P>:</P> <NUM>3</NUM><P>,</P></>,
    <>{'  '}<KEY>"stack"</KEY><P>:</P> <P>[</P><STR>"Go"</STR><P>,</P> <STR>"Java"</STR><P>,</P> <STR>"React"</STR><P>,</P> <STR>"TS"</STR><P>]</P><P>,</P></>,
    <>{'  '}<KEY>"coffee_level"</KEY><P>:</P> <STR>"{coffee} ☕"</STR><P>,</P></>,
    <>{'  '}<KEY>"dark_mode"</KEY><P>:</P> <BOOL>true</BOOL></>,
    <P>{'}'}</P>,
    <span />,
    <><Prompt /><W>./ship --prod</W></>,
    <><G>✓</G> <span className="text-white/75">{shipped} 😴</span></>,
    <span />,
    <><Prompt /><Muted>press </Muted><span className="text-white/70">Explore</span><Muted> to continue</Muted></>,
  ]

  const container = { hidden: {}, show: { transition: { staggerChildren: rm ? 0 : 0.14, delayChildren: rm ? 0 : 0.5 } } }
  const item = {
    hidden: { opacity: 0, y: 4 },
    show: { opacity: 1, y: 0, transition: { duration: rm ? 0 : 0.25 } },
  }

  return (
    <div className="relative w-full" aria-hidden>
      {/* ambient glow behind the window */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] opacity-70 blur-3xl" style={{ background: 'radial-gradient(60% 60% at 60% 40%, rgba(34,211,238,0.16), rgba(79,140,255,0.08) 55%, transparent 75%)' }} />

      <div
        className="overflow-hidden rounded-xl border border-white/12 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-accent-cyan/30"
        style={{
          background: 'linear-gradient(160deg, #0c1324 0%, #070b16 100%)',
          boxShadow: '0 0 0 1px rgba(45,212,255,0.08), 0 30px 70px -30px rgba(34,211,238,0.45)',
        }}
      >
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#febc2e' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
          <span className="mx-auto pr-6 font-mono text-[11px] tracking-wide text-white/40">phi@portfolio — zsh</span>
        </div>

        {/* body */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="px-4 py-4 font-mono leading-[1.7] sm:px-5 sm:py-5"
          style={{ fontSize: 'clamp(9.5px, 0.8vw, 15px)' }}
        >
          {lines.map((l, i) => (
            <motion.div key={i} variants={item} className="min-h-[1.35em] whitespace-pre">
              {l}
              {i === lines.length - 1 && (
                <motion.span
                  className="ml-1 inline-block h-[1.05em] w-[7px] translate-y-[2px] rounded-[1px] align-middle"
                  style={{ background: '#5eead4' }}
                  animate={rm ? undefined : { opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 1.05, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
