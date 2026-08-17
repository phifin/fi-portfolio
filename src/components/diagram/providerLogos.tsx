/**
 * E-invoice PRODUCT logos — FPT.eInvoice has no separate product mark, so it
 * uses FPT Corporation's own logo; meInvoice (MISA), SInvoice (Viettel) and
 * M-invoice are drawn from each brand's real assets (colors sampled from
 * their official sites/logo files). Left-aligned icon + wordmark lockups,
 * rendered inside the diagram <svg>.
 */

const FONT = "'Sora', system-ui, sans-serif"

export const PROVIDER_META: Record<string, { edge: string; glow: string; sub: string }> = {
  'FPT.eInvoice': { edge: '#1a8ae0', glow: '#f27023', sub: 'by FPT IS' },
  meInvoice: { edge: '#3990ff', glow: '#2662ff', sub: 'by MISA' },
  SInvoice: { edge: '#ee0033', glow: '#ee0033', sub: 'by Viettel' },
  'M-invoice': { edge: '#5a62d6', glow: '#f0513c', sub: 'M-invoice JSC' },
}

/** Left-aligned product logo lockup starting at x, vertically centred on cy. */
export function ProviderLogo({ name, x, cy }: { name: string; x: number; cy: number }) {
  switch (name) {
    case 'FPT.eInvoice': {
      // No standalone eInvoice mark — this is FPT Corporation's own tri-bar
      // logo (exact bar paths from fpt.com.vn/fpt-logo.svg), since the
      // product ships under the parent brand rather than its own identity.
      const s = 22
      return (
        <g>
          <svg x={x} y={cy - s * 0.63} width={s} height={s * 0.7} viewBox="0 0 183 128">
            <path fill="#1a8ae0" d="M45.88,33A18.73,18.73,0,0,0,28.1,45.85c-.06.17-.11.34-.16.51L27.53,48,17.13,93H43.32a18.13,18.13,0,0,0,17-11.91l1-4.29L71.45,33Z" />
            <path fill="#f27023" d="M95.29,18a18.71,18.71,0,0,0-18,13.61,17.28,17.28,0,0,0-.42,1.79L59.64,108H85.2a18.73,18.73,0,0,0,18.16-14.15h0L120.88,18Z" />
            <path fill="#2bc766" d="M137.81,33a18.72,18.72,0,0,0-17.5,12.08c-.14.36-.62,1.85-.62,1.85L109.06,93h25.57a18.74,18.74,0,0,0,18.18-14.22h0L163.37,33Z" />
          </svg>
          <text x={x + s + 6} y={cy} dominantBaseline="central" fontFamily={FONT} fontSize={15} fontWeight={800} fill="#eaf2ff">
            FPT
          </text>
        </g>
      )
    }
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
          {/* real wordmark is a single solid tone (dark navy on their light
              site) — lightened here to stay legible on the dark diagram */}
          <text x={x + s + 6} y={cy} dominantBaseline="central" fontFamily={FONT} fontSize={14.5} fontWeight={700} fill="#eaf2ff">
            meInvoice
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
    case 'M-invoice': {
      // real minvoice.vn logo: a red comet-swoosh under a solid indigo
      // "invoice" wordmark (colors sampled from their actual logo file)
      const grad = `mi-swoosh-${x}-${cy}`
      return (
        <g>
          <defs>
            <linearGradient id={grad} x1={x} y1={cy + 8} x2={x + 18} y2={cy - 2} gradientUnits="userSpaceOnUse">
              <stop stopColor="#F05138" />
              <stop offset="1" stopColor="#ED1F24" />
            </linearGradient>
          </defs>
          <path d={`M${x},${cy + 7} Q${x + 6},${cy - 4} ${x + 19},${cy - 6} Q${x + 9},${cy - 1} ${x + 3},${cy + 8} Z`} fill={`url(#${grad})`} />
          <text x={x + 23} y={cy} dominantBaseline="central" fontFamily={FONT} fontSize={14.5} fontWeight={800} fill="#eaf2ff">
            M-invoice
          </text>
        </g>
      )
    }
    default:
      return null
  }
}
