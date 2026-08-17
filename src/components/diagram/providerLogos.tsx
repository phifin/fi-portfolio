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
      // Real minvoice.vn emblem: a four-fold interlocking knot, three indigo
      // arms plus one red. Paths traced from their official logo file and
      // lightened slightly so they read on the dark diagram.
      const s = 22
      return (
        <g>
          <svg x={x} y={cy - s / 2} width={s} height={s} viewBox="0 0 64 64">
            <path d="M12.0,10.1 L14.4,10.1 L16.0,10.8 L33.8,24.4 L34.8,25.3 L34.8,25.8 L32.4,28.9 L31.1,29.6 L14.2,16.7 L12.4,16.4 L11.6,17.3 L11.0,19.0 L11.0,22.5 L12.4,26.2 L13.6,28.0 L15.9,30.2 L13.5,33.5 L10.7,31.1 L9.5,30.7 L8.1,31.0 L6.4,32.7 L5.5,34.5 L5.3,36.0 L5.6,38.4 L6.8,42.2 L3.7,45.9 L1.3,37.9 L0.9,35.4 L0.9,31.1 L1.9,28.3 L3.6,26.4 L7.3,25.0 L6.1,21.2 L6.1,17.5 L6.5,15.7 L7.3,14.1 L9.0,11.7 L10.4,10.7 L12.0,10.1ZM24.9,29.0 L28.1,31.0 L29.2,32.0 L29.2,32.9 L16.1,49.6 L16.0,51.3 L16.9,52.1 L19.0,52.9 L22.2,52.7 L26.4,51.0 L29.9,48.0 L33.0,50.2 L33.0,50.7 L31.6,51.9 L30.7,53.2 L30.2,54.5 L30.7,55.9 L32.3,57.5 L34.2,58.4 L37.0,58.4 L41.8,57.0 L45.3,59.7 L45.5,60.1 L37.2,62.5 L33.9,63.0 L30.4,62.8 L28.1,62.1 L26.1,60.4 L25.3,59.3 L24.6,56.4 L19.9,57.8 L16.1,57.5 L12.6,55.7 L10.1,53.0 L9.6,51.9 L9.6,49.3 L10.2,47.9 L24.9,29.0ZM59.7,18.1 L61.3,22.5 L62.4,27.0 L62.7,29.5 L62.4,33.9 L61.5,36.0 L60.1,37.5 L58.8,38.4 L56.7,38.7 L56.1,39.1 L57.2,42.5 L57.3,45.9 L56.9,48.1 L55.6,50.8 L53.8,52.7 L52.0,53.8 L49.0,53.9 L47.3,53.2 L28.6,38.4 L31.3,34.7 L32.3,34.2 L49.5,47.6 L51.0,47.6 L51.9,46.7 L52.4,45.2 L52.4,41.3 L50.7,37.3 L47.7,34.1 L47.7,33.6 L49.9,30.5 L50.4,30.5 L52.3,32.6 L53.8,33.3 L54.8,33.3 L56.7,31.9 L58.2,28.7 L58.1,26.4 L56.7,21.9 L59.7,18.1Z" fill="#5a62d6" />
            <path d="M29.8,0.9 L33.8,1.2 L36.6,2.7 L38.2,4.7 L38.8,7.4 L43.4,6.2 L46.8,6.4 L48.7,7.0 L51.3,8.4 L52.9,10.1 L53.8,12.0 L53.8,14.7 L53.0,16.3 L38.4,35.0 L34.5,32.3 L34.2,31.0 L46.7,15.1 L47.4,13.9 L47.6,12.9 L45.6,11.3 L44.4,11.0 L41.2,11.1 L37.5,12.7 L35.7,13.9 L33.9,15.9 L33.2,15.7 L30.4,13.6 L33.2,9.9 L32.9,8.1 L31.3,6.5 L29.6,5.6 L27.7,5.3 L21.6,6.8 L18.1,4.0 L18.2,3.6 L24.7,1.6 L29.8,0.9Z" fill="#F0402E" />
          </svg>
          <text x={x + s + 6} y={cy} dominantBaseline="central" fontFamily={FONT} fontSize={14.5} fontWeight={800} fill="#eaf2ff">
            M-invoice
          </text>
        </g>
      )
    }
    default:
      return null
  }
}
