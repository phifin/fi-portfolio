import type { LucideIcon } from 'lucide-react'

type Item = { Icon: LucideIcon; label: string; color: string }

/** Legend for architecture diagrams — icon chips instead of bare colored dots. */
export function DiagramLegend({ items }: { items: Item[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map(({ Icon, label, color }) => (
        <span
          key={label}
          className="i-tile group inline-flex cursor-default items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/75"
        >
          <span
            className="flex h-5 w-5 items-center justify-center rounded-md transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${color}22`, border: `1px solid ${color}66` }}
          >
            <Icon size={12} color={color} strokeWidth={2.2} />
          </span>
          {label}
        </span>
      ))}
    </div>
  )
}
