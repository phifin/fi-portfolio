/**
 * Brand-styled SVG wordmarks for the e-invoice providers we integrate with.
 * Rendered as vector text in each brand's real palette (FPT tri-colour,
 * Viettel / MISA red, M-Invoice teal). Swap for official SVG paths anytime.
 */

const FONT = "'Sora', system-ui, sans-serif"

export const PROVIDER_META: Record<string, { edge: string; glow: string }> = {
  FPT: { edge: '#f37021', glow: '#f37021' },
  MISA: { edge: '#f43f5e', glow: '#e31e24' },
  Viettel: { edge: '#fb7185', glow: '#ee0033' },
  'M-Invoice': { edge: '#2dd4ff', glow: '#14b8a6' },
}

/** Draws a provider wordmark centred at (cx, cy). */
export function ProviderLogo({ name, cx, cy, size = 19 }: { name: string; cx: number; cy: number; size?: number }) {
  const common = {
    x: cx,
    y: cy,
    textAnchor: 'middle' as const,
    dominantBaseline: 'central' as const,
    fontFamily: FONT,
  }
  switch (name) {
    case 'FPT':
      return (
        <text {...common} fontSize={size} fontWeight={900} fontStyle="italic" letterSpacing={1}>
          <tspan fill="#2f7fd1">F</tspan>
          <tspan fill="#51b848">P</tspan>
          <tspan fill="#f37021">T</tspan>
        </text>
      )
    case 'MISA':
      return (
        <text {...common} fontSize={size} fontWeight={800} letterSpacing={0.5} fill="#f0353c">
          MISA
        </text>
      )
    case 'Viettel':
      return (
        <text {...common} fontSize={size * 0.92} fontWeight={700} letterSpacing={-0.6} fill="#ff2d55">
          viettel
        </text>
      )
    case 'M-Invoice':
      return (
        <text {...common} fontSize={size * 0.86} fontWeight={800} letterSpacing={-0.2}>
          <tspan fill="#2dd4ff" fontWeight={900}>M</tspan>
          <tspan fill="#7fe9dd">·invoice</tspan>
        </text>
      )
    default:
      return null
  }
}
