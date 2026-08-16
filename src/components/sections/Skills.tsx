import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench, Server, LayoutDashboard, Database, Cloud, GitPullRequestArrow,
  CreditCard, Radio, Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { ServiceNode, Datastore, TopicNode, Edge, FlowPackets, DIA } from '../diagram/primitives'
import { TechGlyph, hasLogo } from '../diagram/techLogos'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { skillGroups, sectionIds } from '../../data/content'

const accentHex: Record<string, string> = { cyan: '#2dd4ff', blue: '#4f8cff', sky: '#60a5fa' }
const groupIcon: Record<string, LucideIcon> = {
  backend: Server,
  frontend: LayoutDashboard,
  data: Database,
  devops: Cloud,
  practices: GitPullRequestArrow,
}

type Zone = 'fe' | 'be' | 'db' | 'devops' | 'all'
const groupZone: Record<string, Zone> = {
  frontend: 'fe',
  backend: 'be',
  data: 'db',
  devops: 'devops',
  practices: 'all',
}

type NodeKind = 'client' | 'service' | 'topic' | 'store'
type Node = {
  id: string
  zone: 'fe' | 'be' | 'db'
  x: number; y: number; w: number; h: number
  title: string; sub?: string
  color: string; Icon?: LucideIcon; logo?: string; kind: NodeKind
}

// ── one master map of the whole platform (frontend → backend → data + infra) ──
const NODES: Node[] = [
  // frontend
  { id: 'dash', zone: 'fe', x: 96, y: 28, w: 214, h: 62, title: 'Web Dashboard', sub: 'React · Next.js · TS', color: DIA.blue, logo: 'react', kind: 'client' },
  { id: 'pwa', zone: 'fe', x: 344, y: 28, w: 214, h: 62, title: 'Merchant PWA', sub: 'React · Capacitor', color: DIA.blue, logo: 'react', kind: 'client' },
  // gateway
  { id: 'gw', zone: 'be', x: 218, y: 130, w: 218, h: 60, title: 'API Gateway', sub: 'Go · net/http', color: DIA.cyan, logo: 'go', kind: 'service' },
  // services
  { id: 'order', zone: 'be', x: 80, y: 242, w: 172, h: 62, title: 'Order Service', sub: 'Java · Spring', color: DIA.cyan, logo: 'java', kind: 'service' },
  { id: 'einv', zone: 'be', x: 270, y: 242, w: 172, h: 62, title: 'E-Invoice Svc', sub: 'NestJS', color: DIA.cyan, logo: 'nestjs', kind: 'service' },
  { id: 'pay', zone: 'be', x: 460, y: 242, w: 150, h: 62, title: 'Payment', sub: 'gRPC', color: DIA.cyan, Icon: CreditCard, kind: 'service' },
  // infra (right block)
  { id: 'kafka', zone: 'be', x: 650, y: 210, w: 228, h: 78, title: 'Kafka', sub: 'event bus · partitions', color: DIA.blue, logo: 'kafka', kind: 'topic' },
  { id: 'debz', zone: 'be', x: 650, y: 320, w: 228, h: 56, title: 'Debezium', sub: 'CDC · outbox', color: DIA.amber, Icon: Radio, kind: 'service' },
  { id: 'temporal', zone: 'be', x: 650, y: 410, w: 228, h: 62, title: 'Temporal', sub: 'orchestration', color: DIA.blue, logo: 'temporal', Icon: Workflow, kind: 'service' },
  // data
  { id: 'pg', zone: 'db', x: 92, y: 452, w: 150, h: 66, title: 'PostgreSQL', color: DIA.sky, logo: 'postgresql', kind: 'store' },
  { id: 'mongo', zone: 'db', x: 282, y: 452, w: 150, h: 66, title: 'MongoDB', color: DIA.sky, logo: 'mongodb', kind: 'store' },
  { id: 'redis', zone: 'db', x: 460, y: 452, w: 150, h: 66, title: 'Redis', color: DIA.sky, logo: 'redis', kind: 'store' },
]
const nodeById = (id: string) => NODES.find((n) => n.id === id)!

type Ed = { id: string; from: [number, number]; to: [number, number]; via?: [number, number]; color: string; dashed?: boolean; label?: string; lx?: number; ly?: number }
// correct flow: clients → gateway → order/e-invoice; order orchestrates payment through
// Temporal (task queue, async) — NOT a direct call; order → outbox/Debezium → Kafka → e-invoice
const EDGES: Ed[] = [
  { id: 'e1', from: [203, 90], to: [300, 130], via: [235, 110], color: DIA.blue },
  { id: 'e2', from: [451, 90], to: [356, 130], via: [418, 110], color: DIA.blue },
  { id: 'e3', from: [292, 190], to: [166, 242], via: [228, 220], color: DIA.cyan },
  { id: 'e4', from: [352, 190], to: [356, 242], via: [356, 216], color: DIA.cyan },
  { id: 'e5', from: [252, 258], to: [650, 438], via: [430, 430], color: DIA.blue, dashed: true, label: 'orchestrate', lx: 300, ly: 350 },
  { id: 'e6', from: [700, 410], to: [560, 292], via: [636, 352], color: DIA.blue, dashed: true, label: 'task-queue', lx: 588, ly: 386 },
  { id: 'e7', from: [252, 270], to: [650, 348], via: [455, 300], color: DIA.amber, label: 'outbox', lx: 420, ly: 292 },
  { id: 'e8', from: [700, 320], to: [700, 288], color: DIA.amber },
  { id: 'e9', from: [650, 249], to: [442, 262], via: [545, 250], color: DIA.blue, label: 'consume', lx: 545, ly: 240 },
  { id: 'e10', from: [166, 304], to: [167, 452], color: DIA.sky },
  { id: 'e11', from: [356, 304], to: [357, 452], color: DIA.sky },
  { id: 'e12', from: [535, 304], to: [535, 452], color: DIA.sky },
]

// hover detail — categorized stack per node
type Detail = { cat: string; techs: string[] }
const NODE_DETAIL: Record<string, Detail[]> = {
  dash: [
    { cat: 'Framework', techs: ['React', 'Next.js'] },
    { cat: 'Language', techs: ['TypeScript'] },
    { cat: 'State / data', techs: ['Zustand', 'TanStack'] },
    { cat: 'Charts', techs: ['ApexCharts', 'Recharts'] },
  ],
  pwa: [
    { cat: 'App shell', techs: ['React', 'Capacitor', 'PWA'] },
    { cat: 'State', techs: ['Zustand', 'TanStack'] },
  ],
  gw: [
    { cat: 'Language', techs: ['Go'] },
    { cat: 'HTTP', techs: ['net/http', 'Chi'] },
    { cat: 'Middleware', techs: ['Rate limit', 'Cache', 'Bulk-sign'] },
  ],
  order: [
    { cat: 'Language', techs: ['Java'] },
    { cat: 'Framework', techs: ['Spring Boot', 'Spring Security'] },
    { cat: 'Store', techs: ['PostgreSQL'] },
    { cat: 'Messaging', techs: ['Kafka', 'Outbox'] },
  ],
  einv: [
    { cat: 'Runtime', techs: ['NestJS', 'Node.js'] },
    { cat: 'Store', techs: ['MongoDB'] },
  ],
  pay: [
    { cat: 'RPC', techs: ['gRPC'] },
    { cat: 'Reliability', techs: ['Idempotency', 'Temporal'] },
  ],
  kafka: [
    { cat: 'Streaming', techs: ['Kafka'] },
    { cat: 'Patterns', techs: ['Partitions', 'Consumer groups', 'Retry/backoff'] },
  ],
  debz: [
    { cat: 'CDC', techs: ['Debezium'] },
    { cat: 'Pattern', techs: ['Outbox'] },
  ],
  temporal: [
    { cat: 'Orchestration', techs: ['Temporal'] },
    { cat: 'Patterns', techs: ['Saga', 'Compensation', 'Task queues'] },
  ],
  pg: [
    { cat: 'Engine', techs: ['PostgreSQL'] },
    { cat: 'Role', techs: ['System of record'] },
  ],
  mongo: [
    { cat: 'Engine', techs: ['MongoDB'] },
    { cat: 'Role', techs: ['E-invoice documents'] },
  ],
  redis: [
    { cat: 'Engine', techs: ['Redis'] },
    { cat: 'Role', techs: ['Cache', 'Rate limit', 'Idempotency'] },
  ],
}

function MapNode({ n, dim, glow, onHover }: { n: Node; dim: boolean; glow: boolean; onHover: (id: string | null) => void }) {
  return (
    <g
      style={{ opacity: dim ? 0.24 : 1, transition: 'opacity 0.4s ease', cursor: 'pointer' }}
      onMouseEnter={() => onHover(n.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* invisible hit area keeps hover stable across gaps */}
      <rect x={n.x - 4} y={n.y - 4} width={n.w + 8} height={n.h + 8} fill="transparent" />
      {n.kind === 'store' ? (
        <Datastore x={n.x} y={n.y} w={n.w} h={n.h} title={n.title} sub={n.sub} color={n.color} logo={n.logo} />
      ) : n.kind === 'topic' ? (
        <TopicNode x={n.x} y={n.y} w={n.w} h={n.h} title={n.title} sub={n.sub} color={n.color} logo={n.logo} />
      ) : (
        <ServiceNode x={n.x} y={n.y} w={n.w} h={n.h} title={n.title} sub={n.sub} color={n.color} Icon={n.Icon} logo={n.logo} active={glow} />
      )}
    </g>
  )
}

function ArchMap({ zone, onHover }: { zone: Zone; onHover: (id: string | null) => void }) {
  const dimEdges = zone === 'fe' || zone === 'db' || zone === 'devops'
  const isDim = (n: Node) => {
    if (zone === 'all') return false
    if (zone === 'devops') return true
    return n.zone !== zone
  }
  const isGlow = (n: Node) => zone === 'all' || (zone !== 'devops' && n.zone === zone)
  const BAND: Partial<Record<Zone, { x: number; y: number; w: number; h: number; c: string }>> = {
    fe: { x: 66, y: 12, w: 520, h: 92, c: DIA.blue },
    be: { x: 58, y: 114, w: 834, h: 372, c: DIA.cyan },
    db: { x: 70, y: 438, w: 552, h: 94, c: DIA.sky },
  }
  const band = BAND[zone]
  return (
    <svg viewBox="0 0 900 560" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {/* active-zone highlight so the current selection is obvious */}
      {band && (
        <rect x={band.x} y={band.y} width={band.w} height={band.h} rx={18}
          fill={`${band.c}0d`} stroke={`${band.c}66`} strokeWidth={1.5} strokeDasharray="7 6"
          style={{ transition: 'all 0.4s ease' }} />
      )}
      {/* tier guides */}
      {[['FRONTEND', 60], ['BACKEND', 300], ['DATA', 486]].map(([t, y]) => (
        <text key={t as string} x={10} y={y as number} fill="rgba(255,255,255,0.22)" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={700} transform={`rotate(-90 10 ${y})`} textAnchor="middle" letterSpacing={2}>
          {t}
        </text>
      ))}
      <text x={764} y={200} fill="rgba(255,255,255,0.22)" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" letterSpacing={2}>INFRA</text>

      {/* wiring */}
      <g style={{ opacity: dimEdges ? 0.28 : 0.95, transition: 'opacity 0.4s ease' }}>
        {EDGES.map((e) => (
          <g key={e.id}>
            <Edge id={e.id} from={e.from} to={e.to} via={e.via} color={e.color} dashed={e.dashed} />
            {e.label && (
              <text x={e.lx ?? (e.from[0] + e.to[0]) / 2} y={e.ly ?? e.from[1] - 6} textAnchor="middle" fill={`${e.color}`} fontSize={13} fontWeight={600} fontFamily="ui-monospace, monospace" style={{ paintOrder: 'stroke', stroke: '#0a0d1f', strokeWidth: 3 }}>
                {e.label}
              </text>
            )}
          </g>
        ))}
      </g>

      {/* live packets on the main path */}
      {zone !== 'devops' && (
        <g style={{ opacity: dimEdges ? 0.5 : 1 }}>
          <FlowPackets points={[[203, 90], [300, 140], [166, 242]]} color={DIA.cyan} count={2} dur={2} />
          <FlowPackets points={[[252, 270], [455, 300], [650, 348]]} color={DIA.amber} count={2} dur={2} />
          <FlowPackets points={[[650, 249], [545, 250], [442, 262]]} color={DIA.blue} count={2} dur={2.2} />
        </g>
      )}

      {/* devops platform base */}
      <g style={{ opacity: zone === 'devops' ? 1 : 0.4, transition: 'opacity 0.4s ease' }}>
        <rect x={40} y={532} width={820} height={22} rx={8} fill={zone === 'devops' ? 'rgba(45,212,255,0.14)' : 'rgba(255,255,255,0.03)'} stroke={zone === 'devops' ? `${DIA.cyan}aa` : 'rgba(255,255,255,0.08)'} />
        <Cloud x={54} y={536} width={14} height={14} color={zone === 'devops' ? DIA.cyan : 'rgba(255,255,255,0.4)'} strokeWidth={2} />
        <text x={76} y={547} fill="rgba(255,255,255,0.7)" fontSize={10} fontFamily="ui-monospace, monospace">
          DevOps · Docker · Kubernetes · Helm · GitOps · Grafana Loki · Rancher · CI/CD
        </text>
      </g>

      {NODES.map((n) => (
        <MapNode key={n.id} n={n} dim={isDim(n)} glow={isGlow(n)} onHover={onHover} />
      ))}
    </svg>
  )
}

/** HTML tooltip overlaying a hovered node — shows the categorized real stack. */
function NodeTooltip({ id }: { id: string }) {
  const n = nodeById(id)
  const detail = NODE_DETAIL[id]
  if (!detail) return null
  const cx = ((n.x + n.w / 2) / 900) * 100
  const above = n.y > 150
  const anchorY = above ? (n.y / 560) * 100 : ((n.y + n.h) / 560) * 100
  const left = Math.min(82, Math.max(18, cx))
  return (
    <motion.div
      initial={{ opacity: 0, y: above ? 8 : -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.16 }}
      className="pointer-events-none absolute z-30 w-[300px]"
      style={{ left: `${left}%`, top: `${anchorY}%`, transform: `translate(-50%, ${above ? '-112%' : '12%'})` }}
    >
      <div className="glass-strong rounded-2xl border border-white/10 p-4 shadow-glow">
        <div className="mb-3 flex items-center gap-2.5 border-b border-white/10 pb-2.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: n.color, boxShadow: `0 0 10px ${n.color}` }} />
          <span className="text-[15px] font-bold text-white">{n.title}</span>
          {n.sub && <span className="ml-auto font-mono text-[10px] text-white/40">{n.sub}</span>}
        </div>
        <div className="flex flex-col gap-2.5">
          {detail.map((d) => (
            <div key={d.cat} className="grid grid-cols-[76px_1fr] items-start gap-2">
              <span className="pt-1 font-mono text-[10px] uppercase leading-tight tracking-wider text-white/40">{d.cat}</span>
              <div className="flex flex-wrap gap-1.5">
                {d.techs.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1 text-[12px] font-medium text-white/90">
                    {hasLogo(t) && <TechGlyph name={t} size={14} />}
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/** Mobile: the same story as a legible vertical stack of tiers. */
function ArchStack() {
  const { pick } = useLang()
  const tierKeys = ['frontend', 'backend', 'data']
  const baseKeys = ['devops', 'practices']
  const byKey = (k: string) => skillGroups.find((g) => g.key === k)!
  const Card = ({ k, flow }: { k: string; flow?: boolean }) => {
    const g = byKey(k)
    const c = accentHex[g.accent]
    const Icon = groupIcon[g.key] ?? Server
    return (
      <>
        <div className="glass rounded-2xl p-4" style={{ borderColor: `${c}33` }}>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${c}1f`, border: `1px solid ${c}55` }}>
              <Icon size={17} color={c} strokeWidth={2} />
            </span>
            <h3 className="font-bold">{pick(g.title)}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {g.skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-white/85" style={{ boxShadow: `0 0 0 1px ${c}22` }}>
                {hasLogo(s) && <TechGlyph name={s} size={13} />}
                {s}
              </span>
            ))}
          </div>
        </div>
        {flow && (
          <div className="flex justify-center py-1">
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-accent-cyan/60">
              ↓
            </motion.div>
          </div>
        )}
      </>
    )
  }
  return (
    <div className="flex flex-col gap-1">
      {tierKeys.map((k, i) => (
        <Card key={k} k={k} flow={i < tierKeys.length - 1} />
      ))}
      <div className="mt-2 grid gap-3">
        {baseKeys.map((k) => (
          <Card key={k} k={k} />
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  const { pick } = useLang()
  const { isMobile } = useDeviceTier()
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<string | null>(null)
  const group = skillGroups[active]
  const color = accentHex[group.accent]
  const zone = groupZone[group.key] ?? 'all'

  return (
    <section id={sectionIds.skills} className="section-pad relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-page relative">
        <SectionHeading kicker={pick(ui.skills.kicker)} title={pick(ui.skills.title)} Icon={Wrench} />

        {isMobile ? (
          <Reveal className="mt-8">
            <ArchStack />
          </Reveal>
        ) : (
          <div className="mt-9 flex flex-col gap-5">
            {/* horizontal layer tabs */}
            <Reveal className="min-w-0">
              <div className="flex flex-wrap gap-2.5">
                {skillGroups.map((g, i) => {
                  const Icon = groupIcon[g.key] ?? Server
                  const gc = accentHex[g.accent]
                  const on = active === i
                  return (
                    <button
                      key={g.key}
                      onClick={() => setActive(i)}
                      className={`group flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-left transition-all ${
                        on ? 'bg-white/[0.07]' : 'border-white/5 bg-transparent hover:border-white/10'
                      }`}
                      style={on ? { borderColor: `${gc}80`, boxShadow: `0 0 0 1px ${gc}40, 0 6px 20px -10px ${gc}` } : undefined}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: on ? `${gc}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${on ? `${gc}66` : 'rgba(255,255,255,0.08)'}` }}>
                        <Icon size={16} color={on ? gc : 'rgba(255,255,255,0.5)'} strokeWidth={2.2} />
                      </span>
                      <span className={`font-semibold ${on ? 'text-white' : 'text-white/60'}`}>{pick(g.title)}</span>
                      <span className="font-mono text-xs" style={{ color: on ? gc : 'rgba(255,255,255,0.3)' }}>{String(g.skills.length).padStart(2, '0')}</span>
                    </button>
                  )
                })}
              </div>
              <p className="mt-3 font-mono text-xs leading-relaxed text-white/40">{pick(ui.skills.hint)}</p>
            </Reveal>

            {/* the master architecture map — full width */}
            <Reveal delay={0.1} className="min-w-0">
              <div className="glass relative rounded-3xl p-3 sm:p-6">
                {/* clipped glow layer so the tooltip can overflow the card */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute left-1/2 top-1/2 h-80 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl transition-colors duration-500" style={{ background: color }} />
                </div>
                <div className="relative aspect-[900/560] w-full">
                  <ArchMap zone={zone} onHover={setHover} />
                  <AnimatePresence>{hover && <NodeTooltip key={hover} id={hover} />}</AnimatePresence>
                </div>
                {/* active layer chips */}
                <div className="relative mt-2 flex flex-wrap gap-2 border-t border-white/5 pt-4">
                  {group.skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-white/85" style={{ boxShadow: `0 0 0 1px ${color}22` }}>
                      {hasLogo(s) && <TechGlyph name={s} size={13} />}
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  )
}
