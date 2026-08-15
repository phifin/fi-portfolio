import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
}

const FORCE_STATIC =
  typeof window !== 'undefined' && window.location.search.includes('static')

/** Fade + rise into view when scrolled to. */
export function Reveal({ children, delay = 0, y = 24, className, once = true }: RevealProps) {
  if (FORCE_STATIC) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
