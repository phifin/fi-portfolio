import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Wrench, Server, LayoutDashboard, Database, Cloud, GitPullRequestArrow,
  Code2, Layers, Webhook, Boxes, Rocket,
  GitPullRequestArrow as GitIcon,
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
  dataops: Database,
  practices: GitPullRequestArrow,
}

const CAT_META: Record<string, { c: string; Icon: LucideIcon }> = {
  Language: { c: '#22d3ee', Icon: Code2 },
  Frameworks: { c: '#34d399', Icon: Layers },
  Framework: { c: '#34d399', Icon: Layers },
  'Service Communication': { c: '#a78bfa', Icon: Webhook },
  'Architecture & Patterns': { c: '#4f8cff', Icon: Boxes },
  'UI Stack': { c: '#34d399', Icon: LayoutDashboard },
  Delivery: { c: '#818cf8', Icon: Rocket },
  'Data Stores': { c: '#38bdf8', Icon: Database },
  'Containers & Orchestration': { c: '#22d3ee', Icon: Boxes },
  'CI/CD & Observability': { c: '#818cf8', Icon: Cloud },
  'Ways of Working': { c: '#a78bfa', Icon: GitIcon },
  'Cross-cutting': { c: '#4f8cff', Icon: Layers },
}
const catMeta = (en: string) => CAT_META[en] ?? { c: '#4f8cff', Icon: Layers }

/** Shorter stack names for laptop / small-desktop tab bar */
const TAB_SHORT: Record<string, { en: string; vi: string }> = {
  dataops: { en: 'Data & Ops', vi: 'Data & Ops' },
}

/** Shorter category labels when the sidebar is tight */
const CAT_SHORT: Record<string, { en: string; vi: string }> = {
  'Service Communication': { en: 'Communication', vi: 'Giao tiếp' },
  'Architecture & Patterns': { en: 'Arch & Patterns', vi: 'KT & Pattern' },
  'Containers & Orchestration': { en: 'Containers', vi: 'Container' },
  'CI/CD & Observability': { en: 'CI/CD & Obs', vi: 'CI/CD & Obs' },
  'Ways of Working': { en: 'Process', vi: 'Quy trình' },
}

function useSkillsLayout() {
  const [layout, setLayout] = useState({ compactTabs: false, compactLabels: false, wide: false })

  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth
      setLayout({
        compactTabs: w >= 640 && w < 1400,
        compactLabels: w >= 640 && w < 1280,
        wide: w >= 1536,
      })
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return layout
}

function SkillCell({
  name, color, dim, index, reducedMotion, wide,
}: {
  name: string; color: string; dim: boolean; index: number; reducedMotion: boolean; wide: boolean
}) {
  return (
    <motion.div
      layout
      initial={reducedMotion ? false : { opacity: 0, scale: 0.88 }}
      animate={{ opacity: dim ? 0.28 : 1, scale: 1 }}
      transition={{ delay: index * 0.025, type: 'spring', stiffness: 380, damping: 26 }}
      whileHover={dim ? undefined : { y: -4, scale: 1.06 }}
      className={`group relative flex flex-col items-center justify-center rounded-xl border px-1 py-2 ${
        wide ? 'w-[5.5rem]' : 'w-[4.25rem] sm:w-[4.75rem] xl:w-[5.25rem]'
      }`}
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
  const { compactTabs, compactLabels, wide } = useSkillsLayout()
  const [active, setActive] = useState(0)
  const [focusCat, setFocusCat] = useState<string | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  const tabTitle = (key: string, title: { en: string; vi: string }) =>
    compactTabs ? pick(TAB_SHORT[key] ?? title) : pick(title)

  const catLabel = (labelEn: string, label: { en: string; vi: string }) =>
    compactLabels ? pick(CAT_SHORT[labelEn] ?? label) : pick(label)

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
        labelBi: cat.label,
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
    <section id={sectionIds.skills} className="relative flex min-h-[100svh] flex-col py-4 sm:py-5 xl:py-7">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />

      <div className="container-page relative flex min-h-0 flex-1 flex-col xl:max-w-6xl 2xl:max-w-7xl min-[1920px]:max-w-[88rem] min-[2560px]:max-w-[100rem]">
        <div className="shrink-0">
          <SectionHeading kicker={pick(ui.skills.kicker)} title={pick(ui.skills.title)} Icon={Wrench} />
        </div>

        <div className="flex flex-1 items-start justify-center py-2 sm:py-3 xl:py-5">
          <div className="glass relative w-full overflow-visible rounded-2xl xl:rounded-3xl">
            <motion.div
              key={group.key}
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-40"
              style={{ background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${color}28, transparent 70%)` }}
            />

            {/* tabs — even distribution on sm+ desktop; short labels on laptop */}
            <div className="relative border-b border-white/[0.06] px-3 py-2.5 sm:px-4 sm:py-3 xl:px-8 xl:py-4">
              <div className="flex gap-1 overflow-x-auto sm:gap-1.5 sm:overflow-visible lg:gap-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {skillGroups.map((g, i) => {
                  const Icon = groupIcon[g.key] ?? Server
                  const gc = accentHex[g.accent]
                  const on = active === i
                  return (
                    <button
                      key={g.key}
                      onClick={() => { setActive(i); setFocusCat(null) }}
                      className={`relative shrink-0 rounded-lg px-2.5 py-2 sm:flex-1 sm:min-w-0 sm:px-3 xl:px-4 xl:py-2.5 ${
                        on ? 'text-white' : 'text-white/45 hover:text-white/70'
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="skill-tab"
                          className="absolute inset-0 rounded-lg"
                          style={{ background: `${gc}16`, boxShadow: `inset 0 -2px 0 ${gc}` }}
                          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative flex items-center justify-center gap-1.5 sm:gap-2">
                        <Icon size={13} color={on ? gc : 'rgba(255,255,255,0.35)'} strokeWidth={2.2} className="shrink-0" />
                        <span className="whitespace-nowrap text-xs font-semibold sm:truncate sm:text-sm xl:text-[0.9375rem]">
                          {tabTitle(g.key, g.title)}
                        </span>
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
                className="relative flex items-center gap-2.5 border-b border-white/[0.05] px-4 py-2.5 sm:px-5 xl:px-8 xl:py-3.5"
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
                className="relative flex min-h-[15rem] flex-col justify-center px-3 py-2.5 sm:min-h-[16rem] sm:px-5 sm:py-3 xl:min-h-[19rem] xl:px-8 xl:py-5 2xl:px-10 2xl:py-6"
              >
                {bands.map((band, bi) => (
                    <motion.div
                      key={band.labelEn}
                      initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: focusCat === null || focusCat === band.labelEn ? 1 : 0.35 }}
                      transition={{ delay: bi * 0.05 }}
                      className="grid grid-cols-1 gap-2 border-b border-white/[0.04] py-2.5 last:border-0 sm:grid-cols-[minmax(8.75rem,auto)_1fr] sm:items-start sm:gap-x-5 sm:py-3 lg:grid-cols-[9.25rem_1fr] lg:gap-x-6 xl:grid-cols-[10rem_1fr] xl:gap-x-8 xl:py-3.5 2xl:grid-cols-[10.5rem_1fr] 2xl:gap-x-10"
                      onMouseEnter={() => setFocusCat(band.labelEn)}
                      onMouseLeave={() => setFocusCat(null)}
                    >
                      <button
                        type="button"
                        onClick={() => setFocusCat(focusCat === band.labelEn ? null : band.labelEn)}
                        className="flex shrink-0 items-center gap-1.5 text-left sm:pt-1"
                      >
                        <band.Icon size={13} color={band.color} strokeWidth={2.2} className="shrink-0" />
                        <span
                          className="whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.1em] lg:text-[11px] lg:tracking-[0.12em]"
                          style={{ color: band.color }}
                        >
                          {catLabel(band.labelEn, band.labelBi)}
                        </span>
                      </button>
                      <div className="flex flex-wrap gap-2 sm:gap-2.5 xl:gap-3 2xl:gap-4">
                        {band.items.map((name, si) => (
                            <SkillCell
                              key={name}
                              name={name}
                              color={band.color}
                              dim={focusCat !== null && focusCat !== band.labelEn}
                              index={band.tileStart + si}
                              reducedMotion={reducedMotion}
                              wide={wide}
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
