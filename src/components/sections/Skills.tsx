import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Wrench, Server, LayoutDashboard, Database, Cloud, GitPullRequestArrow,
  Smartphone, Split, Boxes, FileText, CreditCard, Radio, Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { ServiceNode, Datastore, TopicNode, Edge, FlowPackets, DIA } from '../diagram/primitives'
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

// which architecture zone each skill group lights up on the map
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
  color: string; Icon?: LucideIcon; kind: NodeKind
}

// ── one master map of the whole platform (frontend → backend → data + infra) ──
const NODES: Node[] = [
  // frontend
  { id: 'dash', zone: 'fe', x: 96, y: 28, w: 214, h: 62, title: 'Web Dashboard', sub: 'React · Next.js · TS', color: DIA.blue, Icon: LayoutDashboard, kind: 'client' },
  { id: 'pwa', zone: 'fe', x: 344, y: 28, w: 214, h: 62, title: 'Merchant PWA', sub: 'React · Capacitor', color: DIA.blue, Icon: Smartphone, kind: 'client' },
  // gateway
  { id: 'gw', zone: 'be', x: 218, y: 130, w: 218, h: 60, title: 'API Gateway', sub: 'Go · net/http', color: DIA.cyan, Icon: Split, kind: 'service' },
  // services
  { id: 'order', zone: 'be', x: 80, y: 242, w: 172, h: 62, title: 'Order Service', sub: 'Java', color: DIA.cyan, Icon: Boxes, kind: 'service' },
  { id: 'einv', zone: 'be', x: 270, y: 242, w: 172, h: 62, title: 'E-Invoice Svc', sub: 'NestJS', color: DIA.cyan, Icon: FileText, kind: 'service' },
  { id: 'pay', zone: 'be', x: 460, y: 242, w: 150, h: 62, title: 'Payment', sub: 'gRPC', color: DIA.cyan, Icon: CreditCard, kind: 'service' },
  // infra (right block)
  { id: 'kafka', zone: 'be', x: 650, y: 210, w: 228, h: 78, title: 'Kafka', sub: 'event bus · partitions', color: DIA.blue, kind: 'topic' },
  { id: 'debz', zone: 'be', x: 650, y: 320, w: 228, h: 56, title: 'Debezium', sub: 'CDC · outbox', color: DIA.amber, Icon: Radio, kind: 'service' },
  { id: 'temporal', zone: 'be', x: 650, y: 410, w: 228, h: 62, title: 'Temporal', sub: 'orchestration', color: DIA.blue, Icon: Workflow, kind: 'service' },
  // data
  { id: 'pg', zone: 'db', x: 92, y: 452, w: 150, h: 66, title: 'PostgreSQL', color: DIA.sky, kind: 'store' },
  { id: 'mongo', zone: 'db', x: 282, y: 452, w: 150, h: 66, title: 'MongoDB', color: DIA.sky, kind: 'store' },
  { id: 'redis', zone: 'db', x: 460, y: 452, w: 150, h: 66, title: 'Redis', color: DIA.sky, kind: 'store' },
]

type Ed = { id: string; from: [number, number]; to: [number, number]; via?: [number, number]; color: string; dashed?: boolean; label?: string }
const EDGES: Ed[] = [
  { id: 'e1', from: [203, 90], to: [288, 130], via: [235, 110], color: DIA.blue },
  { id: 'e2', from: [451, 90], to: [366, 130], via: [418, 110], color: DIA.blue },
  { id: 'e3', from: [290, 190], to: [166, 242], via: [232, 218], color: DIA.cyan },
  { id: 'e4', from: [327, 190], to: [356, 242], via: [342, 218], color: DIA.cyan },
  { id: 'e5', from: [400, 190], to: [520, 242], via: [462, 218], color: DIA.cyan },
  { id: 'e6', from: [252, 292], to: [460, 292], color: DIA.sky, label: 'gRPC' },
  { id: 'e7', from: [252, 280], to: [650, 348], via: [440, 322], color: DIA.amber },
  { id: 'e8', from: [764, 320], to: [764, 288], color: DIA.amber },
  { id: 'e9', from: [650, 240], to: [442, 268], via: [540, 246], color: DIA.blue },
  { id: 'e10', from: [706, 410], to: [560, 304], via: [640, 366], color: DIA.blue, dashed: true },
  { id: 'e11', from: [650, 452], to: [252, 300], via: [430, 452], color: DIA.blue, dashed: true },
  { id: 'e12', from: [166, 304], to: [166, 452], color: DIA.sky },
  { id: 'e13', from: [356, 304], to: [356, 452], color: DIA.sky },
  { id: 'e14', from: [531, 304], to: [531, 452], color: DIA.sky },
]

function MapNode({ n, dim, glow }: { n: Node; dim: boolean; glow: boolean }) {
  const active = glow
  return (
    <g style={{ opacity: dim ? 0.24 : 1, transition: 'opacity 0.4s ease' }}>
      {n.kind === 'store' ? (
        <Datastore x={n.x} y={n.y} w={n.w} h={n.h} title={n.title} sub={n.sub} color={n.color} />
      ) : n.kind === 'topic' ? (
        <TopicNode x={n.x} y={n.y} w={n.w} h={n.h} title={n.title} sub={n.sub} color={n.color} />
      ) : (
        <ServiceNode x={n.x} y={n.y} w={n.w} h={n.h} title={n.title} sub={n.sub} color={n.color} Icon={n.Icon!} active={active} />
      )}
    </g>
  )
}

function ArchMap({ zone }: { zone: Zone }) {
  const dimEdges = zone === 'fe' || zone === 'db' || zone === 'devops'
  const isDim = (n: Node) => {
    if (zone === 'all') return false
    if (zone === 'devops') return true
    return n.zone !== zone
  }
  const isGlow = (n: Node) => zone === 'all' || (zone !== 'devops' && n.zone === zone)
  return (
    <svg viewBox="0 0 900 560" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {/* tier guides */}
      {[['FRONTEND', 60], ['BACKEND', 300], ['DATA', 486]].map(([t, y]) => (
        <text key={t as string} x={10} y={y as number} fill="rgba(255,255,255,0.22)" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={700} transform={`rotate(-90 10 ${y})`} textAnchor="middle" letterSpacing={2}>
          {t}
        </text>
      ))}
      <text x={764} y={200} fill="rgba(255,255,255,0.22)" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" letterSpacing={2}>INFRA</text>

      {/* wiring */}
      <g style={{ opacity: dimEdges ? 0.16 : 0.4, transition: 'opacity 0.4s ease' }}>
        {EDGES.map((e) => (
          <g key={e.id}>
            <Edge id={e.id} from={e.from} to={e.to} via={e.via} color={e.color} dashed={e.dashed} />
            {e.label && (
              <text x={(e.from[0] + e.to[0]) / 2} y={e.from[1] - 6} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize={9} fontFamily="ui-monospace, monospace">
                {e.label}
              </text>
            )}
          </g>
        ))}
      </g>

      {/* live packets on the main path */}
      {zone !== 'devops' && (
        <g style={{ opacity: dimEdges ? 0.5 : 1 }}>
          <FlowPackets points={[[203, 90], [288, 150], [166, 242]]} color={DIA.cyan} count={2} dur={2} />
          <FlowPackets points={[[252, 280], [440, 322], [650, 348]]} color={DIA.amber} count={2} dur={2} />
          <FlowPackets points={[[764, 320], [764, 288], [540, 246], [442, 268]]} color={DIA.sky} count={2} dur={2.2} />
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
        <MapNode key={n.id} n={n} dim={isDim(n)} glow={isGlow(n)} />
      ))}
    </svg>
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
              <span key={s} className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-white/85" style={{ boxShadow: `0 0 0 1px ${c}22` }}>
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
          <div className="mt-10 grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* zone selector */}
            <Reveal className="min-w-0">
              <div className="flex flex-col gap-2">
                {skillGroups.map((g, i) => {
                  const Icon = groupIcon[g.key] ?? Server
                  const gc = accentHex[g.accent]
                  const on = active === i
                  return (
                    <button
                      key={g.key}
                      onClick={() => setActive(i)}
                      className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                        on ? 'border-white/20 bg-white/[0.06]' : 'border-white/5 bg-transparent hover:border-white/10'
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: on ? `${gc}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${on ? `${gc}66` : 'rgba(255,255,255,0.08)'}` }}>
                        <Icon size={16} color={on ? gc : 'rgba(255,255,255,0.5)'} strokeWidth={2.2} />
                      </span>
                      <span className={`font-semibold ${on ? 'text-white' : 'text-white/60'}`}>{pick(g.title)}</span>
                      <span className="ml-auto font-mono text-xs text-white/30">{String(g.skills.length).padStart(2, '0')}</span>
                    </button>
                  )
                })}
                <p className="mt-1 px-1 font-mono text-xs leading-relaxed text-white/35">{pick(ui.skills.hint)}</p>
              </div>
            </Reveal>

            {/* the master architecture map */}
            <Reveal delay={0.1} className="min-w-0">
              <div className="glass relative overflow-hidden rounded-3xl p-3 sm:p-4">
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl" style={{ background: color }} />
                <div className="relative aspect-[900/560] w-full">
                  <ArchMap zone={zone} />
                </div>
                {/* active group chips */}
                <div className="relative mt-1 flex flex-wrap gap-2 border-t border-white/5 pt-3">
                  {group.skills.map((s) => (
                    <span key={s} className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/85" style={{ boxShadow: `0 0 0 1px ${color}22` }}>
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
