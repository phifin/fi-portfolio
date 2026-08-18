import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { TechGlyph, hasLogo } from './techLogos'

/** Shared professional SVG diagram vocabulary: service boxes, datastores,
 *  topic/queue shapes, edges with arrowheads and animated flow packets. */

export const DIA = {
  cyan: '#2dd4ff',
  blue: '#4f8cff',
  sky: '#38bdf8',
  green: '#34d399',
  amber: '#fbbf24',
  rose: '#fb7185',
  ink: '#0d1130',
}

type XY = [number, number]

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r},${g},${b},${a})`
}

/** Small colored icon chip used inside nodes. */
function IconChip({ x, y, Icon, color }: { x: number; y: number; Icon: LucideIcon; color: string }) {
  return (
    <>
      <rect x={x} y={y} width={22} height={22} rx={6} fill={hexA(color, 0.16)} stroke={hexA(color, 0.5)} />
      <Icon x={x + 4} y={y + 4} width={14} height={14} color={color} strokeWidth={2} />
    </>
  )
}

export function ServiceNode({
  x,
  y,
  w = 132,
  h = 50,
  title,
  sub,
  color,
  Icon,
  logo,
  active = false,
}: {
  x: number
  y: number
  w?: number
  h?: number
  title: string
  sub?: string
  color: string
  Icon?: LucideIcon
  /** real brand glyph key (techLogos); takes precedence over Icon */
  logo?: string
  active?: boolean
}) {
  const useLogo = logo && hasLogo(logo)
  return (
    <g className="dia-node">
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={11}
        fill="#0e1230"
        stroke={hexA(color, active ? 1 : 0.6)}
        strokeWidth={active ? 2 : 1.4}
        style={{ filter: `drop-shadow(0 0 ${active ? 12 : 7}px ${hexA(color, active ? 0.55 : 0.3)})` }}
      />
      {useLogo ? (
        <>
          <rect x={x + 10} y={y + h / 2 - 11} width={22} height={22} rx={6} fill={hexA(color, 0.1)} stroke={hexA(color, 0.28)} />
          <TechGlyph name={logo!} x={x + 13} y={y + h / 2 - 8} size={16} />
        </>
      ) : Icon ? (
        <IconChip x={x + 10} y={y + h / 2 - 11} Icon={Icon} color={color} />
      ) : null}
      <text x={x + 42} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} fill="#fff" fontSize={12.5} fontWeight={700}>
        {title}
      </text>
      {sub && (
        <text x={x + 42} y={y + h / 2 + 13} fill="rgba(255,255,255,0.5)" fontSize={9.5}>
          {sub}
        </text>
      )}
    </g>
  )
}

/** Cylinder = datastore (standard notation). */
export function Datastore({
  x,
  y,
  w = 92,
  h = 74,
  title,
  sub,
  color,
  logo,
}: {
  x: number
  y: number
  w?: number
  h?: number
  title: string
  sub?: string
  color: string
  logo?: string
}) {
  const ry = 9
  const cx = x + w / 2
  const useLogo = logo && hasLogo(logo)
  const d = `M${x},${y + ry} A${w / 2},${ry} 0 0 1 ${x + w},${y + ry} L${x + w},${y + h - ry} A${w / 2},${ry} 0 0 1 ${x},${y + h - ry} Z`
  return (
    <g className="dia-node" style={{ filter: `drop-shadow(0 0 8px ${hexA(color, 0.35)})` }}>
      <path d={d} fill="#0e1230" stroke={hexA(color, 0.7)} strokeWidth={1.4} />
      <ellipse cx={cx} cy={y + ry} rx={w / 2} ry={ry} fill={hexA(color, 0.18)} stroke={hexA(color, 0.7)} strokeWidth={1.4} />
      {useLogo && <TechGlyph name={logo!} x={x + 12} y={y + h / 2 - 8} size={16} />}
      <text x={cx} y={y + (sub ? h / 2 + 4 : h / 2 + 9)} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={12.5} fontWeight={700}>
        {title}
      </text>
      {sub && (
        <text x={cx} y={y + h / 2 + 19} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.5)" fontSize={9.5}>
          {sub}
        </text>
      )}
    </g>
  )
}

/** Partitioned topic/queue (Kafka) — recognizable log-with-partitions shape. */
export function TopicNode({
  x,
  y,
  w = 118,
  h = 70,
  title,
  sub,
  color,
  logo,
}: {
  x: number
  y: number
  w?: number
  h?: number
  title: string
  sub?: string
  color: string
  logo?: string
}) {
  const parts = [0, 1, 2]
  const bandH = 12
  const useLogo = logo && hasLogo(logo)
  return (
    <g className="dia-node" style={{ filter: `drop-shadow(0 0 10px ${hexA(color, 0.4)})` }}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#0e1230" stroke={hexA(color, 0.75)} strokeWidth={1.6} />
      {useLogo && <TechGlyph name={logo!} x={x + w / 2 - 46} y={y + 6} size={15} />}
      <text x={x + w / 2 + (useLogo ? 8 : 0)} y={y + 17} textAnchor="middle" fill="#fff" fontSize={12.5} fontWeight={700}>
        {title}
      </text>
      {parts.map((p) => (
        <g key={p}>
          <rect
            x={x + 12}
            y={y + 24 + p * (bandH + 4)}
            width={w - 24}
            height={bandH}
            rx={3}
            fill={hexA(color, 0.14)}
            stroke={hexA(color, 0.4)}
          />
          <line
            x1={x + 12 + (w - 24) / 3}
            y1={y + 24 + p * (bandH + 4)}
            x2={x + 12 + (w - 24) / 3}
            y2={y + 24 + p * (bandH + 4) + bandH}
            stroke={hexA(color, 0.4)}
          />
          <line
            x1={x + 12 + (2 * (w - 24)) / 3}
            y1={y + 24 + p * (bandH + 4)}
            x2={x + 12 + (2 * (w - 24)) / 3}
            y2={y + 24 + p * (bandH + 4) + bandH}
            stroke={hexA(color, 0.4)}
          />
        </g>
      ))}
      {sub && (
        <text x={x + w / 2} y={y + h + 14} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9.5}>
          {sub}
        </text>
      )}
    </g>
  )
}

/** Orthogonal-ish edge with arrowhead. `bend` adds a mid waypoint for elbow routing. */
export function Edge({
  id,
  from,
  to,
  via,
  color,
  dashed = false,
}: {
  id: string
  from: XY
  to: XY
  via?: XY
  color: string
  dashed?: boolean
}) {
  const d = via ? `M${from[0]},${from[1]} Q${via[0]},${via[1]} ${to[0]},${to[1]}` : `M${from[0]},${from[1]} L${to[0]},${to[1]}`
  return (
    <>
      <defs>
        {/* markerUnits=userSpaceOnUse is essential: the default (strokeWidth)
            multiplies the head by the 2px stroke, which made it 16 units long —
            over half of a 30-unit edge, and longer than the 14-unit edges in the
            mobile layouts, where it swallowed the line entirely. Absolute units
            keep it at 9.5 regardless of stroke. */}
        <marker
          id={`ah-${id}`}
          markerUnits="userSpaceOnUse"
          markerWidth={11}
          markerHeight={9}
          refX={9}
          refY={4.5}
          orient="auto"
        >
          <path d="M0,0.5 L9.5,4.5 L0,8.5 Z" fill={color} />
        </marker>
      </defs>
      {/* soft halo so the line reads clearly over the grid */}
      <path d={d} fill="none" stroke={hexA(color, 0.14)} strokeWidth={5} strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke={hexA(color, 0.7)}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 5' : undefined}
        markerEnd={`url(#ah-${id})`}
      />
    </>
  )
}

/** Animated packets traveling along a polyline of waypoints. */
export function FlowPackets({
  points,
  color,
  count = 3,
  dur = 2.2,
  r = 4,
}: {
  points: XY[]
  color: string
  count?: number
  dur?: number
  r?: number
}) {
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  const opacity = points.map((_, i) => (i === 0 || i === points.length - 1 ? 0 : 1))
  const times = points.map((_, i) => i / (points.length - 1))
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={i}
          r={r}
          fill={color}
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
          initial={{ cx: xs[0], cy: ys[0], opacity: 0 }}
          animate={{ cx: xs, cy: ys, opacity }}
          transition={{
            duration: dur,
            delay: (i * dur) / count,
            repeat: Infinity,
            ease: 'linear',
            times,
          }}
        />
      ))}
    </>
  )
}
