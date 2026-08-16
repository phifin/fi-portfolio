import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Reveal } from './Reveal'

type Props = {
  id: string
  kicker: string
  title: string
  body: string
  Icon?: LucideIcon
  children: ReactNode
  /** put the diagram on the left instead of the right */
  flip?: boolean
  /** use a wider 16:10 diagram frame (for horizontal flows like Kafka) */
  wide?: boolean
  legend?: ReactNode
}

/** Shared two-column layout for the architecture deep-dives: prose + live diagram. */
export function DeepDiveLayout({ id, kicker, title, body, Icon, children, flip, wide, legend }: Props) {
  return (
    <section id={id} className="section-pad relative">
      <div className="container-page">
        <div className={`grid items-center gap-10 lg:grid-cols-2 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <Reveal>
            <div className="flex flex-col gap-4">
              <span className="kicker w-fit text-accent-blue">
                {Icon && <Icon size={15} strokeWidth={2.2} />}
                {kicker}
              </span>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
              <p className="max-w-xl text-lg leading-relaxed text-white/70">{body}</p>
              {legend}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div
              className={`relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900/50 ${
                wide ? 'md:aspect-[16/10]' : 'md:aspect-[4/3]'
              }`}
            >
              {children}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
