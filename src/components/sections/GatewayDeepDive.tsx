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

const PROVIDERS = ['FPT.eInvoice', 'meInvoice', 'SInvoice', 'M-invoice']

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
    <g className="dia-node" style={{ filter: `drop-shadow(0 0 8px ${meta.glow}55)` }}>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="#0e1230" stroke={`${meta.edge}aa`} strokeWidth={1.4} />
      <ProviderLogo name={name} x={x + 16} cy={y + h / 2 - 6} />
      <text x={x + 16} y={y + h - 13} fill="rgba(255,255,255,0.4)" fontSize={9}>{meta.sub}</text>
    </g>
  )
}

function GatewayShell({ x, y, w, h, mw, pick }: { x: number; y: number; w: number; h: number; mw: { Icon: LucideIcon; label: { en: string; vi: string } }[]; pick: (b: { en: string; vi: string }) => string }) {
  const cx = x + w / 2
  return (
    <g className="dia-node">
      <rect x={x} y={y} width={w} height={h} rx={13} fill="#0e1230" stroke={`${DIA.blue}cc`} strokeWidth={1.8} style={{ filter: `drop-shadow(0 0 14px ${DIA.blue}55)` }} />
      <text x={cx} y={y + 22} textAnchor="middle" fill="#fff" fontSize={13.5} fontWeight={700}>Go Gateway</text>
      <text x={cx} y={y + 37} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9}>net/http · no framework</text>
      {mw.map((m, i) => {
        const ry = y + 50 + i * ((h - 60) / mw.length)
        const rh = (h - 60) / mw.length - 8
        return (
          <g key={i}>
            <rect x={x + 14} y={ry} width={w - 28} height={rh} rx={7} fill={`${DIA.blue}1f`} stroke={`${DIA.blue}44`} />
            <m.Icon x={x + 24} y={ry + rh / 2 - 7} width={14} height={14} color={DIA.sky} strokeWidth={2} />
            <text x={x + 44} y={ry + rh / 2 + 4} fill="rgba(255,255,255,0.85)" fontSize={10.5}>{pick(m.label)}</text>
          </g>
        )
      })}
    </g>
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
  const GW = { x: 238, y: 40, w: 182, h: 300 }
  const gwR = GW.x + GW.w
  const gwMid = GW.y + GW.h / 2
  const clients = [
    { icon: Server, title: 'Internal Services', sub: 'order · merchant', x: 12, y: 96, w: 170, h: 64, color: DIA.cyan },
    { icon: Globe, title: 'External Partners', sub: '3rd-party integrations', x: 12, y: 258, w: 170, h: 64, color: DIA.sky },
  ]
  const prov = PROVIDERS.map((name, i) => ({ name, x: 470, y: 14 + i * 100, w: 178, h: 72 }))
  const redis = { x: GW.x + GW.w / 2 - 30, y: GW.y + GW.h + 18, w: 60, h: 50 }
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 660 434" className="dia-svg h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* client -> gateway */}
        <Edge id="gwi" from={[182, 128]} to={[GW.x, 138]} via={[212, 132]} color={DIA.cyan} />
        <Edge id="gwe" from={[182, 290]} to={[GW.x, 262]} via={[212, 286]} color={DIA.sky} />
        {/* gateway -> providers */}
        {prov.map((p, i) => (
          <Edge key={i} id={`gwp${i}`} from={[gwR, gwMid]} to={[p.x, p.y + p.h / 2]} via={[445, (gwMid + p.y + p.h / 2) / 2]} color={PROVIDER_META[p.name].edge} />
        ))}
        {/* gateway -> redis */}
        <Edge id="gwr" from={[redis.x + redis.w / 2, GW.y + GW.h]} to={[redis.x + redis.w / 2, redis.y]} color={DIA.rose} />

        {/* animated requests: clients -> gateway -> each provider (batched bulk-sign) */}
        {prov.map((p, i) => (
          <Token
            key={i}
            path={[[96, i % 2 ? 290 : 128], [GW.x, gwMid], [gwR, gwMid], [p.x, p.y + p.h / 2]]}
            delay={i * 0.45}
            color={PROVIDER_META[p.name].edge}
          />
        ))}
        <Token path={[[96, 128], [GW.x, gwMid]]} delay={0.2} color={DIA.cyan} />
        <Token path={[[96, 290], [GW.x, gwMid]]} delay={0.9} color={DIA.sky} />

        {clients.map((c) => (
          <ServiceNode key={c.title} x={c.x} y={c.y} w={c.w} h={c.h} title={c.title} sub={c.sub} color={c.color} Icon={c.icon} />
        ))}
        <GatewayShell x={GW.x} y={GW.y} w={GW.w} h={GW.h} mw={mw} pick={pick} />
        <Datastore x={redis.x} y={redis.y} w={redis.w} h={redis.h} title="Redis" color={DIA.rose} />

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
  const GW = { x: 66, y: 112, w: 208, h: 214 }
  const gcx = GW.x + GW.w / 2
  const exitY = GW.y + GW.h
  const clients = [
    { icon: Server, title: 'Internal', sub: 'order · merchant', x: 12, y: 12, w: 152, h: 56, color: DIA.cyan },
    { icon: Globe, title: 'External', sub: '3rd-party', x: 176, y: 12, w: 152, h: 56, color: DIA.sky },
  ]
  const prov = [
    { name: PROVIDERS[0], x: 8, y: 372 },
    { name: PROVIDERS[1], x: 180, y: 372 },
    { name: PROVIDERS[2], x: 8, y: 464 },
    { name: PROVIDERS[3], x: 180, y: 464 },
  ]
  const pw = 152
  const ph = 66
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 340 552" className="dia-svg h-full w-full" preserveAspectRatio="xMidYMid meet">
        <Edge id="gvi" from={[88, 68]} to={[gcx - 34, GW.y]} via={[100, 96]} color={DIA.cyan} />
        <Edge id="gve" from={[252, 68]} to={[gcx + 34, GW.y]} via={[240, 96]} color={DIA.sky} />
        {prov.map((p, i) => (
          <Edge key={i} id={`gvp${i}`} from={[gcx, exitY]} to={[p.x + pw / 2, p.y]} via={[p.x + pw / 2, exitY + 18]} color={PROVIDER_META[p.name].edge} />
        ))}
        <Edge id="gvr" from={[GW.x + GW.w, 160]} to={[300, 160]} color={DIA.rose} />

        {prov.map((p, i) => (
          <Token key={i} path={[[gcx, 40], [gcx, GW.y + 30], [gcx, exitY], [p.x + pw / 2, p.y + ph / 2]]} delay={i * 0.5} color={PROVIDER_META[p.name].edge} />
        ))}

        {clients.map((c) => (
          <ServiceNode key={c.title} x={c.x} y={c.y} w={c.w} h={c.h} title={c.title} sub={c.sub} color={c.color} Icon={c.icon} />
        ))}
        <GatewayShell x={GW.x} y={GW.y} w={GW.w} h={GW.h} mw={mw} pick={pick} />
        <Datastore x={296} y={136} w={40} h={48} title="Redis" color={DIA.rose} />

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
