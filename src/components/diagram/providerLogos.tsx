/**
 * E-invoice PRODUCT logos (not the parent corporations):
 *   FPT.eInvoice · meInvoice (MISA) · SInvoice (Viettel) · M-invoice
 * Left-aligned icon + wordmark lockups drawn in each product's real palette;
 * meInvoice uses its real icon SVG. Rendered inside the diagram <svg>.
 */

const FONT = "'Sora', system-ui, sans-serif"

export const PROVIDER_META: Record<string, { edge: string; glow: string; sub: string }> = {
  'FPT.eInvoice': { edge: '#16a34a', glow: '#0a7cc4', sub: 'by FPT IS' },
  meInvoice: { edge: '#3990ff', glow: '#2662ff', sub: 'by MISA' },
  SInvoice: { edge: '#ee0033', glow: '#ee0033', sub: 'by Viettel' },
  'M-invoice': { edge: '#6b73ff', glow: '#ff3b30', sub: 'M-invoice JSC' },
}

/** Left-aligned product logo lockup starting at x, vertically centred on cy. */
export function ProviderLogo({ name, x, cy }: { name: string; x: number; cy: number }) {
  switch (name) {
    case 'FPT.eInvoice':
      return (
        <g>
          {/* two-tone leaf swoosh */}
          <path d={`M${x},${cy + 5} C${x + 2},${cy - 5} ${x + 14},${cy - 6} ${x + 17},${cy - 1} C${x + 11},${cy - 3} ${x + 4},${cy - 1} ${x + 2},${cy + 6} Z`} fill="#16a34a" />
          <path d={`M${x + 1},${cy + 9} C${x + 4},${cy + 1} ${x + 15},${cy} ${x + 18},${cy + 5} C${x + 12},${cy + 3} ${x + 5},${cy + 4} ${x + 3},${cy + 10} Z`} fill="#0a7cc4" />
          <text x={x + 24} y={cy} dominantBaseline="central" fontFamily={FONT} fontSize={14} fontWeight={800} fill="#eaf2ff">
            FPT<tspan fill="#7fd8ff">.eInvoice</tspan>
          </text>
        </g>
      )
    case 'meInvoice': {
      const s = 24
      return (
        <g>
          {/* real meInvoice icon (blue gradient tile + white swoosh) */}
          <svg x={x} y={cy - s / 2} width={s} height={s} viewBox="0 0 36 36">
            <defs>
              <linearGradient id="me-grad" x1="18" y1="0" x2="18" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3990FF" />
                <stop offset="1" stopColor="#2662FF" />
              </linearGradient>
            </defs>
            <path d="M0 18C0 3.6 3.6 0 18 0C32.4 0 36 3.6 36 18C36 32.4 32.4 36 18 36C3.6 36 0 32.4 0 18Z" fill="url(#me-grad)" />
            <path fillRule="evenodd" clipRule="evenodd" d="M11.2507 21.825C11.3922 23.1029 12.0376 24.187 13.0174 25.1668C15.3079 27.4573 19.0216 27.4573 21.3121 25.1668L27.7114 18.7674C28.6026 17.8762 28.6255 16.4385 27.763 15.5195C26.8635 14.561 25.3504 14.5339 24.4171 15.4595L18.2257 21.6C16.3881 23.4376 13.2251 23.4272 11.2507 21.825Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M9.22566 16.875C9.27542 18.0381 9.9077 19.0946 10.7957 19.9826C13.0507 22.05 15.7277 21.8641 17.6091 19.9826L22.91 14.6818C23.6663 13.9254 23.6741 12.7015 22.9273 11.9356C22.1887 11.1781 20.9814 11.1459 20.2035 11.8631L15.0912 16.5759C13.5274 18.1397 10.8715 18.3007 9.22566 16.875Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M8.28329 12.7305C8.20145 13.7361 8.54518 14.7698 9.31448 15.5391C10.7052 16.9298 12.9598 16.9297 14.3505 15.5391L18.6459 11.2436C19.3004 10.5892 19.3004 9.52818 18.6459 8.87376C17.9915 8.21933 16.9305 8.21933 16.276 8.87376L12.425 12.7248C11.2816 13.8682 9.429 13.8701 8.28329 12.7305Z" fill="white" />
          </svg>
          <text x={x + s + 6} y={cy} dominantBaseline="central" fontFamily={FONT} fontSize={14.5} fontWeight={800} fill="#eaf2ff">
            <tspan fill="#3990ff">me</tspan>Invoice
          </text>
        </g>
      )
    }
    case 'SInvoice':
      return (
        <g>
          {/* red rounded S tile */}
          <rect x={x} y={cy - 11} width={22} height={22} rx={6} fill="#ee0033" />
          <text x={x + 11} y={cy + 0.5} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontSize={15} fontWeight={900} fill="#fff">S</text>
          <text x={x + 28} y={cy} dominantBaseline="central" fontFamily={FONT} fontSize={14.5} fontWeight={800} fill="#eaf2ff">
            <tspan fill="#ff5470">S</tspan>Invoice
          </text>
        </g>
      )
    case 'M-invoice':
      return (
        <g>
          {/* red swoosh + indigo wordmark (minvoice.vn palette) */}
          <path d={`M${x},${cy + 6} q 10 -13 20 -6 q -11 1 -17 8 Z`} fill="#ff3b30" />
          <text x={x + 22} y={cy} dominantBaseline="central" fontFamily={FONT} fontSize={14.5} fontWeight={800} fill="#8a91ff">
            <tspan fill="#eaf2ff">M-</tspan>invoice
          </text>
        </g>
      )
    default:
      return null
  }
}
