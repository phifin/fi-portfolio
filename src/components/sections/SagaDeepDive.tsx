import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Workflow, Cog, CreditCard, Boxes, CheckCircle2, RotateCcw, ListOrdered } from 'lucide-react'
import { DeepDiveLayout } from '../ui/DeepDiveLayout'
import { ServiceNode, Edge, DIA } from '../diagram/primitives'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { sectionIds } from '../../data/content'

type Mode = 'happy' | 'fail'
type XY = [number, number]
type Node3 = 'order' | 'inv' | 'pay'
type Step = { from: XY; to: XY; via?: XY; label: { en: string; vi: string }; color: string; hot: Node3[]; q: 'order' | 'payment' | null }

type Layout = {
  vb: string
  cluster: { x: number; y: number; w: number; h: number }
  qW: number
  orderQ: XY
  payQ: XY
  order: { x: number; y: number; w: number; h: number }
  inv: { x: number; y: number; w: number; h: number }
  payment: { x: number; y: number; w: number; h: number }
  steps: (mode: Mode) => Step[]
}

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
      <Workflow x={box.x + box.w / 2 - 72} y={box.y + 9} width={14} height={14} color={DIA.blue} strokeWidth={2} />
      <text x={box.x + box.w / 2 + 8} y={box.y + 20} textAnchor="middle" fill="#fff" fontSize={12.5} fontWeight={700}>Temporal Cluster</text>
      {/* baseline sits ~3px above the first queue pill so descenders stay clear */}
      <text x={box.x + box.w / 2} y={box.y + 34} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9}>durable orchestration · task queues</text>
      <QueuePill x={orderQ[0]} y={orderQ[1]} w={qW} label="order-task-queue" active={activeQueue === 'order'} />
      <QueuePill x={payQ[0]} y={payQ[1]} w={qW} label="payment-task-queue" active={activeQueue === 'payment'} />
    </g>
  )
}

const L_H: Layout = {
  vb: '0 0 480 344',
  cluster: { x: 116, y: 14, w: 248, h: 112 },
  qW: 216,
  orderQ: [132, 54],
  payQ: [132, 88],
  order: { x: 8, y: 240, w: 150, h: 84 },
  inv: { x: 166, y: 240, w: 148, h: 84 },
  payment: { x: 322, y: 240, w: 150, h: 84 },
  steps: (mode) => {
    const base: Step[] = [
      { from: [83, 240], to: [190, 66], via: [96, 158], color: DIA.cyan, hot: ['order'], q: 'order', label: { en: '1 · Worker polls order-task-queue → runs OrderWorkflow', vi: '1 · Worker poll order-task-queue → chạy OrderWorkflow' } },
      { from: [150, 262], to: [240, 240], via: [198, 248], color: DIA.amber, hot: ['inv'], q: null, label: { en: '2 · Workflow reserves stock → Inventory (decrement qty)', vi: '2 · Workflow giữ hàng → Inventory (trừ số lượng)' } },
      { from: [156, 250], to: [300, 97], via: [252, 150], color: DIA.blue, hot: ['pay'], q: 'payment', label: { en: '3 · Schedules ChargePayment → payment-task-queue', vi: '3 · Đẩy ChargePayment → payment-task-queue' } },
      { from: [397, 240], to: [324, 97], via: [404, 152], color: DIA.cyan, hot: ['pay'], q: 'payment', label: { en: '4 · Payment Worker pulls task → charges card', vi: '4 · Payment Worker pull task → thu tiền' } },
    ]
    if (mode === 'happy')
      return [...base,
        { from: [397, 240], to: [83, 240], via: [240, 210], color: DIA.green, hot: ['order', 'inv'], q: null, label: { en: '5 · Success → confirm order & commit reserved stock', vi: '5 · Thành công → xác nhận đơn & chốt hàng đã giữ' } },
      ]
    return [
      ...base.slice(0, 3),
      { from: [397, 240], to: [324, 97], via: [404, 152], color: DIA.rose, hot: ['pay'], q: 'payment', label: { en: '4 · Payment Worker pulls task → charge FAILS', vi: '4 · Payment Worker pull task → thu tiền THẤT BẠI' } },
      { from: [397, 240], to: [240, 240], via: [320, 206], color: DIA.rose, hot: ['inv'], q: null, label: { en: '5 · Compensate: release reserved stock (+qty back)', vi: '5 · Bù trừ: trả lại hàng đã giữ (+cộng lại số lượng)' } },
      { from: [166, 282], to: [158, 282], via: [128, 336], color: DIA.rose, hot: ['order'], q: null, label: { en: '6 · Roll order status back → CANCELLED', vi: '6 · Rollback trạng thái đơn → ĐÃ HUỶ' } },
    ]
  },
}

const L_V: Layout = {
  vb: '0 0 320 560',
  cluster: { x: 20, y: 12, w: 280, h: 112 },
  qW: 250,
  orderQ: [35, 52],
  payQ: [35, 86],
  order: { x: 24, y: 176, w: 272, h: 66 },
  inv: { x: 24, y: 300, w: 272, h: 66 },
  payment: { x: 24, y: 458, w: 272, h: 66 },
  steps: (mode) => {
    const base: Step[] = [
      { from: [96, 176], to: [80, 74], via: [58, 130], color: DIA.cyan, hot: ['order'], q: 'order', label: { en: '1 · Worker polls order-task-queue → runs OrderWorkflow', vi: '1 · Worker poll order-task-queue → chạy OrderWorkflow' } },
      { from: [160, 176], to: [160, 300], via: [235, 240], color: DIA.amber, hot: ['inv'], q: null, label: { en: '2 · Reserve stock → Inventory (decrement qty)', vi: '2 · Giữ hàng → Inventory (trừ số lượng)' } },
      { from: [200, 124], to: [200, 458], via: [280, 290], color: DIA.blue, hot: ['pay'], q: 'payment', label: { en: '3 · Schedule ChargePayment → payment-task-queue', vi: '3 · Đẩy ChargePayment → payment-task-queue' } },
    ]
    if (mode === 'happy')
      return [...base,
        { from: [120, 458], to: [120, 124], via: [40, 290], color: DIA.green, hot: ['order', 'inv'], q: null, label: { en: '4 · Success → confirm order & commit stock', vi: '4 · Thành công → xác nhận đơn & chốt hàng' } },
      ]
    return [
      ...base,
      { from: [160, 458], to: [160, 366], via: [250, 412], color: DIA.rose, hot: ['inv'], q: null, label: { en: '4 · Fail → release reserved stock (+qty back)', vi: '4 · Lỗi → trả lại hàng đã giữ (+cộng lại)' } },
      { from: [120, 300], to: [120, 242], via: [40, 270], color: DIA.rose, hot: ['order'], q: null, label: { en: '5 · Roll order status back → CANCELLED', vi: '5 · Rollback trạng thái đơn → ĐÃ HUỶ' } },
    ]
  },
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
  const hot = (n: Node3) => cur.hot.includes(n)

  return (
    <div className="absolute inset-0 flex flex-col">
      <svg viewBox={layout.vb} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {steps.map((s, i) => (
          <g key={i} opacity={i === active ? 1 : 0.14}>
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

        <TemporalCluster box={layout.cluster} qW={layout.qW} orderQ={layout.orderQ} payQ={layout.payQ} activeQueue={cur.q} />
        <ServiceNode {...layout.order} title="Order Worker" sub="Order Service · Java" color={DIA.cyan} Icon={Cog} active={hot('order')} />
        <ServiceNode {...layout.inv} title="Inventory" sub="stock reservation" color={DIA.amber} Icon={Boxes} active={hot('inv')} />
        <ServiceNode {...layout.payment} title="Payment Worker" sub="executes activities" color={DIA.cyan} Icon={CreditCard} active={hot('pay')} />
      </svg>

      <div className="px-4 pb-4">
        <motion.div
          key={cur.label.en}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-center font-mono text-[13px] leading-snug"
          style={{ color: cur.color }}
        >
          {mode === 'fail' && cur.color === DIA.rose ? <RotateCcw size={15} className="shrink-0" /> : mode === 'happy' && active === steps.length - 1 ? <CheckCircle2 size={15} className="shrink-0" /> : null}
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
