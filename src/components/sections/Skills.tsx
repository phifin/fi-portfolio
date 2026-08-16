import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench, Server, LayoutDashboard, Database, Cloud, GitPullRequestArrow,
  Code2, Layers, Webhook, Boxes, MessageSquare, Diamond, Workflow, BarChart3,
  Rocket, Zap, Container, Activity, FileJson, Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { TechGlyph, hasLogo } from '../diagram/techLogos'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { skillGroups, sectionIds } from '../../data/content'
import type { SkillGroup } from '../../data/content'

const accentHex: Record<string, string> = { cyan: '#2dd4ff', blue: '#4f8cff', sky: '#60a5fa' }
const groupIcon: Record<string, LucideIcon> = {
  backend: Server,
  frontend: LayoutDashboard,
  data: Database,
  devops: Cloud,
  practices: GitPullRequestArrow,
}

// each sub-category gets its own colour + icon (keyed by the English label)
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

const totalItems = (g: SkillGroup) => g.categories.reduce((n, c) => n + c.items.length, 0)

const SOFT: { c: string; Icon: LucideIcon; title: { en: string; vi: string }; desc: { en: string; vi: string } }[] = [
  { c: '#818cf8', Icon: Rocket, title: { en: 'Always Learning', vi: 'Luôn học hỏi' }, desc: { en: 'Exploring new technologies and best practices', vi: 'Khám phá công nghệ mới và best practice' } },
  { c: '#fbbf24', Icon: Zap, title: { en: 'Problem Solver', vi: 'Giải quyết vấn đề' }, desc: { en: 'Building solutions to complex, real-world problems', vi: 'Xây giải pháp cho bài toán thực tế phức tạp' } },
  { c: '#34d399', Icon: Code2, title: { en: 'Clean Code', vi: 'Code sạch' }, desc: { en: 'Writing maintainable and scalable code', vi: 'Viết code dễ bảo trì và mở rộng' } },
  { c: '#f472b6', Icon: Users, title: { en: 'Team Player', vi: 'Làm việc nhóm' }, desc: { en: 'Collaborating and sharing knowledge', vi: 'Cộng tác và chia sẻ kiến thức' } },
]

function Chip({ name, color }: { name: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-[13px] font-medium text-white/85">
      {hasLogo(name) ? (
        <TechGlyph name={name} size={14} />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      )}
      {name}
    </span>
  )
}

/** One colour-coded sub-category card. */
function CatCard({ labelEn, label, items, i }: { labelEn: string; label: string; items: string[]; i: number }) {
  const { c, Icon } = catMeta(labelEn)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: i * 0.05 }}
      className="relative overflow-hidden rounded-2xl border p-4"
      style={{ borderColor: `${c}30`, background: `linear-gradient(155deg, ${c}12, rgba(255,255,255,0.015) 55%)` }}
    >
      {/* faint corner watermark */}
      <Icon className="pointer-events-none absolute -right-3 -top-3" size={78} color={c} style={{ opacity: 0.06 }} strokeWidth={1.5} />
      <div className="relative mb-3 flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `linear-gradient(145deg, ${c}3d, ${c}12)`, border: `1px solid ${c}55`, boxShadow: `inset 0 1px 0 ${c}30` }}
        >
          <Icon size={20} color={c} strokeWidth={2} />
        </span>
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: c }}>{label}</span>
      </div>
      <div className="relative flex flex-wrap gap-2">
        {items.map((s) => (
          <Chip key={s} name={s} color={c} />
        ))}
      </div>
    </motion.div>
  )
}

export function Skills() {
  const { pick } = useLang()
  const [active, setActive] = useState(0)
  const group = skillGroups[active]
  const color = accentHex[group.accent]
  const GroupIcon = groupIcon[group.key] ?? Server

  return (
    <section id={sectionIds.skills} className="section-pad relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-page relative">
        <div className="relative">
          <SectionHeading kicker={pick(ui.skills.kicker)} title={pick(ui.skills.title)} Icon={Wrench} />
          <p className="mt-3 text-base text-white/50">{pick(ui.skills.sub)}</p>
          {/* decorative isometric cube */}
          <CubeGlyph className="pointer-events-none absolute -top-4 right-0 hidden h-28 w-44 opacity-80 lg:block" />
        </div>

        <div className="mt-8 flex flex-col gap-5">
          {/* layer tabs */}
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
                    <span className="font-mono text-xs" style={{ color: on ? gc : 'rgba(255,255,255,0.3)' }}>{String(totalItems(g)).padStart(2, '0')}</span>
                  </button>
                )
              })}
            </div>
          </Reveal>

          {/* the active layer, broken into colour-coded sub-categories */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="glass relative overflow-hidden rounded-3xl p-4 sm:p-6">
              <div
                className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl transition-colors duration-500"
                style={{ background: color }}
              />
              {/* panel header */}
              <div className="relative mb-5 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `linear-gradient(145deg, ${color}33, ${color}0f)`, border: `1px solid ${color}55` }}>
                    <GroupIcon size={20} color={color} strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{pick(group.title)}</h3>
                    <p className="mt-0.5 max-w-xl text-sm text-white/50">{pick(group.blurb)}</p>
                  </div>
                </div>
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                  {totalItems(group)} {pick({ en: 'Skills', vi: 'Kỹ năng' })}
                </span>
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={group.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    {group.categories.map((cat, i) => (
                      <CatCard key={cat.label.en} labelEn={cat.label.en} label={pick(cat.label)} items={cat.items} i={i} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          {/* soft skills strip */}
          <Reveal delay={0.15} className="min-w-0">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-3xl border border-white/[0.06] bg-white/[0.015] p-5 sm:grid-cols-4 sm:p-6">
              {SOFT.map((s) => (
                <div key={s.title.en} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${s.c}18`, border: `1px solid ${s.c}44` }}>
                    <s.Icon size={18} color={s.c} strokeWidth={2} />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white/90">{pick(s.title)}</div>
                    <div className="mt-0.5 text-xs leading-snug text-white/45">{pick(s.desc)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** A small wireframe isometric cube with a soft glow — pure decoration. */
function CubeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 130" className={className} aria-hidden>
      <defs>
        <linearGradient id="cube-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="95" rx="72" ry="16" fill="none" stroke="#4f8cff" strokeOpacity="0.25" strokeWidth="1" />
      <ellipse cx="120" cy="95" rx="46" ry="10" fill="none" stroke="#22d3ee" strokeOpacity="0.2" strokeWidth="1" />
      <g fill="none" stroke="url(#cube-g)" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M120 30 L160 52 L160 92 L120 114 L80 92 L80 52 Z" opacity="0.9" />
        <path d="M120 30 L120 72 M120 72 L160 52 M120 72 L80 52" opacity="0.7" />
        <path d="M120 72 L120 114" opacity="0.4" />
      </g>
      <path d="M120 30 L160 52 L120 72 L80 52 Z" fill="url(#cube-g)" fillOpacity="0.14" />
      {[[120, 30], [160, 52], [80, 52], [120, 72]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="#8ff0ff" style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
      ))}
    </svg>
  )
}
