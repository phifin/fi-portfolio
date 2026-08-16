import { motion } from 'framer-motion'
import { Globe, Gauge, Zap, Shuffle, Split } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DeepDiveLayout } from '../ui/DeepDiveLayout'
import { DiagramLegend } from '../ui/DiagramLegend'
import { ServiceNode, Datastore, Edge, DIA } from '../diagram/primitives'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { sectionIds } from '../../data/content'

// e-invoice providers with brand-ish monogram badges (swap for real SVG logos anytime)
const gwProviders = [
  { name: 'FPT', mono: 'FPT', color: '#fb923c' },
  { name: 'MISA', mono: 'MISA', color: '#f87171' },
  { name: 'Viettel', mono: 'VT', color: '#f43f5e' },
  { name: 'M-Invoice', mono: 'MI', color: '#38bdf8' },
]

function useMiddleware() {
  return [
    { Icon: Gauge, label: { en: 'Rate limit', vi: 'Giới hạn tần suất' } },
    { Icon: Zap, label: { en: 'Cache', vi: 'Cache' } },
    { Icon: Shuffle, label: { en: 'Normalize', vi: 'Chuẩn hoá' } },
    { Icon: Split, label: { en: 'Route', vi: 'Định tuyến' } },
  ]
}

function ProviderNode({ x, y, w, h, name, mono, color }: { x: number; y: number; w: number; h: number; name: string; mono: string; color: string }) {
  return (
    <g style={{ filter: `drop-shadow(0 0 7px ${color}44)` }}>
      <rect x={x} y={y} width={w} height={h} rx={11} fill="#0e1230" stroke={`${color}aa`} strokeWidth={1.4} />
      <rect x={x + 11} y={y + h / 2 - 13} width={34} height={26} rx={6} fill={color} />
      <text x={x + 28} y={y + h / 2 + 4} textAnchor="middle" fill="#0b1020" fontSize={mono.length > 2 ? 9 : 12} fontWeight={800}>{mono}</text>
      <text x={x + 54} y={y + h / 2 - 3} fill="#fff" fontSize={13} fontWeight={700}>{name}</text>
      <text x={x + 54} y={y + h / 2 + 12} fill="rgba(255,255,255,0.45)" fontSize={9.5}>e-invoice</text>
    </g>
  )
}

function GatewayShell({ x, y, w, h, mw, pick }: { x: number; y: number; w: number; h: number; mw: { Icon: LucideIcon; label: { en: string; vi: string } }[]; pick: (b: { en: string; vi: string }) => string }) {
  const cx = x + w / 2
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="#0e1230" stroke={`${DIA.blue}cc`} strokeWidth={1.8} style={{ filter: `drop-shadow(0 0 12px ${DIA.blue}55)` }} />
      <text x={cx} y={y + 22} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>Go Gateway</text>
      <text x={cx} y={y + 36} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9}>net/http · no framework</text>
      {mw.map((m, i) => {
        const ry = y + 48 + i * 36
        return (
          <g key={i}>
            <rect x={x + 14} y={ry} width={w - 28} height={28} rx={7} fill={`${DIA.blue}1f`} stroke={`${DIA.blue}44`} />
            <m.Icon x={x + 24} y={ry + 7} width={14} height={14} color={DIA.sky} strokeWidth={2} />
            <text x={x + 44} y={ry + 18} fill="rgba(255,255,255,0.85)" fontSize={10.5}>{pick(m.label)}</text>
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
      transition={{ duration: 2.4, delay, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut', times: [0, 0.3, 0.6, 1] }}
    />
  )
}

function GatewayDiagramH() {
  const { pick } = useLang()
  const mw = useMiddleware()
  const GW = { x: 186, y: 64, w: 152, h: 214 }
  const midY = GW.y + GW.h / 2
  const prov = gwProviders.map((p, i) => ({ ...p, y: 22 + i * 84 }))
  const pw = 128
  const ph = 62
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 524 380" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <Edge id="gc" from={[136, midY]} to={[186, midY]} color={DIA.cyan} />
        {prov.map((p, i) => (
          <Edge key={i} id={`gp${i}`} from={[338, midY]} to={[390, p.y + ph / 2]} via={[364, (midY + p.y + ph / 2) / 2]} color={p.color} />
        ))}
        <Edge id="gr" from={[GW.x + GW.w / 2, GW.y + GW.h]} to={[GW.x + GW.w / 2, GW.y + GW.h + 20]} color={DIA.rose} />

        {prov.map((p, i) => (
          <Token key={i} path={[[46, midY], [190, midY], [332, midY], [390, p.y + ph / 2]]} delay={i * 0.5} color={p.color} />
        ))}

        <ServiceNode x={16} y={midY - 30} w={120} h={60} title="Client" sub="1 unified API" color={DIA.cyan} Icon={Globe} />
        <GatewayShell x={GW.x} y={GW.y} w={GW.w} h={GW.h} mw={mw} pick={pick} />
        <Datastore x={GW.x + GW.w / 2 - 27} y={GW.y + GW.h + 20} w={54} h={46} title="Redis" color={DIA.rose} />

        {prov.map((p) => (
          <ProviderNode key={p.name} x={390} y={p.y} w={pw} h={ph} name={p.name} mono={p.mono} color={p.color} />
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
  const prov = [
    { ...gwProviders[0], x: 12, y: 300 },
    { ...gwProviders[1], x: 178, y: 300 },
    { ...gwProviders[2], x: 12, y: 374 },
    { ...gwProviders[3], x: 178, y: 374 },
  ]
  const pw = 150
  const ph = 54
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 340 448" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <Edge id="gvc" from={[gcx, 62]} to={[gcx, GW.y]} color={DIA.cyan} />
        {prov.map((p, i) => (
          <Edge key={i} id={`gvp${i}`} from={[gcx, exitY]} to={[p.x + pw / 2, p.y]} via={[p.x + pw / 2, exitY + 18]} color={p.color} />
        ))}
        <Edge id="gvr" from={[GW.x + GW.w, 150]} to={[288, 150]} color={DIA.rose} />

        {prov.map((p, i) => (
          <Token key={i} path={[[gcx, 40], [gcx, GW.y + 20], [gcx, exitY], [p.x + pw / 2, p.y + ph / 2]]} delay={i * 0.5} color={p.color} />
        ))}

        <ServiceNode x={gcx - 70} y={12} w={140} h={50} title="Client" sub="1 unified API" color={DIA.cyan} Icon={Globe} />
        <GatewayShell x={GW.x} y={GW.y} w={GW.w} h={GW.h} mw={mw} pick={pick} />
        <Datastore x={288} y={126} w={48} h={48} title="Redis" color={DIA.rose} />

        {prov.map((p) => (
          <ProviderNode key={p.name} x={p.x} y={p.y} w={pw} h={ph} name={p.name} mono={p.mono} color={p.color} />
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
