import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Wrench, Server, LayoutDashboard, Database, Cloud, GitPullRequestArrow,
  Code2, Layers, Webhook, Boxes, MessageSquare, Diamond, Workflow, BarChart3,
  Rocket, FileJson, Zap, Container, Activity, GitPullRequestArrow as GitIcon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { TechGlyph, hasLogo } from '../diagram/techLogos'
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
  Process: { c: '#a78bfa', Icon: GitIcon },
  'System Design': { c: '#f472b6', Icon: Boxes },
}
const catMeta = (en: string) => CAT_META[en] ?? { c: '#4f8cff', Icon: Layers }

function SkillCell({
  name, color, dim, index, reducedMotion,
}: {
  name: string; color: string; dim: boolean; index: number; reducedMotion: boolean
}) {
  return (
    <motion.div
      layout
      initial={reducedMotion ? false : { opacity: 0, scale: 0.88 }}
      animate={{ opacity: dim ? 0.28 : 1, scale: 1 }}
      transition={{ delay: index * 0.025, type: 'spring', stiffness: 380, damping: 26 }}
      whileHover={dim ? undefined : { y: -4, scale: 1.06 }}
      className="group relative flex w-[4.25rem] flex-col items-center justify-center rounded-xl border px-1 py-2 sm:w-[4.75rem]"
      style={{
        borderColor: `${color}30`,
        background: `linear-gradient(160deg, ${color}14, rgba(255,255,255,0.02))`,
      }}
    >
      <div
        className="mb-1.5 flex h-7 w-7 items-center justify-center transition-transform group-hover:scale-110"
      >
        {hasLogo(name) ? (
          <TechGlyph name={name} size={22} />
        ) : (
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold"
            style={{ background: `${color}22`, color }}
          >
            {name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <span className="line-clamp-2 w-full text-center text-[9px] leading-tight text-white/75 sm:text-[10px]">
        {name}
      </span>
      <span
        className="pointer-events-none absolute inset-x-2 bottom-0 h-0.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: color }}
      />
    </motion.div>
  )
}

export function Skills() {
  const { pick } = useLang()
  const [active, setActive] = useState(0)
  const [focusCat, setFocusCat] = useState<string | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(rm.matches)
    rm.addEventListener('change', (e) => setReducedMotion(e.matches))
  }, [])

  const group = skillGroups[active]
  const color = accentHex[group.accent]
  const GroupIcon = groupIcon[group.key] ?? Server

  const bands = useMemo(() => {
    let offset = 0
    return group.categories.map((cat) => {
      const { c, Icon } = catMeta(cat.label.en)
      const band = {
        labelEn: cat.label.en,
        label: pick(cat.label),
        items: cat.items,
        color: c,
        Icon,
        tileStart: offset,
      }
      offset += cat.items.length
      return band
    })
  }, [group.categories, pick])

  return (
    <section id={sectionIds.skills} className="relative flex h-[100svh] flex-col overflow-hidden py-4 sm:py-5">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />

      <div className="container-page relative flex min-h-0 flex-1 flex-col">
        <div className="shrink-0">
          <SectionHeading kicker={pick(ui.skills.kicker)} title={pick(ui.skills.title)} Icon={Wrench} />
        </div>

        {/* centred card — height follows content, never stretched */}
        <div className="flex min-h-0 flex-1 items-center justify-center py-2 sm:py-3">
          <div className="glass relative w-full max-h-full overflow-y-auto rounded-2xl">
            <motion.div
              key={group.key}
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-40"
              style={{ background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${color}28, transparent 70%)` }}
            />

            {/* tabs */}
            <div className="relative border-b border-white/[0.06] px-2 py-2 sm:px-3">
              <div className="flex gap-0.5 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {skillGroups.map((g, i) => {
                  const Icon = groupIcon[g.key] ?? Server
                  const gc = accentHex[g.accent]
                  const on = active === i
                  return (
                    <button
                      key={g.key}
                      onClick={() => { setActive(i); setFocusCat(null) }}
                      className={`relative shrink-0 rounded-lg px-2.5 py-2 sm:px-3 ${on ? 'text-white' : 'text-white/45 hover:text-white/70'}`}
                    >
                      {on && (
                        <motion.span
                          layoutId="skill-tab"
                          className="absolute inset-0 rounded-lg"
                          style={{ background: `${gc}16`, boxShadow: `inset 0 -2px 0 ${gc}` }}
                          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative flex items-center gap-1.5">
                        <Icon size={13} color={on ? gc : 'rgba(255,255,255,0.35)'} strokeWidth={2.2} />
                        <span className="whitespace-nowrap text-xs font-semibold sm:text-sm">{pick(g.title)}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* blurb */}
            <AnimatePresence mode="wait">
              <motion.div
                key={group.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex items-center gap-2.5 border-b border-white/[0.05] px-3 py-2 sm:px-4"
              >
                <GroupIcon size={16} color={color} strokeWidth={2} />
                <p className="text-xs text-white/60 sm:text-sm">{pick(group.blurb)}</p>
              </motion.div>
            </AnimatePresence>

            {/* category bands — each row only as tall as its tiles */}
            <AnimatePresence mode="wait">
              <motion.div
                key={group.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="relative px-2 py-2 sm:px-3 sm:py-3"
              >
                {bands.map((band, bi) => (
                    <motion.div
                      key={band.labelEn}
                      initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: focusCat === null || focusCat === band.labelEn ? 1 : 0.35 }}
                      transition={{ delay: bi * 0.05 }}
                      className="grid grid-cols-1 gap-2 border-b border-white/[0.04] py-2.5 last:border-0 sm:grid-cols-[6.5rem_1fr] sm:items-start sm:gap-x-4 sm:py-3"
                      onMouseEnter={() => setFocusCat(band.labelEn)}
                      onMouseLeave={() => setFocusCat(null)}
                    >
                      <button
                        type="button"
                        onClick={() => setFocusCat(focusCat === band.labelEn ? null : band.labelEn)}
                        className="flex items-center gap-1.5 text-left sm:pt-1"
                      >
                        <band.Icon size={13} color={band.color} strokeWidth={2.2} />
                        <span
                          className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]"
                          style={{ color: band.color }}
                        >
                          {band.label}
                        </span>
                      </button>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {band.items.map((name, si) => (
                            <SkillCell
                              key={name}
                              name={name}
                              color={band.color}
                              dim={focusCat !== null && focusCat !== band.labelEn}
                              index={band.tileStart + si}
                              reducedMotion={reducedMotion}
                            />
                          ))}
                      </div>
                    </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
