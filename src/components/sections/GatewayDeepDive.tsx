import { motion } from 'framer-motion'
import { DeepDiveLayout } from '../ui/DeepDiveLayout'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { sectionIds } from '../../data/content'

const providers = [
  { name: 'FPT', y: 55 },
  { name: 'MISA', y: 120 },
  { name: 'Viettel', y: 185 },
  { name: 'M-Invoice', y: 250 },
]
const colors = ['#22d3ee', '#34d399', '#fbbf24', '#e879f9']

function RequestToken({ targetY, delay, color }: { targetY: number; delay: number; color: string }) {
  return (
    <motion.circle
      r={5}
      fill={color}
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      initial={{ cx: 40, cy: 152, opacity: 0 }}
      animate={{
        cx: [40, 150, 230, 320],
        cy: [152, 152, 152, targetY],
        opacity: [0, 1, 1, 0],
      }}
      transition={{ duration: 2.4, delay, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut', times: [0, 0.35, 0.6, 1] }}
    />
  )
}

function GatewayDiagram() {
  const { pick } = useLang()
  const middleware = [
    { en: 'Rate limit', vi: 'Rate limit' },
    { en: 'Cache', vi: 'Cache' },
    { en: 'Normalize', vi: 'Chuẩn hoá' },
    { en: 'Route', vi: 'Định tuyến' },
  ]
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <defs>
          <linearGradient id="gw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#161936" />
            <stop offset="1" stopColor="#0d0f24" />
          </linearGradient>
        </defs>

        {/* client */}
        <g>
          <rect x="12" y="128" width="60" height="48" rx="8" fill="#0f1330" stroke="#22d3ee" strokeOpacity="0.7" />
          <text x="42" y="150" textAnchor="middle" fill="#fff" fontSize="12" fontWeight={700}>Client</text>
          <text x="42" y="164" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">1 API</text>
        </g>

        {/* connection lines to providers */}
        {providers.map((p, i) => (
          <line key={i} x1="230" y1="152" x2="322" y2={p.y + 16} stroke={colors[i]} strokeWidth="1.5" strokeOpacity="0.22" />
        ))}
        <line x1="72" y1="152" x2="150" y2="152" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.3" />

        {/* gateway */}
        <g>
          <rect x="150" y="70" width="86" height="164" rx="12" fill="url(#gw)" stroke="#a855f7" strokeOpacity="0.7"
            style={{ filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.35))' }} />
          <text x="193" y="90" textAnchor="middle" fill="#fff" fontSize="12" fontWeight={700}>Go Gateway</text>
          <text x="193" y="102" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="8">net/http</text>
          {middleware.map((m, i) => (
            <g key={i}>
              <rect x="160" y={112 + i * 28} width="66" height="22" rx="5" fill="rgba(168,85,247,0.12)" stroke="rgba(168,85,247,0.3)" />
              <text x="193" y={127 + i * 28} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="9">{pick(m)}</text>
            </g>
          ))}
        </g>

        {/* redis */}
        <g opacity="0.8">
          <ellipse cx="193" cy="252" rx="20" ry="6" fill="#fb7185" fillOpacity="0.25" />
          <text x="193" y="272" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Redis · cache/limit</text>
        </g>

        {/* providers */}
        {providers.map((p, i) => (
          <g key={p.name}>
            <rect x="322" y={p.y} width="66" height="32" rx="7" fill="#0f1330" stroke={colors[i]} strokeOpacity="0.7" />
            <text x="355" y={p.y + 20} textAnchor="middle" fill="#fff" fontSize="11" fontWeight={600}>{p.name}</text>
          </g>
        ))}

        {/* animated requests */}
        {providers.map((p, i) => (
          <RequestToken key={i} targetY={p.y + 16} delay={i * 0.6} color={colors[i]} />
        ))}
      </svg>
    </div>
  )
}

export function GatewayDeepDive() {
  const { pick } = useLang()
  return (
    <DeepDiveLayout
      id={sectionIds.gateway}
      kicker={pick(ui.gateway.kicker)}
      title={pick(ui.gateway.title)}
      body={pick(ui.gateway.body)}
      legend={
        <div className="mt-2 flex flex-wrap gap-2">
          {providers.map((p, i) => (
            <span key={p.name} className="chip">
              <span className="h-2 w-2 rounded-full" style={{ background: colors[i], boxShadow: `0 0 8px ${colors[i]}` }} />
              {p.name}
            </span>
          ))}
        </div>
      }
    >
      <GatewayDiagram />
    </DeepDiveLayout>
  )
}
