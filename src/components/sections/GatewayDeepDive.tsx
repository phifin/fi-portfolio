import { motion } from 'framer-motion'
import { Gauge, Zap, Shuffle, Split, Layers, Server, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DeepDiveLayout } from '../ui/DeepDiveLayout'
import { DiagramLegend } from '../ui/DiagramLegend'
import { ServiceNode, Datastore, Edge, DIA } from '../diagram/primitives'
import { ProviderLogo, PROVIDER_META } from '../diagram/providerLogos'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { sectionIds } from '../../data/content'

const PROVIDERS = ['FPT', 'MISA', 'Viettel', 'M-Invoice']

function useMiddleware(): { Icon: LucideIcon; label: { en: string; vi: string } }[] {
  return [
    { Icon: Gauge, label: { en: 'Rate limit', vi: 'Giới hạn tần suất' } },
    { Icon: Zap, label: { en: 'Cache', vi: 'Cache' } },
    { Icon: Shuffle, label: { en: 'Normalize', vi: 'Chuẩn hoá' } },
    { Icon: Layers, label: { en: 'Batch bulk-sign', vi: 'Gom ký hàng loạt' } },
    { Icon: Split, label: { en: 'Route', vi: 'Định tuyến' } },
  ]
}

function ProviderNode({ x, y, w, h, name }: { x: number; y: number; w: number; h: number; name: string }) {
  const meta = PROVIDER_META[name]
  return (
    <g style={{ filter: `drop-shadow(0 0 8px ${meta.glow}55)` }}>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="#0e1230" stroke={`${meta.edge}aa`} strokeWidth={1.4} />
      <ProviderLogo name={name} cx={x + w / 2} cy={y + h / 2 - 7} />
      <text x={x + w / 2} y={y + h - 13} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={9}>
        e-invoice provider
      </text>
    </g>
  )
}

function GatewayShell({ x, y, w, h, mw, pick }: { x: number; y: number; w: number; h: number; mw: { Icon: LucideIcon; label: { en: string; vi: string } }[]; pick: (b: { en: string; vi: string }) => string }) {
  const cx = x + w / 2
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={13} fill="#0e1230" stroke={`${DIA.blue}cc`} strokeWidth={1.8} style={{ filter: `drop-shadow(0 0 14px ${DIA.blue}55)` }} />
      <text x={cx} y={y + 22} textAnchor="middle" fill="#fff" fontSize={13.5} fontWeight={700}>Go Gateway</text>
      <text x={cx} y={y + 37} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9}>net/http · no framework</text>
      {mw.map((m, i) => {
        const ry = y + 52 + i * ((h - 62) / mw.length)
        const rh = (h - 62) / mw.length - 8
        return (
          <g key={i}>
            <rect x={x + 14} y={ry} width={w - 28} height={rh} rx={7} fill={`${DIA.blue}1f`} stroke={`${DIA.blue}44`} />
            <m.Icon x={x + 24} y={ry + rh / 2 - 7} width={14} height={14} color={DIA.sky} strokeWidth={2} />
            <text x={x + 44} y={ry + rh / 2 + 4} fill="rgba(255,255,255,0.85)" fontSize={10.5}>{pick(m.label)}</text>
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
      r={4}
      fill={color}
      style={{ filter: `drop-shadow(0 0 6px ${color})`, willChange: 'transform' }}
      initial={{ cx: cx[0], cy: cy[0], opacity: 0 }}
      animate={{ cx, cy, opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.6, delay, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut', times: [0, 0.25, 0.7, 1] }}
    />
  )
}

function GatewayDiagramH() {
  const { pick } = useLang()
  const mw = useMiddleware()
  const GW = { x: 236, y: 52, w: 174, h: 300 }
  const gwR = GW.x + GW.w
  const gwMid = GW.y + GW.h / 2
  const clients = [
    { icon: Server, title: 'Internal Services', sub: 'order · merchant', x: 12, y: 88, w: 162, h: 66 },
    { icon: Globe, title: 'External Partners', sub: '3rd-party integrations', x: 12, y: 250, w: 162, h: 66 },
  ]
  const prov = PROVIDERS.map((name, i) => ({ name, x: 452, y: 16 + i * 96, w: 176, h: 66 }))
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 640 404" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* client -> gateway */}
        <Edge id="gwi" from={[174, 121]} to={[GW.x, 132]} via={[205, 126]} color={DIA.cyan} />
        <Edge id="gwe" from={[174, 283]} to={[GW.x, 272]} via={[205, 278]} color={DIA.sky} />
        {/* gateway -> providers */}
        {prov.map((p, i) => (
          <Edge key={i} id={`gwp${i}`} from={[gwR, gwMid]} to={[p.x, p.y + p.h / 2]} via={[431, (gwMid + p.y + p.h / 2) / 2]} color={PROVIDER_META[p.name].edge} />
        ))}
        {/* gateway -> redis */}
        <Edge id="gwr" from={[GW.x + GW.w / 2, GW.y + GW.h]} to={[GW.x + GW.w / 2, GW.y + GW.h + 16]} color={DIA.rose} />

        {/* animated requests: two clients -> gateway -> each provider (batched) */}
        {prov.map((p, i) => (
          <Token
            key={i}
            path={[[90, i % 2 ? 283 : 121], [GW.x, gwMid], [gwR, gwMid], [p.x, p.y + p.h / 2]]}
            delay={i * 0.45}
            color={PROVIDER_META[p.name].edge}
          />
        ))}
        {/* extra inbound requests to hint at bulk volume */}
        <Token path={[[90, 121], [GW.x, gwMid]]} delay={0.2} color={DIA.cyan} />
        <Token path={[[90, 283], [GW.x, gwMid]]} delay={0.9} color={DIA.sky} />

        {clients.map((c) => (
          <ServiceNode key={c.title} x={c.x} y={c.y} w={c.w} h={c.h} title={c.title} sub={c.sub} color={c.title[0] === 'I' ? DIA.cyan : DIA.sky} Icon={c.icon} />
        ))}
        <GatewayShell x={GW.x} y={GW.y} w={GW.w} h={GW.h} mw={mw} pick={pick} />
        <Datastore x={GW.x + GW.w / 2 - 28} y={GW.y + GW.h + 16} w={56} h={44} title="Redis" color={DIA.rose} />

        {prov.map((p) => (
          <ProviderNode key={p.name} x={p.x} y={p.y} w={p.w} h={p.h} name={p.name} />
        ))}
      </svg>
    </div>
  )
}

function GatewayDiagramV() {
  const { pick } = useLang()
  const mw = useMiddleware()
  const GW = { x: 66, y: 108, w: 208, h: 216 }
  const gcx = GW.x + GW.w / 2
  const exitY = GW.y + GW.h
  const clients = [
    { icon: Server, title: 'Internal', sub: 'order · merchant', x: 12, y: 12, w: 152, h: 56, color: DIA.cyan },
    { icon: Globe, title: 'External', sub: '3rd-party', x: 176, y: 12, w: 152, h: 56, color: DIA.sky },
  ]
  const prov = [
    { name: PROVIDERS[0], x: 10, y: 352 },
    { name: PROVIDERS[1], x: 178, y: 352 },
    { name: PROVIDERS[2], x: 10, y: 442 },
    { name: PROVIDERS[3], x: 178, y: 442 },
  ]
  const pw = 152
  const ph = 64
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 340 522" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <Edge id="gvi" from={[88, 68]} to={[gcx - 34, GW.y]} via={[100, 92]} color={DIA.cyan} />
        <Edge id="gve" from={[252, 68]} to={[gcx + 34, GW.y]} via={[240, 92]} color={DIA.sky} />
        {prov.map((p, i) => (
          <Edge key={i} id={`gvp${i}`} from={[gcx, exitY]} to={[p.x + pw / 2, p.y]} via={[p.x + pw / 2, exitY + 16]} color={PROVIDER_META[p.name].edge} />
        ))}
        <Edge id="gvr" from={[GW.x + GW.w, 158]} to={[292, 158]} color={DIA.rose} />

        {prov.map((p, i) => (
          <Token key={i} path={[[gcx, 40], [gcx, GW.y + 30], [gcx, exitY], [p.x + pw / 2, p.y + ph / 2]]} delay={i * 0.5} color={PROVIDER_META[p.name].edge} />
        ))}

        {clients.map((c) => (
          <ServiceNode key={c.title} x={c.x} y={c.y} w={c.w} h={c.h} title={c.title} sub={c.sub} color={c.color} Icon={c.icon} />
        ))}
        <GatewayShell x={GW.x} y={GW.y} w={GW.w} h={GW.h} mw={mw} pick={pick} />
        <Datastore x={292} y={134} w={44} h={48} title="Redis" color={DIA.rose} />

        {prov.map((p) => (
          <ProviderNode key={p.name} x={p.x} y={p.y} w={pw} h={ph} name={p.name} />
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
      wide
      legend={
        <DiagramLegend
          items={[
            { Icon: Server, label: 'Internal + external clients', color: DIA.cyan },
            { Icon: Layers, label: 'Batches bulk-sign requests', color: DIA.sky },
            { Icon: Split, label: 'Normalize · route', color: DIA.blue },
            { Icon: Gauge, label: 'Redis rate-limit + cache', color: DIA.rose },
          ]}
        />
      }
    >
      {isMobile ? <GatewayDiagramV /> : <GatewayDiagramH />}
    </DeepDiveLayout>
  )
}
