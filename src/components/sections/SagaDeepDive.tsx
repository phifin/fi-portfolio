import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DeepDiveLayout } from '../ui/DeepDiveLayout'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { sectionIds } from '../../data/content'

type Mode = 'happy' | 'fail'

type Step = { from: [number, number]; to: [number, number]; label: { en: string; vi: string }; color: string }

const NODES = {
  temporal: { x: 200, y: 55, w: 160, h: 52 },
  order: { x: 95, y: 235, w: 140, h: 52 },
  payment: { x: 305, y: 235, w: 140, h: 52 },
}

const stepsFor = (mode: Mode): Step[] => [
  { from: [160, 80], to: [110, 209], label: { en: '1 · Create order', vi: '1 · Tạo đơn' }, color: '#22d3ee' },
  { from: [165, 235], to: [235, 235], label: { en: '2 · Charge payment (gRPC)', vi: '2 · Thu tiền (gRPC)' }, color: '#22d3ee' },
  mode === 'happy'
    ? { from: [290, 209], to: [230, 80], label: { en: '3 · Paid ✓', vi: '3 · Đã thu ✓' }, color: '#34d399' }
    : { from: [290, 209], to: [230, 80], label: { en: '3 · Payment failed ✗', vi: '3 · Thu tiền lỗi ✗' }, color: '#fb7185' },
  mode === 'happy'
    ? { from: [240, 80], to: [130, 209], label: { en: '4 · Confirm order', vi: '4 · Xác nhận đơn' }, color: '#34d399' }
    : { from: [240, 80], to: [130, 209], label: { en: '4 · Compensate → rollback', vi: '4 · Bù trừ → rollback' }, color: '#fb7185' },
]

function NodeBox({ n, label, sub, color }: { n: { x: number; y: number; w: number; h: number }; label: string; sub: string; color: string }) {
  return (
    <g>
      <rect
        x={n.x - n.w / 2}
        y={n.y - n.h / 2}
        width={n.w}
        height={n.h}
        rx={10}
        fill="#0f1330"
        stroke={color}
        strokeOpacity={0.8}
        style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
      />
      <text x={n.x} y={n.y - 2} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
        {label}
      </text>
      <text x={n.x} y={n.y + 15} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={10}>
        {sub}
      </text>
    </g>
  )
}

function SagaDiagram({ mode }: { mode: Mode }) {
  const { pick } = useLang()
  const steps = stepsFor(mode)
  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(0)
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 1500)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const cur = steps[active]

  return (
    <div className="absolute inset-0 flex flex-col">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <defs>
          {steps.map((s, i) => (
            <marker key={i} id={`arrow-${i}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={s.color} />
            </marker>
          ))}
        </defs>

        {/* arrows */}
        {steps.map((s, i) => {
          const on = i === active
          return (
            <line
              key={i}
              x1={s.from[0]}
              y1={s.from[1]}
              x2={s.to[0]}
              y2={s.to[1]}
              stroke={s.color}
              strokeWidth={on ? 3 : 1.5}
              strokeOpacity={on ? 1 : 0.25}
              markerEnd={`url(#arrow-${i})`}
              strokeDasharray={on ? '6 6' : undefined}
            >
              {on && <animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.5s" repeatCount="indefinite" />}
            </line>
          )
        })}

        {/* traveling pulse on active arrow */}
        <motion.circle
          key={`pulse-${active}-${mode}`}
          r={5}
          fill={cur.color}
          style={{ filter: `drop-shadow(0 0 6px ${cur.color})` }}
          initial={{ cx: cur.from[0], cy: cur.from[1] }}
          animate={{ cx: cur.to[0], cy: cur.to[1] }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        <NodeBox n={NODES.temporal} label="Temporal" sub="orchestrator" color="#a855f7" />
        <NodeBox n={NODES.order} label="Order Service" sub="Java · PostgreSQL" color="#22d3ee" />
        <NodeBox n={NODES.payment} label="Payment Service" sub="gRPC" color="#22d3ee" />
      </svg>

      <div className="px-4 pb-4">
        <motion.div
          key={cur.label.en}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl px-4 py-2 text-center font-mono text-sm"
          style={{ color: cur.color }}
        >
          {pick(cur.label)}
        </motion.div>
      </div>
    </div>
  )
}

export function SagaDeepDive() {
  const { pick } = useLang()
  const [mode, setMode] = useState<Mode>('happy')

  return (
    <DeepDiveLayout
      id={sectionIds.saga}
      kicker={pick(ui.saga.kicker)}
      title={pick(ui.saga.title)}
      body={pick(ui.saga.body)}
      flip
      legend={
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setMode('happy')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              mode === 'happy' ? 'bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/50' : 'glass text-white/60'
            }`}
          >
            {pick(ui.saga.happy)}
          </button>
          <button
            onClick={() => setMode('fail')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              mode === 'fail' ? 'bg-rose-400/20 text-rose-300 ring-1 ring-rose-400/50' : 'glass text-white/60'
            }`}
          >
            {pick(ui.saga.fail)}
          </button>
        </div>
      }
    >
      <SagaDiagram mode={mode} />
    </DeepDiveLayout>
  )
}
