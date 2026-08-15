import { motion } from 'framer-motion'
import { Globe, FileText, Database, Gauge, Zap, Shuffle, Split } from 'lucide-react'
import { DeepDiveLayout } from '../ui/DeepDiveLayout'
import { DiagramLegend } from '../ui/DiagramLegend'
import { ServiceNode, Edge, DIA } from '../diagram/primitives'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { sectionIds } from '../../data/content'

const providers = [
  { name: 'FPT', y: 30 },
  { name: 'MISA', y: 92 },
  { name: 'Viettel', y: 154 },
  { name: 'M-Invoice', y: 216 },
]
const GW = { x: 150, y: 44, w: 120, h: 196 }
const midY = 147

function RequestToken({ targetY, delay, color }: { targetY: number; delay: number; color: string }) {
  return (
    <motion.circle
      r={4.5}
      fill={color}
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      initial={{ cx: 40, cy: midY, opacity: 0 }}
      animate={{ cx: [40, 150, 270, 350], cy: [midY, midY, midY, targetY + 22], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.4, delay, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut', times: [0, 0.32, 0.62, 1] }}
    />
  )
}

function GatewayDiagram() {
  const { pick } = useLang()
  const middleware = [
    { Icon: Gauge, label: { en: 'Rate limit', vi: 'Giới hạn tần suất' } },
    { Icon: Zap, label: { en: 'Cache', vi: 'Cache' } },
    { Icon: Shuffle, label: { en: 'Normalize', vi: 'Chuẩn hoá' } },
    { Icon: Split, label: { en: 'Route', vi: 'Định tuyến' } },
  ]
  const colors = [DIA.cyan, DIA.green, DIA.amber, DIA.sky]

  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 480 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* edges */}
        <Edge id="gc" from={[106, midY]} to={[150, midY]} color={DIA.cyan} />
        {providers.map((p, i) => (
          <Edge key={i} id={`gp${i}`} from={[270, midY]} to={[350, p.y + 22]} via={[315, (midY + p.y + 22) / 2]} color={colors[i]} />
        ))}
        <Edge id="gr" from={[GW.x + GW.w / 2, GW.y + GW.h]} to={[GW.x + GW.w / 2, 256]} color={DIA.rose} />

        {/* animated requests */}
        {providers.map((p, i) => (
          <RequestToken key={i} targetY={p.y} delay={i * 0.55} color={colors[i]} />
        ))}

        {/* client */}
        <ServiceNode x={8} y={120} w={98} h={54} title="Client" sub="1 unified API" color={DIA.cyan} Icon={Globe} />

        {/* gateway shell */}
        <rect
          x={GW.x}
          y={GW.y}
          width={GW.w}
          height={GW.h}
          rx={12}
          fill="#0e1230"
          stroke={`${DIA.blue}cc`}
          strokeWidth={1.8}
          style={{ filter: `drop-shadow(0 0 12px ${DIA.blue}55)` }}
        />
        <text x={GW.x + GW.w / 2} y={GW.y + 20} textAnchor="middle" fill="#fff" fontSize={12.5} fontWeight={700}>
          Go Gateway
        </text>
        <text x={GW.x + GW.w / 2} y={GW.y + 33} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9}>
          net/http · no framework
        </text>
        {middleware.map((m, i) => {
          const ry = GW.y + 44 + i * 36
          return (
            <g key={i}>
              <rect x={GW.x + 12} y={ry} width={GW.w - 24} height={28} rx={7} fill={`${DIA.blue}1f`} stroke={`${DIA.blue}44`} />
              <m.Icon x={GW.x + 20} y={ry + 7} width={14} height={14} color={DIA.sky} strokeWidth={2} />
              <text x={GW.x + 40} y={ry + 18} fill="rgba(255,255,255,0.85)" fontSize={10}>
                {pick(m.label)}
              </text>
            </g>
          )
        })}

        {/* redis */}
        <g style={{ filter: `drop-shadow(0 0 8px ${DIA.rose}44)` }}>
          <ellipse cx={GW.x + GW.w / 2} cy={262} rx={30} ry={7} fill={`${DIA.rose}2a`} stroke={`${DIA.rose}99`} />
          <rect x={GW.x + GW.w / 2 - 30} y={262} width={60} height={22} fill={`${DIA.rose}18`} stroke={`${DIA.rose}99`} />
          <ellipse cx={GW.x + GW.w / 2} cy={284} rx={30} ry={7} fill={`${DIA.rose}18`} stroke={`${DIA.rose}99`} />
          <Database x={GW.x + GW.w / 2 - 7} y={266} width={14} height={14} color={DIA.rose} strokeWidth={2} />
        </g>
        <text x={GW.x + GW.w / 2 + 42} y={276} fill="rgba(255,255,255,0.5)" fontSize={9}>
          Redis
        </text>

        {/* providers */}
        {providers.map((p, i) => (
          <ServiceNode key={p.name} x={350} y={p.y} w={122} h={44} title={p.name} sub="e-invoice" color={colors[i]} Icon={FileText} />
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
      Icon={Split}
      legend={
        <DiagramLegend
          items={[
            { Icon: Gauge, label: 'Rate limit', color: DIA.cyan },
            { Icon: Zap, label: 'Cache', color: DIA.green },
            { Icon: Shuffle, label: 'Normalize', color: DIA.amber },
            { Icon: Split, label: 'Route', color: DIA.sky },
          ]}
        />
      }
    >
      <GatewayDiagram />
    </DeepDiveLayout>
  )
}
