/**
 * Real technology brand glyphs.
 * Most paths come from `siPaths.ts` (generated from simple-icons — official brand
 * marks). A few not in simple-icons (Java) are hand-drawn here. Near-black brand
 * colors are lightened so they read on the dark UI.
 */
import type { ReactNode } from 'react'
import { SI } from './siPaths'

type Glyph = { hex: string; node: ReactNode; vb?: string }

// alias table → canonical key in SI / CUSTOM
const ALIAS: Record<string, string> = {
  golang: 'go', 'go (net/http, gin, chi)': 'go',
  reactjs: 'react', 'react.js': 'react',
  'next.js': 'nextjs', nextdotjs: 'nextjs',
  'node.js': 'nodejs', nodedotjs: 'nodejs',
  'apache kafka': 'kafka',
  'tanstack query': 'tanstack', 'react query': 'tanstack',
  'spring boot': 'springboot', spring: 'springboot',
  'google cloud': 'googlecloud', gcp: 'googlecloud',
  postgres: 'postgresql',
  k8s: 'kubernetes',
}

// hand-drawn marks for brands not in simple-icons (kept minimal + recognizable)
const CUSTOM: Record<string, Glyph> = {
  java: {
    hex: '#5382A1',
    vb: '0 0 24 24',
    node: (
      <>
        {/* steam */}
        <g fill="none" stroke="#E76F00" strokeWidth={1.6} strokeLinecap="round">
          <path d="M9 2.4c-1.5 1.6 .8 2.5 0 4.1" />
          <path d="M12.4 1.6c-1.7 1.9 .9 2.9 0 4.9" />
        </g>
        {/* cup + saucer + handle */}
        <g fill="#5382A1">
          <path d="M5.2 10.5h11v3.2a4.2 4.2 0 0 1-4.2 4.2H9.4a4.2 4.2 0 0 1-4.2-4.2z" />
          <path d="M16.4 11h1.3a2.3 2.3 0 0 1 0 4.6h-1.1a5.6 5.6 0 0 0 .5-2.3z" />
          <rect x="4.2" y="19.4" width="13" height="2" rx="1" />
        </g>
      </>
    ),
  },
}

function isDark(hex: string) {
  const n = parseInt(hex, 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b < 46
}

function resolve(name: string): Glyph | null {
  const key = ALIAS[name.toLowerCase().trim()] ?? name.toLowerCase().trim()
  if (CUSTOM[key]) return CUSTOM[key]
  const ic = SI[key]
  if (!ic) return null
  const hex = isDark(ic.hex) ? '#e8eefc' : `#${ic.hex}`
  return { hex, node: <path d={ic.path} fill={hex} />, vb: '0 0 24 24' }
}

export function hasLogo(name: string) {
  return resolve(name) !== null
}

export function logoHex(name: string): string | null {
  return resolve(name)?.hex ?? null
}

/** Brand glyph as a self-contained <svg>. Works both in HTML and nested in a diagram <svg> (pass x/y). */
export function TechGlyph({ name, size = 20, x, y }: { name: string; size?: number; x?: number; y?: number }) {
  const g = resolve(name)
  if (!g) return null
  return (
    <svg x={x} y={y} width={size} height={size} viewBox={g.vb ?? '0 0 24 24'} style={{ overflow: 'visible' }}>
      {g.node}
    </svg>
  )
}
