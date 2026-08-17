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
        <span className="kicker text-accent-cyan">
          {Icon && <Icon size={15} strokeWidth={2.2} />}
          {kicker}
        </span>
        <h2 className="max-w-3xl text-[1.75rem] font-bold leading-tight sm:text-4xl 2xl:text-5xl">
          {title}
        </h2>
      </div>
    </Reveal>
  )
}
