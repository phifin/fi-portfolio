import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Workflow, Server, CreditCard, CheckCircle2, RotateCcw } from 'lucide-react'
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
  temporal: { x: number; y: number; w: number; h: number }
  order: { x: number; y: number; w: number; h: number }
  payment: { x: number; y: number; w: number; h: number }
  steps: (mode: Mode) => Step[]
}

const L_H: Layout = {
  vb: '0 0 440 300',
  temporal: { x: 150, y: 32, w: 140, h: 52 },
  order: { x: 30, y: 200, w: 150, h: 52 },
  payment: { x: 260, y: 200, w: 150, h: 52 },
  steps: (mode) => [
    { from: [198, 84], to: [118, 196], via: [150, 150], label: { en: '1 · Create order', vi: '1 · Tạo đơn' }, color: DIA.cyan },
    { from: [182, 226], to: [258, 226], label: { en: '2 · Charge payment (gRPC)', vi: '2 · Thu tiền (gRPC)' }, color: DIA.cyan },
    mode === 'happy'
      ? { from: [332, 196], to: [252, 84], via: [300, 150], label: { en: '3 · Paid ✓', vi: '3 · Đã thu ✓' }, color: DIA.green }
      : { from: [332, 196], to: [252, 84], via: [300, 150], label: { en: '3 · Payment failed ✗', vi: '3 · Thu tiền lỗi ✗' }, color: DIA.rose },
    mode === 'happy'
      ? { from: [242, 84], to: [138, 196], via: [180, 140], label: { en: '4 · Confirm order', vi: '4 · Xác nhận đơn' }, color: DIA.green }
      : { from: [242, 84], to: [138, 196], via: [180, 140], label: { en: '4 · Compensate → rollback', vi: '4 · Bù trừ → rollback' }, color: DIA.rose },
  ],
}

const L_V: Layout = {
  vb: '0 0 320 340',
  temporal: { x: 85, y: 16, w: 150, h: 54 },
  order: { x: 14, y: 246, w: 140, h: 54 },
  payment: { x: 166, y: 246, w: 140, h: 54 },
  steps: (mode) => [
    { from: [135, 70], to: [90, 242], via: [104, 155], label: { en: '1 · Create order', vi: '1 · Tạo đơn' }, color: DIA.cyan },
    { from: [154, 273], to: [166, 273], label: { en: '2 · Charge (gRPC)', vi: '2 · Thu tiền (gRPC)' }, color: DIA.cyan },
    mode === 'happy'
      ? { from: [236, 242], to: [185, 70], via: [216, 155], label: { en: '3 · Paid ✓', vi: '3 · Đã thu ✓' }, color: DIA.green }
      : { from: [236, 242], to: [185, 70], via: [216, 155], label: { en: '3 · Payment failed ✗', vi: '3 · Thu tiền lỗi ✗' }, color: DIA.rose },
    mode === 'happy'
      ? { from: [150, 70], to: [102, 242], via: [116, 150], label: { en: '4 · Confirm order', vi: '4 · Xác nhận đơn' }, color: DIA.green }
      : { from: [150, 70], to: [102, 242], via: [116, 150], label: { en: '4 · Compensate → rollback', vi: '4 · Bù trừ → rollback' }, color: DIA.rose },
  ],
}

function SagaDiagram({ mode, layout }: { mode: Mode; layout: Layout }) {
  const { pick } = useLang()
  const steps = layout.steps(mode)
  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(0)
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 1600)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, layout])

  const cur = steps[active]

  return (
    <div className="absolute inset-0 flex flex-col">
      <svg viewBox={layout.vb} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {steps.map((s, i) => (
          <g key={i} opacity={i === active ? 1 : 0.28}>
            <Edge id={`s${i}`} from={s.from} to={s.to} via={s.via} color={s.color} dashed={i === active} />
          </g>
        ))}

        <motion.circle
          key={`p-${active}-${mode}`}
          r={5}
          fill={cur.color}
          style={{ filter: `drop-shadow(0 0 6px ${cur.color})` }}
          initial={{ cx: cur.from[0], cy: cur.from[1] }}
          animate={{ cx: cur.via ? [cur.from[0], cur.via[0], cur.to[0]] : [cur.from[0], cur.to[0]], cy: cur.via ? [cur.from[1], cur.via[1], cur.to[1]] : [cur.from[1], cur.to[1]] }}
          transition={{ duration: 1.3, ease: 'easeInOut' }}
        />

        <ServiceNode {...layout.temporal} title="Temporal" sub="orchestrator" color={DIA.blue} Icon={Workflow} active />
        <ServiceNode {...layout.order} title="Order Service" sub="Java · PostgreSQL" color={DIA.cyan} Icon={Server} />
        <ServiceNode {...layout.payment} title="Payment" sub="gRPC" color={DIA.cyan} Icon={CreditCard} />
      </svg>

      <div className="px-4 pb-4">
        <motion.div
          key={cur.label.en}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-center font-mono text-sm"
          style={{ color: cur.color }}
        >
          {mode === 'happy' ? <CheckCircle2 size={15} /> : active >= 2 ? <RotateCcw size={15} /> : null}
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
