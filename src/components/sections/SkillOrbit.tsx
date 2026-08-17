import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Code2, Layers, Webhook, Boxes, MessageSquare, Diamond, Workflow, BarChart3,
  Rocket, Database, FileJson, Zap, Container, Activity, Cloud, GitPullRequestArrow,
} from 'lucide-react'
import { TechGlyph, hasLogo } from '../diagram/techLogos'
import type { SkillGroup } from '../../data/content'

const CAT_META: Record<string, { c: string; Icon: LucideIcon }> = {
  Language: { c: '#22d3ee', Icon: Code2 },
  Frameworks: { c: '#34d399', Icon: Layers },
  Framework: { c: '#34d399', Icon: Layers },
  'API & RPC': { c: '#a78bfa', Icon: Webhook },
  Architecture: { c: '#4f8cff', Icon: Boxes },
  Messaging: { c: '#fbbf24', Icon: MessageSquare },
  Patterns: { c: '#f472b6', Icon: Diamond },
  'State & Data': { c: '#38bdf8', Icon: Workflow },
  Visualization: { c: '#2dd4ff', Icon: BarChart3 },
  Delivery: { c: '#818cf8', Icon: Rocket },
  Relational: { c: '#38bdf8', Icon: Database },
  Document: { c: '#34d399', Icon: FileJson },
  'Cache & KV': { c: '#fb7185', Icon: Zap },
  Containers: { c: '#4f8cff', Icon: Container },
  Observability: { c: '#fbbf24', Icon: Activity },
  Cloud: { c: '#22d3ee', Icon: Cloud },
  Process: { c: '#a78bfa', Icon: GitPullRequestArrow },
  'System Design': { c: '#f472b6', Icon: Boxes },
}
const catMeta = (labelEn: string) => CAT_META[labelEn] ?? { c: '#4f8cff', Icon: Layers }

type Props = {
  group: SkillGroup
  groupColor: string
  GroupIcon: LucideIcon
  groupTitle: string
  activeCat: number | null
  onCatChange: (i: number | null) => void
  compact: boolean
  reducedMotion: boolean
  pick: <T extends { en: string; vi: string }>(v: T) => string
}

export function SkillOrbit({
  group, groupColor, GroupIcon, groupTitle, activeCat, onCatChange, compact, reducedMotion, pick,
}: Props) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(compact ? 220 : 300)

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const tiltX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), { stiffness: 140, damping: 22 })
  const tiltY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), { stiffness: 140, damping: 22 })

  useEffect(() => {
    const el = sceneRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width
      setSize(Math.min(compact ? 240 : 360, Math.max(compact ? 180 : 240, w * (compact ? 0.82 : 0.72))))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [compact])

  const nodes = useMemo(() => {
    const n = group.categories.length
    const rx = size * 0.44
    const ry = size * 0.28
    return group.categories.map((cat, i) => {
      const a = (-Math.PI / 2) + ((2 * Math.PI) / n) * i
      const { c, Icon } = catMeta(cat.label.en)
      return {
        ...cat,
        color: c,
        Icon,
        x: Math.cos(a) * rx,
        y: Math.sin(a) * ry,
      }
    })
  }, [group.categories, size])

  const onMove = (e: React.PointerEvent) => {
    if (compact || reducedMotion) return
    const el = sceneRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  const resetTilt = () => { px.set(0); py.set(0) }

  const ringRx = size * 0.44
  const ringRy = size * 0.28

  return (
    <div ref={sceneRef} className="relative mx-auto w-full max-w-[520px]" style={{ height: size + (compact ? 8 : 16) }}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: 900, transformStyle: 'preserve-3d' }}
        onPointerMove={onMove}
        onPointerLeave={resetTilt}
      >
        <motion.div
          style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
          className="relative"
        >
          {/* orbit rings + spokes */}
          <svg
            className="pointer-events-none absolute left-1/2 top-1/2 overflow-visible"
            width={size}
            height={size}
            style={{ transform: 'translate(-50%, -50%)' }}
            aria-hidden
          >
            {nodes.map((node, i) => (
              <line
                key={`spoke-${i}`}
                x1={size / 2}
                y1={size / 2}
                x2={size / 2 + node.x}
                y2={size / 2 + node.y}
                stroke={activeCat === i ? node.color : 'rgba(255,255,255,0.06)'}
                strokeWidth={activeCat === i ? 1.2 : 0.8}
                strokeOpacity={activeCat === i ? 0.55 : 1}
              />
            ))}
          </svg>

          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-white/[0.08]"
            style={{ width: ringRx * 2, height: ringRy * 2, x: '-50%', y: '-50%' }}
            animate={reducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/[0.05]"
            style={{ width: ringRx * 1.55, height: ringRy * 1.55, x: '-50%', y: '-50%' }}
            animate={reducedMotion ? undefined : { rotate: -360 }}
            transition={{ duration: 64, repeat: Infinity, ease: 'linear' }}
          />

          {/* soft glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ width: size * 0.55, height: size * 0.55, background: `${groupColor}22` }}
          />

          {/* category nodes */}
          <AnimatePresence mode="popLayout">
            {nodes.map((node, i) => {
              const on = activeCat === i
              const dim = activeCat !== null && !on
              return (
                <motion.button
                  key={`${group.key}-${node.label.en}`}
                  type="button"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: dim ? 0.45 : 1, scale: on ? 1.08 : 1, x: node.x, y: node.y }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22, delay: i * 0.04 }}
                  onClick={() => onCatChange(on ? null : i)}
                  onMouseEnter={() => !compact && onCatChange(i)}
                  onMouseLeave={() => !compact && onCatChange(null)}
                  className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ willChange: 'transform' }}
                  aria-pressed={on}
                >
                  <span
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[11px] font-medium backdrop-blur-sm transition-shadow sm:px-3 sm:text-xs"
                    style={{
                      borderColor: on ? node.color : `${node.color}44`,
                      background: on ? `${node.color}24` : 'rgba(8,10,20,0.72)',
                      boxShadow: on ? `0 0 24px -6px ${node.color}` : 'none',
                      color: on ? '#fff' : 'rgba(255,255,255,0.78)',
                    }}
                  >
                    <node.Icon size={compact ? 12 : 14} color={node.color} strokeWidth={2.2} />
                    <span className="hidden min-[420px]:inline">{pick(node.label)}</span>
                  </span>
                </motion.button>
              )
            })}
          </AnimatePresence>

          {/* core hub */}
          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              key={group.key}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className="relative flex flex-col items-center"
            >
              <div
                className="flex items-center justify-center rounded-2xl border backdrop-blur-md"
                style={{
                  width: compact ? 68 : 84,
                  height: compact ? 68 : 84,
                  borderColor: `${groupColor}66`,
                  background: `linear-gradient(145deg, ${groupColor}30, rgba(255,255,255,0.04))`,
                  boxShadow: `0 0 40px -12px ${groupColor}, inset 0 1px 0 ${groupColor}40`,
                }}
              >
                <GroupIcon size={compact ? 26 : 32} color={groupColor} strokeWidth={2} />
              </div>
              <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/50 sm:text-[11px]">
                {groupTitle}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/** Compact inline skill chips for the detail strip. */
export function SkillPills({ items, color, highlight }: { items: string[]; color: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-1 ${highlight ? '' : ''}`}>
      {items.map((name) => (
        <span
          key={name}
          className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium sm:text-xs"
          style={{
            borderColor: highlight ? `${color}55` : 'rgba(255,255,255,0.08)',
            background: highlight ? `${color}14` : 'rgba(255,255,255,0.03)',
            color: highlight ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.72)',
          }}
        >
          {hasLogo(name) && <TechGlyph name={name} size={11} />}
          {name}
        </span>
      ))}
    </div>
  )
}
