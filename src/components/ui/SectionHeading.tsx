import type { LucideIcon } from 'lucide-react'
import { Reveal } from './Reveal'

type Props = {
  kicker: string
  title: string
  Icon?: LucideIcon
  align?: 'left' | 'center'
}

export function SectionHeading({ kicker, title, Icon, align = 'left' }: Props) {
  return (
    <Reveal className={align === 'center' ? 'text-center' : ''}>
      <div className={`flex flex-col gap-3 ${align === 'center' ? 'items-center' : 'items-start'}`}>
        <span className="chip font-mono uppercase tracking-[0.2em] text-accent-cyan">
          {Icon ? (
            <Icon size={13} className="text-accent-cyan" strokeWidth={2.4} />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-glow" />
          )}
          {kicker}
        </span>
        <h2 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </div>
    </Reveal>
  )
}
