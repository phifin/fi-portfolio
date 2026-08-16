import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Workflow, Cog, CreditCard, CheckCircle2, RotateCcw, ListOrdered } from 'lucide-react'
import { DeepDiveLayout } from '../ui/DeepDiveLayout'
import { ServiceNode, Edge, DIA } from '../diagram/primitives'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { sectionIds } from '../../data/content'

type Mode = 'happy' | 'fail'
type XY = [number, number]
type Step = { from: XY; to: XY; via?: XY; label: { en: string; vi: string }; color: string }

type Layout = {
  vb: string
  cluster: { x: number; y: number; w: number; h: number }
  qW: number
  orderQ: XY
  payQ: XY
  order: { x: number; y: number; w: number; h: number }
  payment: { x: number; y: number; w: number; h: number }
  steps: (mode: Mode) => Step[]
}

/** Reusable task-queue pill inside the Temporal cluster. */
function QueuePill({ x, y, w, label, active }: { x: number; y: number; w: number; label: string; active: boolean }) {
  const h = 26
  const c = active ? DIA.cyan : DIA.blue
  return (
    <g style={active ? { filter: `drop-shadow(0 0 7px ${c}88)` } : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={7} fill={`${c}1c`} stroke={`${c}${active ? 'cc' : '55'}`} strokeWidth={active ? 1.6 : 1.1} />
      <ListOrdered x={x + 9} y={y + h / 2 - 7} width={13} height={13} color={c} strokeWidth={2} />
      <text x={x + 28} y={y + h / 2 + 3.5} fill="rgba(255,255,255,0.9)" fontSize={10} fontFamily="ui-monospace, monospace">{label}</text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x + w - 12 - i * 6} y={y + 8} width={3} height={h - 16} rx={1} fill={`${c}66`} />
      ))}
    </g>
  )
}

function TemporalCluster({ box, qW, orderQ, payQ, activeQueue }: { box: { x: number; y: number; w: number; h: number }; qW: number; orderQ: XY; payQ: XY; activeQueue: 'order' | 'payment' | null }) {
  return (
    <g>
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={14}
        fill="rgba(79,140,255,0.06)"
        stroke={`${DIA.blue}88`}
        strokeWidth={1.5}
        strokeDasharray="6 5"
        style={{ filter: `drop-shadow(0 0 16px ${DIA.blue}33)` }}
      />
      <Workflow x={box.x + box.w / 2 - 46} y={box.y + 11} width={14} height={14} color={DIA.blue} strokeWidth={2} />
      <text x={box.x + box.w / 2 + 8} y={box.y + 22} textAnchor="middle" fill="#fff" fontSize={12.5} fontWeight={700}>Temporal Cluster</text>
      <text x={box.x + box.w / 2} y={box.y + 37} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9}>durable orchestration · task queues</text>
      <QueuePill x={orderQ[0]} y={orderQ[1]} w={qW} label="order-task-queue" active={activeQueue === 'order'} />
      <QueuePill x={payQ[0]} y={payQ[1]} w={qW} label="payment-task-queue" active={activeQueue === 'payment'} />
    </g>
  )
}

const L_H: Layout = {
  vb: '0 0 460 316',
  cluster: { x: 118, y: 16, w: 224, h: 112 },
  qW: 196,
  orderQ: [132, 62],
  payQ: [132, 96],
  order: { x: 18, y: 214, w: 188, h: 82 },
  payment: { x: 254, y: 214, w: 188, h: 82 },
  steps: (mode) => [
    { from: [112, 214], to: [180, 88], via: [116, 150], label: { en: '1 · Worker polls order-task-queue → runs OrderWorkflow', vi: '1 · Worker poll order-task-queue → chạy OrderWorkflow' }, color: DIA.cyan },
    { from: [150, 214], to: [282, 122], via: [232, 165], label: { en: '2 · Workflow schedules ChargePayment activity → payment-task-queue', vi: '2 · Workflow đẩy activity ChargePayment → payment-task-queue' }, color: DIA.blue },
    { from: [300, 122], to: [348, 214], via: [344, 165], label: { en: '3 · Payment worker pulls task → charges', vi: '3 · Payment worker pull task → thu tiền' }, color: DIA.cyan },
    mode === 'happy'
      ? { from: [348, 214], to: [180, 88], via: [232, 158], label: { en: '4 · Reports success → workflow confirms order', vi: '4 · Báo thành công → workflow xác nhận đơn' }, color: DIA.green }
      : { from: [348, 214], to: [180, 88], via: [232, 158], label: { en: '4 · Reports failure → workflow runs compensation (rollback)', vi: '4 · Báo lỗi → workflow chạy compensation (rollback)' }, color: DIA.rose },
  ],
}

const L_V: Layout = {
  vb: '0 0 320 452',
  cluster: { x: 20, y: 14, w: 280, h: 116 },
  qW: 250,
  orderQ: [35, 62],
  payQ: [35, 96],
  order: { x: 24, y: 208, w: 272, h: 70 },
  payment: { x: 24, y: 338, w: 272, h: 70 },
  steps: (mode) => [
    { from: [90, 208], to: [70, 88], via: [58, 150], label: { en: '1 · Worker polls order-task-queue → runs OrderWorkflow', vi: '1 · Worker poll order-task-queue → chạy OrderWorkflow' }, color: DIA.cyan },
    { from: [160, 208], to: [230, 122], via: [210, 165], label: { en: '2 · Workflow schedules ChargePayment activity', vi: '2 · Workflow đẩy activity ChargePayment' }, color: DIA.blue },
    { from: [200, 130], to: [200, 338], via: [255, 240], label: { en: '3 · Payment worker pulls task → charges', vi: '3 · Payment worker pull task → thu tiền' }, color: DIA.cyan },
    mode === 'happy'
      ? { from: [120, 338], to: [90, 88], via: [66, 230], label: { en: '4 · Reports success → confirms order', vi: '4 · Báo thành công → xác nhận đơn' }, color: DIA.green }
      : { from: [120, 338], to: [90, 88], via: [66, 230], label: { en: '4 · Reports failure → compensation (rollback)', vi: '4 · Báo lỗi → compensation (rollback)' }, color: DIA.rose },
  ],
}

function SagaDiagram({ mode, layout }: { mode: Mode; layout: Layout }) {
  const { pick } = useLang()
  const steps = layout.steps(mode)
  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(0)
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 2100)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, layout])

  const cur = steps[active]
  // which queue is "hot" for the active step
  const activeQueue = active === 0 || active === 3 ? 'order' : active === 1 ? 'payment' : 'payment'

  return (
    <div className="absolute inset-0 flex flex-col">
      <svg viewBox={layout.vb} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {steps.map((s, i) => (
          <g key={i} opacity={i === active ? 1 : 0.22}>
            <Edge id={`s${i}`} from={s.from} to={s.to} via={s.via} color={s.color} dashed={i === active} />
          </g>
        ))}

        <motion.circle
          key={`p-${active}-${mode}`}
          r={5}
          fill={cur.color}
          style={{ filter: `drop-shadow(0 0 6px ${cur.color})`, willChange: 'transform' }}
          initial={{ cx: cur.from[0], cy: cur.from[1] }}
          animate={{ cx: cur.via ? [cur.from[0], cur.via[0], cur.to[0]] : [cur.from[0], cur.to[0]], cy: cur.via ? [cur.from[1], cur.via[1], cur.to[1]] : [cur.from[1], cur.to[1]] }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />

        <TemporalCluster box={layout.cluster} qW={layout.qW} orderQ={layout.orderQ} payQ={layout.payQ} activeQueue={activeQueue} />
        <ServiceNode {...layout.order} title="Order Worker" sub="Order Service · Java" color={DIA.cyan} Icon={Cog} active={active === 0 || active === 3} />
        <ServiceNode {...layout.payment} title="Payment Worker" sub="executes activities" color={DIA.cyan} Icon={CreditCard} active={active === 2} />
      </svg>

      <div className="px-4 pb-4">
        <motion.div
          key={cur.label.en}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-center font-mono text-[13px] leading-snug"
          style={{ color: cur.color }}
        >
          {mode === 'fail' && active === 3 ? <RotateCcw size={15} className="shrink-0" /> : mode === 'happy' && active === 3 ? <CheckCircle2 size={15} className="shrink-0" /> : null}
          {pick(cur.label)}
        </motion.div>
      </div>
    </div>
  )
}

export function SagaDeepDive() {
  const { pick } = useLang()
  const { isMobile } = useDeviceTier()
  const [mode, setMode] = useState<Mode>('happy')

  return (
    <DeepDiveLayout
      id={sectionIds.saga}
      kicker={pick(ui.saga.kicker)}
      title={pick(ui.saga.title)}
      body={pick(ui.saga.body)}
      Icon={Workflow}
      flip
      legend={
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setMode('happy')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              mode === 'happy' ? 'bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/50' : 'glass text-white/60'
            }`}
          >
            <CheckCircle2 size={15} /> {pick(ui.saga.happy)}
          </button>
          <button
            onClick={() => setMode('fail')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              mode === 'fail' ? 'bg-rose-400/20 text-rose-300 ring-1 ring-rose-400/50' : 'glass text-white/60'
            }`}
          >
            <RotateCcw size={15} /> {pick(ui.saga.fail)}
          </button>
        </div>
      }
    >
      <SagaDiagram mode={mode} layout={isMobile ? L_V : L_H} />
    </DeepDiveLayout>
  )
}
