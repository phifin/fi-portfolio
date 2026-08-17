/**
 * Regenerate src/components/diagram/siPaths.ts from simple-icons.
 * Usage: node gen-logos.mjs
 */
import * as icons from 'simple-icons'
import fs from 'fs'

/** slug → export key in SI map */
const MAP = {
  react: 'react',
  go: 'go',
  kafka: 'apachekafka',
  temporal: 'temporal',
  postgresql: 'postgresql',
  typescript: 'typescript',
  kubernetes: 'kubernetes',
  redis: 'redis',
  nextjs: 'nextdotjs',
  nestjs: 'nestjs',
  nodejs: 'nodedotjs',
  docker: 'docker',
  mongodb: 'mongodb',
  springboot: 'springboot',
  grafana: 'grafana',
  helm: 'helm',
  tanstack: 'tanstack',
  capacitor: 'capacitor',
  gitlab: 'gitlab',
  googlecloud: 'googlecloud',
  javascript: 'javascript',
  swagger: 'swagger',
  openapi: 'openapiinitiative',
  nginx: 'nginx',
  flux: 'flux',
  githubactions: 'githubactions',
  rancher: 'rancher',
  pwa: 'pwa',
  lighthouse: 'lighthouse',
  jira: 'jira',
  git: 'git',
  github: 'github',
  eventstore: 'eventstore',
  apache: 'apache',
  prometheus: 'prometheus',
  graphql: 'graphql',
  rabbitmq: 'rabbitmq',
  jenkins: 'jenkins',
  atlassian: 'atlassian',
}

const bySlug = Object.fromEntries(Object.values(icons).map((i) => [i.slug, i]))

const out = {}
for (const [key, slug] of Object.entries(MAP)) {
  const ic = bySlug[slug]
  if (!ic) {
    console.warn(`missing slug: ${slug} (${key})`)
    continue
  }
  out[key] = { title: ic.title, hex: ic.hex, path: ic.path }
}

const body = `// AUTO-GENERATED from simple-icons (real brand SVG paths). Do not edit by hand.
// Regenerate: node gen-logos.mjs (simple-icons is a devDependency).
export const SI: Record<string, { title: string; hex: string; path: string }> = ${JSON.stringify(out, null, 2).replace(/"([^"]+)":/g, '"$1":')}
`

fs.writeFileSync('src/components/diagram/siPaths.ts', body)
console.log(`wrote ${Object.keys(out).length} icons → src/components/diagram/siPaths.ts`)
