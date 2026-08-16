import { motion } from 'framer-motion'

// A bright, always-visible "microservices mesh" — a hub API gateway wired to the
// core stack. Pure SVG so it renders even when WebGL is unavailable/degraded.
const R = 150
const NODES = [
  { label: 'React', a: -90, c: '#4f8cff' },
  { label: 'Go', a: -30, c: '#2dd4ff' },
  { label: 'Kafka', a: 30, c: '#60a5fa' },
  { label: 'Postgres', a: 90, c: '#4f8cff' },
  { label: 'NestJS', a: 150, c: '#2dd4ff' },
  { label: 'Redis', a: 210, c: '#60a5fa' },
].map((n) => {
  const rad = (n.a * Math.PI) / 180
  return { ...n, x: 220 + R * Math.cos(rad), y: 220 + R * Math.sin(rad) }
})

export function HeroGraphic() {
  return (
    <svg viewBox="0 0 440 440" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="hg-hub" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#5eeaff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0a4f6b" stopOpacity="0.95" />
        </radialGradient>
        <filter id="hg-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* rotating orbit rings */}
      <motion.circle
        cx={220} cy={220} r={188} fill="none" stroke="#2dd4ff" strokeOpacity={0.28} strokeWidth={1} strokeDasharray="3 11"
        animate={{ rotate: 360 }} transition={{ duration: 64, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '220px 220px' }}
      />
      <motion.circle
        cx={220} cy={220} r={R} fill="none" stroke="#4f8cff" strokeOpacity={0.2} strokeWidth={1} strokeDasharray="1 9"
        animate={{ rotate: -360 }} transition={{ duration: 48, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '220px 220px' }}
      />

      {/* links + flowing packets */}
      {NODES.map((n, i) => (
        <g key={`link-${n.label}`}>
          <line x1={220} y1={220} x2={n.x} y2={n.y} stroke={n.c} strokeOpacity={0.42} strokeWidth={1.4} />
          <circle r={3} fill={n.c}>
            <animateMotion dur={`${2.4 + (i % 3) * 0.5}s`} repeatCount="indefinite" path={`M220,220 L${n.x},${n.y}`} />
          </circle>
        </g>
      ))}

      {/* glowing node bodies */}
      <g filter="url(#hg-glow)">
        {NODES.map((n) => (
          <circle key={`glow-${n.label}`} cx={n.x} cy={n.y} r={30} fill="#0b1022" stroke={n.c} strokeWidth={1.8} />
        ))}
        <circle cx={220} cy={220} r={46} fill="url(#hg-hub)" stroke="#8ff0ff" strokeWidth={2} />
      </g>

      {/* crisp labels on top (no blur) */}
      {NODES.map((n) => (
        <g key={`label-${n.label}`}>
          <circle cx={n.x} cy={n.y} r={30} fill={n.c} fillOpacity={0.08} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="#e6f6ff" fontFamily="ui-monospace, monospace">
            {n.label}
          </text>
        </g>
      ))}
      <text x={220} y={215} textAnchor="middle" fontSize={13} fontWeight={800} fill="#02121a" fontFamily="ui-monospace, monospace">API</text>
      <text x={220} y={233} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#053142" fontFamily="ui-monospace, monospace" letterSpacing={1}>GATEWAY</text>
    </svg>
  )
}
