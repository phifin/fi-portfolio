import { motion } from 'framer-motion'
import { Globe, FileText, Database, Gauge, Zap, Shuffle, Split } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DeepDiveLayout } from '../ui/DeepDiveLayout'
import { DiagramLegend } from '../ui/DiagramLegend'
import { ServiceNode, Datastore, Edge, DIA } from '../diagram/primitives'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { sectionIds } from '../../data/content'

const providerColors = [DIA.cyan, DIA.green, DIA.amber, DIA.sky]

function useMiddleware() {
  return [
    { Icon: Gauge, label: { en: 'Rate limit', vi: 'Giới hạn tần suất' } },
    { Icon: Zap, label: { en: 'Cache', vi: 'Cache' } },
    { Icon: Shuffle, label: { en: 'Normalize', vi: 'Chuẩn hoá' } },
    { Icon: Split, label: { en: 'Route', vi: 'Định tuyến' } },
  ]
}

/** The gateway shell with its middleware stack, positioned/sized to spec. */
function GatewayShell({ x, y, w, h, mw, pick }: { x: number; y: number; w: number; h: number; mw: { Icon: LucideIcon; label: { en: string; vi: string } }[]; pick: (b: { en: string; vi: string }) => string }) {
  const cx = x + w / 2
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="#0e1230" stroke={`${DIA.blue}cc`} strokeWidth={1.8} style={{ filter: `drop-shadow(0 0 12px ${DIA.blue}55)` }} />
      <text x={cx} y={y + 20} textAnchor="middle" fill="#fff" fontSize={12.5} fontWeight={700}>Go Gateway</text>
      <text x={cx} y={y + 33} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9}>net/http · no framework</text>
      {mw.map((m, i) => {
        const ry = y + 44 + i * 36
        return (
          <g key={i}>
            <rect x={x + 12} y={ry} width={w - 24} height={28} rx={7} fill={`${DIA.blue}1f`} stroke={`${DIA.blue}44`} />
            <m.Icon x={x + 20} y={ry + 7} width={14} height={14} color={DIA.sky} strokeWidth={2} />
            <text x={x + 40} y={ry + 18} fill="rgba(255,255,255,0.85)" fontSize={10}>{pick(m.label)}</text>
          </g>
        )
      })}
    </>
  )
}

function Token({ path, delay, color }: { path: [number, number][]; delay: number; color: string }) {
  const cx = path.map((p) => p[0])
  const cy = path.map((p) => p[1])
  return (
    <motion.circle
      r={4.5}
      fill={color}
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      initial={{ cx: cx[0], cy: cy[0], opacity: 0 }}
      animate={{ cx, cy, opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.4, delay, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut', times: [0, 0.32, 0.62, 1] }}
    />
  )
}

function GatewayDiagramH() {
  const { pick } = useLang()
  const mw = useMiddleware()
  const providers = [
    { name: 'FPT', y: 30 },
    { name: 'MISA', y: 92 },
    { name: 'Viettel', y: 154 },
    { name: 'M-Invoice', y: 216 },
  ]
  const GW = { x: 150, y: 44, w: 120, h: 196 }
  const midY = 147
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 480 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <Edge id="gc" from={[106, midY]} to={[150, midY]} color={DIA.cyan} />
        {providers.map((p, i) => (
          <Edge key={i} id={`gp${i}`} from={[270, midY]} to={[350, p.y + 22]} via={[315, (midY + p.y + 22) / 2]} color={providerColors[i]} />
        ))}
        <Edge id="gr" from={[GW.x + GW.w / 2, GW.y + GW.h]} to={[GW.x + GW.w / 2, 256]} color={DIA.rose} />

        {providers.map((p, i) => (
          <Token key={i} path={[[40, midY], [150, midY], [270, midY], [350, p.y + 22]]} delay={i * 0.55} color={providerColors[i]} />
        ))}

        <ServiceNode x={8} y={120} w={98} h={54} title="Client" sub="1 unified API" color={DIA.cyan} Icon={Globe} />
        <GatewayShell x={GW.x} y={GW.y} w={GW.w} h={GW.h} mw={mw} pick={pick} />

        <g style={{ filter: `drop-shadow(0 0 8px ${DIA.rose}44)` }}>
          <ellipse cx={GW.x + GW.w / 2} cy={262} rx={30} ry={7} fill={`${DIA.rose}2a`} stroke={`${DIA.rose}99`} />
          <rect x={GW.x + GW.w / 2 - 30} y={262} width={60} height={22} fill={`${DIA.rose}18`} stroke={`${DIA.rose}99`} />
          <ellipse cx={GW.x + GW.w / 2} cy={284} rx={30} ry={7} fill={`${DIA.rose}18`} stroke={`${DIA.rose}99`} />
          <Database x={GW.x + GW.w / 2 - 7} y={266} width={14} height={14} color={DIA.rose} strokeWidth={2} />
        </g>
        <text x={GW.x + GW.w / 2 + 42} y={276} fill="rgba(255,255,255,0.5)" fontSize={9}>Redis</text>

        {providers.map((p, i) => (
          <ServiceNode key={p.name} x={350} y={p.y} w={122} h={44} title={p.name} sub="e-invoice" color={providerColors[i]} Icon={FileText} />
        ))}
      </svg>
    </div>
  )
}

function GatewayDiagramV() {
  const { pick } = useLang()
  const mw = useMiddleware()
  const GW = { x: 58, y: 84, w: 196, h: 176 }
  const gcx = GW.x + GW.w / 2
  const exitY = GW.y + GW.h
  // 2x2 providers
  const prov = [
    { name: 'FPT', x: 16, y: 300 },
    { name: 'MISA', x: 182, y: 300 },
    { name: 'Viettel', x: 16, y: 372 },
    { name: 'M-Invoice', x: 182, y: 372 },
  ]
  const pw = 142
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 340 440" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <Edge id="gvc" from={[gcx, 62]} to={[gcx, GW.y]} color={DIA.cyan} />
        {prov.map((p, i) => (
          <Edge key={i} id={`gvp${i}`} from={[gcx, exitY]} to={[p.x + pw / 2, p.y]} via={[p.x + pw / 2, exitY + 18]} color={providerColors[i]} />
        ))}
        <Edge id="gvr" from={[GW.x + GW.w, 150]} to={[288, 150]} color={DIA.rose} />

        {prov.map((p, i) => (
          <Token key={i} path={[[gcx, 40], [gcx, GW.y + 20], [gcx, exitY], [p.x + pw / 2, p.y + 22]]} delay={i * 0.5} color={providerColors[i]} />
        ))}

        <ServiceNode x={gcx - 70} y={12} w={140} h={50} title="Client" sub="1 unified API" color={DIA.cyan} Icon={Globe} />
        <GatewayShell x={GW.x} y={GW.y} w={GW.w} h={GW.h} mw={mw} pick={pick} />

        {/* redis to the right */}
        <Datastore x={288} y={126} w={48} h={48} title="Redis" color={DIA.rose} />

        {prov.map((p, i) => (
          <ServiceNode key={p.name} x={p.x} y={p.y} w={pw} h={48} title={p.name} sub="e-invoice" color={providerColors[i]} Icon={FileText} />
        ))}
      </svg>
    </div>
  )
}

export function GatewayDeepDive() {
  const { pick } = useLang()
  const { isMobile } = useDeviceTier()
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
      {isMobile ? <GatewayDiagramV /> : <GatewayDiagramH />}
    </DeepDiveLayout>
  )
}
