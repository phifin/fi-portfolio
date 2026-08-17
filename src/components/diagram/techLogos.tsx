/**
 * Real technology brand glyphs.
 * Most paths come from `siPaths.ts` (generated from simple-icons — official brand
 * marks). Brands not in simple-icons are hand-drawn in CUSTOM. Near-black brand
 * colors are lightened so they read on the dark UI.
 */
import type { ReactNode } from 'react'
import { SI } from './siPaths'

type Glyph = { hex: string; node: ReactNode; vb?: string }

// display name / alias → canonical key in SI or CUSTOM
const ALIAS: Record<string, string> = {
  golang: 'go', 'net/http': 'go',
  gin: 'gin', chi: 'chi',
  reactjs: 'react', 'react.js': 'react',
  'next.js': 'nextjs', nextdotjs: 'nextjs',
  'node.js': 'nodejs', nodedotjs: 'nodejs',
  'apache kafka': 'kafka', kafka: 'kafka',
  'tanstack query': 'tanstack', 'react query': 'tanstack',
  'spring boot': 'springboot', spring: 'springboot', nestjs: 'nestjs',
  'google cloud': 'googlecloud', gcp: 'googlecloud',
  postgres: 'postgresql', postgresql: 'postgresql',
  k8s: 'kubernetes', docker: 'docker', helm: 'helm',
  javascript: 'javascript', js: 'javascript',
  typescript: 'typescript', ts: 'typescript',
  rest: 'swagger',
  grpc: 'grpc',
  'api gateway': 'nginx',
  microservices: 'microservices',
  'event-driven': 'eventstore',
  outbox: 'outbox',
  'debezium cdc': 'debezium', debezium: 'debezium',
  'temporal / saga': 'temporal', saga: 'temporal',
  zustand: 'zustand',
  recharts: 'recharts',
  apexcharts: 'apexcharts',
  pwa: 'pwa', capacitor: 'capacitor',
  performance: 'lighthouse',
  gitops: 'flux', 'ci/cd': 'githubactions', cicd: 'githubactions',
  rancher: 'rancher',
  'grafana loki': 'grafana', loki: 'grafana',
  'aws s3': 'awss3', s3: 'awss3',
  agile: 'jira',
  'code review': 'github',
  'multi-tenant architecture': 'multitenant', 'multi-tenant': 'multitenant',
  'openapi': 'openapi',
}

// hand-drawn marks for brands not in simple-icons (minimal + recognizable)
const CUSTOM: Record<string, Glyph> = {
  java: {
    hex: '#5382A1',
    vb: '0 0 24 24',
    node: (
      <>
        <g fill="none" stroke="#E76F00" strokeWidth={1.6} strokeLinecap="round">
          <path d="M9 2.4c-1.5 1.6 .8 2.5 0 4.1" />
          <path d="M12.4 1.6c-1.7 1.9 .9 2.9 0 4.9" />
        </g>
        <g fill="#5382A1">
          <path d="M5.2 10.5h11v3.2a4.2 4.2 0 0 1-4.2 4.2H9.4a4.2 4.2 0 0 1-4.2-4.2z" />
          <path d="M16.4 11h1.3a2.3 2.3 0 0 1 0 4.6h-1.1a5.6 5.6 0 0 0 .5-2.3z" />
          <rect x="4.2" y="19.4" width="13" height="2" rx="1" />
        </g>
      </>
    ),
  },
  grpc: {
    hex: '#5CCFE6',
    vb: '0 0 24 24',
    node: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#244C5A" />
        <path d="M7 8.5h3.2v2.2H9.1v5.1H7V8.5zm5.1 0h1.9l2.4 3.6V8.5H17v7.3h-1.8l-2.5-3.8v3.8h-1.6V8.5z" fill="#fff" />
      </>
    ),
  },
  gin: {
    hex: '#009688',
    vb: '0 0 24 24',
    node: (
      <>
        <path d="M8 4h8l-1.2 14H9.2L8 4z" fill="#009688" opacity=".25" />
        <path d="M9 4h6v2.5c0 2.2-1.3 4.1-3 5v6.5H12v-6.5c-1.7-.9-3-2.8-3-5V4z" fill="#009688" />
        <ellipse cx="12" cy="19.5" rx="5" ry="1.2" fill="#009688" opacity=".55" />
        <path d="M10.5 3.5h3v1h-3z" fill="#80CBC4" />
      </>
    ),
  },
  chi: {
    hex: '#00ADD8',
    vb: '0 0 24 24',
    node: (
      <text x="12" y="17" textAnchor="middle" fontSize="15" fontWeight="700" fill="#00ADD8" fontFamily="serif">χ</text>
    ),
  },
  debezium: {
    hex: '#F05A28',
    vb: '0 0 24 24',
    node: (
      <>
        <ellipse cx="12" cy="14" rx="7" ry="3" fill="none" stroke="#F05A28" strokeWidth="1.4" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="#F05A28" strokeWidth="1.6" />
        <path d="M5 14c2 2 4.5 3 7 3s5-1 7-3" fill="none" stroke="#F05A28" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="12" cy="7" r="1.2" fill="#F05A28" />
      </>
    ),
  },
  zustand: {
    hex: '#443F33',
    vb: '0 0 24 24',
    node: (
      <>
        <circle cx="9" cy="10" r="2.2" fill="#443F33" />
        <circle cx="15" cy="10" r="2.2" fill="#443F33" />
        <ellipse cx="12" cy="13.5" rx="5.5" ry="4.5" fill="#443F33" />
        <circle cx="10" cy="12.5" r=".7" fill="#E8DCC8" />
        <circle cx="14" cy="12.5" r=".7" fill="#E8DCC8" />
        <ellipse cx="12" cy="14.8" rx="1.2" ry=".7" fill="#C4A882" />
      </>
    ),
  },
  recharts: {
    hex: '#007AFF',
    vb: '0 0 24 24',
    node: (
      <>
        <path d="M4 18V6" stroke="#007AFF" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M4 18h16" stroke="#007AFF" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7 15l4-4 3 2.5 5-6" fill="none" stroke="#007AFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  apexcharts: {
    hex: '#008FFB',
    vb: '0 0 24 24',
    node: (
      <>
        <path d="M4 18h16" stroke="#008FFB" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 16V9l4 4 3-5 5 8" fill="none" stroke="#008FFB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 6l2 2-2 2" fill="none" stroke="#008FFB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  awss3: {
    hex: '#FF9900',
    vb: '0 0 24 24',
    node: (
      <>
        <path d="M12 4C7.5 4 4 5.2 4 6.7v10.6C4 18.8 7.5 20 12 20s8-1.2 8-2.7V6.7C20 5.2 16.5 4 12 4z" fill="none" stroke="#FF9900" strokeWidth="1.5" />
        <path d="M4 6.7c0 1.5 3.5 2.7 8 2.7s8-1.2 8-2.7" fill="none" stroke="#FF9900" strokeWidth="1.5" />
        <path d="M4 12c0 1.5 3.5 2.7 8 2.7s8-1.2 8-2.7" fill="none" stroke="#FF9900" strokeWidth="1.5" />
      </>
    ),
  },
  microservices: {
    hex: '#4f8cff',
    vb: '0 0 24 24',
    node: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#4f8cff" opacity=".85" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#4f8cff" opacity=".65" />
        <rect x="8.5" y="14" width="7" height="7" rx="1.5" fill="#4f8cff" opacity=".75" />
        <path d="M10 6.5h4M12 10v4M6.5 10h2M15.5 10h2" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".7" />
      </>
    ),
  },
  outbox: {
    hex: '#fbbf24',
    vb: '0 0 24 24',
    node: (
      <>
        <rect x="4" y="9" width="16" height="10" rx="1.5" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        <path d="M4 11l8 5 8-5" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 5v5M9.5 7.5L12 5l2.5 2.5" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  multitenant: {
    hex: '#a78bfa',
    vb: '0 0 24 24',
    node: (
      <>
        <rect x="5" y="12" width="14" height="8" rx="1" fill="#a78bfa" opacity=".35" stroke="#a78bfa" strokeWidth="1.2" />
        <rect x="7" y="8" width="10" height="6" rx="1" fill="#a78bfa" opacity=".55" stroke="#a78bfa" strokeWidth="1.2" />
        <rect x="9" y="4" width="6" height="5" rx="1" fill="#a78bfa" opacity=".85" stroke="#a78bfa" strokeWidth="1.2" />
      </>
    ),
  },
}

function isDark(hex: string) {
  const n = parseInt(hex, 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b < 46
}

function norm(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, ' ')
}

function resolve(name: string): Glyph | null {
  const key = ALIAS[norm(name)] ?? norm(name)
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
