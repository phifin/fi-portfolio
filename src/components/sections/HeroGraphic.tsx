import { motion, useReducedMotion } from 'framer-motion'
import { Braces, Database, BarChart3, TerminalSquare } from 'lucide-react'
import type { ReactNode } from 'react'
import { TechGlyph } from '../diagram/techLogos'

/**
 * An isometric developer workstation: a laptop running Go, ringed by floating
 * glass tech cards wired together with flowing connectors. Pure HTML/SVG so it
 * renders regardless of WebGL. The parent gives it a square box.
 */

// card centres in % of the square box; the laptop sits at ~ (50, 54)
type Card = {
  id: string; x: number; y: number
  logo?: string; Icon?: typeof Database
  label?: string; sub?: string; accent: string
  ax: number; ay: number // where its connector meets the laptop
}
const CARDS: Card[] = [
  { id: 'go', x: 15, y: 14, logo: 'go', label: 'Go', accent: '#2dd4ff', ax: 42, ay: 40 },
  { id: 'braces', x: 45, y: 6, Icon: Braces, accent: '#818cf8', ax: 50, ay: 33 },
  { id: 'react', x: 79, y: 13, logo: 'react', label: 'React', accent: '#4f8cff', ax: 64, ay: 40 },
  { id: 'ts', x: 1, y: 43, logo: 'typescript', label: 'TypeScript', accent: '#4f8cff', ax: 30, ay: 52 },
  { id: 'db', x: 15, y: 77, Icon: Database, label: 'Postgres', accent: '#38bdf8', ax: 44, ay: 67 },
  { id: 'chart', x: 47, y: 91, Icon: BarChart3, label: 'Metrics', accent: '#22d3ee', ax: 53, ay: 71 },
  { id: 'api', x: 82, y: 71, Icon: TerminalSquare, label: 'API Server', sub: 'Running…', accent: '#34d399', ax: 64, ay: 63 },
]

function Line({ children }: { children: ReactNode }) {
  return <div className="whitespace-pre">{children}</div>
}
const K = ({ children }: { children: ReactNode }) => <span style={{ color: '#c084fc' }}>{children}</span> // keyword
const F = ({ children }: { children: ReactNode }) => <span style={{ color: '#38e0ff' }}>{children}</span> // func
const S = ({ children }: { children: ReactNode }) => <span style={{ color: '#86efac' }}>{children}</span> // string
const T = ({ children }: { children: ReactNode }) => <span style={{ color: '#7dd3fc' }}>{children}</span> // type / pkg
const N = ({ children }: { children: ReactNode }) => <span style={{ color: '#fbbf24' }}>{children}</span> // number
const P = ({ children }: { children: ReactNode }) => <span style={{ color: '#8ea2c0' }}>{children}</span> // punctuation

export function HeroGraphic() {
  const rm = useReducedMotion()
  const float = (i: number) =>
    rm ? {} : { animate: { y: [0, -9, 0] }, transition: { duration: 4.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut' as const, delay: i * 0.3 } }

  return (
    <div className="relative h-full w-full" aria-hidden>
      {/* ── connectors: dashed lines + a glowing packet flowing toward the laptop ── */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        {CARDS.map((c) => (
          <g key={c.id}>
            <path
              d={`M ${c.x} ${c.y} L ${c.ax} ${c.ay}`}
              fill="none" stroke={c.accent} strokeOpacity={0.28} strokeWidth={0.35} strokeDasharray="1.4 1.6"
            />
            {!rm && (
              <circle r={0.7} fill={c.accent} style={{ filter: `drop-shadow(0 0 2px ${c.accent})` }}>
                <animateMotion dur={`${2.6 + (c.x % 3) * 0.4}s`} repeatCount="indefinite" path={`M ${c.x} ${c.y} L ${c.ax} ${c.ay}`} />
              </circle>
            )}
          </g>
        ))}
      </svg>

      {/* ── the laptop ── */}
      <div className="absolute left-[53%] top-[31%] w-[58%] -translate-x-1/2">
        {/* screen */}
        <div
          className="relative overflow-hidden rounded-lg border border-white/12"
          style={{
            aspectRatio: '16 / 10',
            background: 'linear-gradient(160deg, #0d1426 0%, #070b17 100%)',
            boxShadow: '0 0 0 1px rgba(45,212,255,0.10), 0 24px 60px -22px rgba(34,211,238,0.35)',
          }}
        >
          {/* title bar */}
          <div className="flex items-center gap-1.5 border-b border-white/8 px-3 py-2">
            <span className="h-2 w-2 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="h-2 w-2 rounded-full" style={{ background: '#febc2e' }} />
            <span className="h-2 w-2 rounded-full" style={{ background: '#28c840' }} />
            <span className="ml-2 font-mono text-[8px] tracking-wide text-white/35">handler.go</span>
          </div>
          {/* code */}
          <div className="px-3 py-2.5 font-mono leading-[1.55] text-white/85" style={{ fontSize: 'clamp(6px, 1.02vw, 11px)' }}>
            <Line><K>func</K> <F>handler</F><P>(</P>w <T>http.ResponseWriter</T><P>,</P> r <P>*</P><T>http.Request</T><P>) {'{'}</P></Line>
            <Line>{'  '}user<P>,</P> err <P>:=</P> <F>getUser</F><P>(</P>r.URL.<F>Query</F><P>().</P><F>Get</F><P>(</P><S>"id"</S><P>))</P></Line>
            <Line>{'  '}<K>if</K> err <P>!=</P> <K>nil</K> <P>{'{'}</P></Line>
            <Line>{'    '}<T>http</T>.<F>Error</F><P>(</P>w<P>,</P> <S>"not found"</S><P>,</P> <N>404</N><P>)</P></Line>
            <Line>{'    '}<K>return</K></Line>
            <Line>{'  '}<P>{'}'}</P></Line>
            <Line>{'  '}<T>json</T>.<F>NewEncoder</F><P>(</P>w<P>).</P><F>Encode</F><P>(</P>user<P>)</P></Line>
            <Line><P>{'}'}</P></Line>
          </div>
          {/* screen sheen */}
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 80% at 80% 0%, rgba(45,212,255,0.10), transparent 55%)' }} />
        </div>
        {/* deck / keyboard (foreshortened trapezoid) */}
        <div
          className="mx-auto h-[9%] w-[112%] -translate-y-px"
          style={{
            clipPath: 'polygon(4% 0, 96% 0, 100% 100%, 0 100%)',
            background: 'linear-gradient(180deg, #141c31, #0b1020)',
            borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <div className="mx-auto mt-[3%] h-[34%] w-[22%] rounded-sm bg-white/5" />
        </div>
        {/* glow under the laptop */}
        <div className="pointer-events-none absolute -bottom-6 left-1/2 h-10 w-[80%] -translate-x-1/2 rounded-[50%] blur-2xl" style={{ background: 'rgba(34,211,238,0.22)' }} />
      </div>

      {/* ── floating tech cards ── */}
      {CARDS.map((c, i) => (
        <motion.div
          key={c.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${c.x}%`, top: `${c.y}%` }}
          initial={rm ? undefined : { opacity: 0, scale: 0.85 }}
          whileInView={rm ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
        >
          <motion.div
            {...float(i)}
            className="flex items-center gap-2 rounded-xl border px-3 py-2 backdrop-blur-md"
            style={{
              borderColor: `${c.accent}44`,
              background: 'linear-gradient(160deg, rgba(17,24,42,0.85), rgba(9,13,24,0.85))',
              boxShadow: `0 0 24px -10px ${c.accent}, inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `${c.accent}1f`, border: `1px solid ${c.accent}55` }}
            >
              {c.logo ? <TechGlyph name={c.logo} size={18} /> : c.Icon ? <c.Icon size={c.label ? 16 : 18} color={c.accent} strokeWidth={2.2} /> : null}
            </span>
            {c.label && (
              <div className="pr-1 text-left">
                <div className="text-[13px] font-semibold leading-tight text-white/90">{c.label}</div>
                {c.sub && (
                  <div className="font-mono text-[10px] leading-tight" style={{ color: c.accent }}>{c.sub}</div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
