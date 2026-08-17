/**
 * Single source of truth for portfolio CONTENT (from CV).
 * Bilingual fields use { en, vi }. UI/label strings live in src/i18n.
 * To update the CV → edit this file. See TECH_NOTES.md.
 */

export type Bi = { en: string; vi: string }

export const profile = {
  name: 'Vo Nhu Phi',
  role: { en: 'Fullstack Engineer', vi: 'Kỹ sư Fullstack' } as Bi,
  location: { en: 'Ho Chi Minh City, Vietnam', vi: 'TP. Hồ Chí Minh, Việt Nam' } as Bi,
  tagline: {
    en: 'I build event-driven microservices in Go & Java and data-heavy interfaces in React/TypeScript.',
    vi: 'Xây dựng microservice event-driven bằng Go & Java và giao diện dữ liệu lớn với React/TypeScript.',
  } as Bi,
  summary: {
    en: 'Fullstack Engineer, ~3 years on a multi-tenant fintech platform — event-driven backend in Go & Java, data-heavy dashboards in React/TypeScript. I owned a Go API gateway end-to-end and shipped core logic in a high-throughput order service.',
    vi: 'Kỹ sư Fullstack, ~3 năm trên nền tảng fintech multi-tenant — backend event-driven bằng Go & Java, dashboard dữ liệu lớn với React/TypeScript. Mình sở hữu một Go API gateway end-to-end và business logic cốt lõi của order service throughput cao.',
  } as Bi,
  avatar: 'avatar.webp',
  avatarSmall: 'avatar-sm.webp',
  avatarBlur: 'avatar-blur.webp',
  cv: 'VoNhuPhi_CV.pdf',
}

export const contacts = {
  email: 'nhuphivo@gmail.com',
  phone: '+84 388 007 017',
  github: 'https://github.com/phifin',
  githubHandle: 'github.com/phifin',
  linkedin: 'https://linkedin.com/in/phi-vo-nhu-524bb72b6',
  linkedinHandle: 'linkedin.com/in/phi-vo-nhu-524bb72b6',
}

export const stats: { value: number; suffix: string; label: Bi }[] = [
  { value: 3, suffix: 'y', label: { en: 'Years in production', vi: 'Năm làm production' } },
  { value: 30000, suffix: '+', label: { en: 'Merchants served', vi: 'Merchant phục vụ' } },
  { value: 4, suffix: 'M+', label: { en: 'Orders / month', vi: 'Đơn hàng / tháng' } },
  { value: 4, suffix: '', label: { en: 'E-invoice providers unified', vi: 'Nhà cung cấp e-invoice hợp nhất' } },
]

export type SkillCategory = { label: Bi; items: string[] }
export type SkillGroup = {
  key: string
  title: Bi
  accent: 'cyan' | 'blue' | 'sky'
  blurb: Bi
  /** the stack, broken into named sub-categories (lang / framework / pattern …) */
  categories: SkillCategory[]
}

export const skillGroups: SkillGroup[] = [
  {
    key: 'backend',
    title: { en: 'Backend', vi: 'Backend' },
    accent: 'cyan',
    blurb: { en: 'Core technologies and tools I use to build robust, scalable backend systems.', vi: 'Công nghệ cốt lõi mình dùng để xây backend ổn định và mở rộng tốt.' },
    categories: [
      { label: { en: 'Language', vi: 'Ngôn ngữ' }, items: ['Go', 'Java', 'TypeScript'] },
      { label: { en: 'Frameworks', vi: 'Framework' }, items: ['net/http', 'Gin', 'Chi', 'Spring', 'NestJS'] },
      {
        label: { en: 'Service Communication', vi: 'Giao tiếp service' },
        items: ['REST', 'gRPC', 'API Gateway', 'Kafka'],
      },
      {
        label: { en: 'Architecture & Patterns', vi: 'Kiến trúc & Pattern' },
        items: ['Microservices', 'Event-Driven', 'Outbox', 'Debezium CDC', 'Temporal / Saga'],
      },
    ],
  },
  {
    key: 'frontend',
    title: { en: 'Frontend', vi: 'Frontend' },
    accent: 'blue',
    blurb: { en: 'How I build fast, data-heavy interfaces that still feel effortless.', vi: 'Cách mình xây giao diện nhanh, nhiều dữ liệu mà vẫn mượt.' },
    categories: [
      { label: { en: 'Language', vi: 'Ngôn ngữ' }, items: ['JavaScript', 'TypeScript'] },
      {
        label: { en: 'UI Stack', vi: 'UI Stack' },
        items: ['React', 'Next.js', 'Zustand', 'TanStack Query', 'Recharts', 'ApexCharts'],
      },
      { label: { en: 'Delivery', vi: 'Delivery' }, items: ['PWA', 'Capacitor', 'Performance'] },
    ],
  },
  {
    key: 'data',
    title: { en: 'Databases & Caching', vi: 'Cơ sở dữ liệu & Cache' },
    accent: 'sky',
    blurb: { en: 'Where state lives — relational, document and in-memory.', vi: 'Nơi lưu trạng thái — quan hệ, document và in-memory.' },
    categories: [
      {
        label: { en: 'Data Stores', vi: 'Kho dữ liệu' },
        items: ['PostgreSQL', 'MongoDB', 'Redis'],
      },
    ],
  },
  {
    key: 'devops',
    title: { en: 'DevOps & Observability', vi: 'DevOps & Observability' },
    accent: 'cyan',
    blurb: { en: 'Shipping and observing services in production.', vi: 'Ship và giám sát service trên production.' },
    categories: [
      {
        label: { en: 'Platform & Ops', vi: 'Platform & Ops' },
        items: ['Docker', 'Kubernetes', 'Helm', 'GitOps', 'CI/CD', 'Rancher', 'Grafana Loki', 'AWS S3'],
      },
    ],
  },
  {
    key: 'practices',
    title: { en: 'Practices', vi: 'Phương pháp' },
    accent: 'blue',
    blurb: { en: 'How I work with a team and keep systems healthy.', vi: 'Cách mình làm việc nhóm và giữ hệ thống khoẻ mạnh.' },
    categories: [
      {
        label: { en: 'Ways of Working', vi: 'Cách làm việc' },
        items: ['Agile', 'Code Review', 'Multi-tenant Architecture'],
      },
    ],
  },
]

export type Experience = {
  company: string
  role: Bi
  period: Bi
  note: Bi
  projects: {
    name: string
    team: Bi
    summary: Bi
    stack: string[]
    highlights: Bi[]
  }[]
}

export const experiences: Experience[] = [
  {
    company: 'ATOM Solution',
    role: { en: 'Software Engineer', vi: 'Kỹ sư Phần mềm' },
    period: { en: 'Sep 2023 – Present', vi: 'Th9 2023 – Hiện tại' },
    note: {
      en: 'Joined part-time during undergraduate studies, promoted to full-time based on delivery performance.',
      vi: 'Vào part-time khi còn đi học, được thăng lên full-time dựa trên hiệu suất giao hàng.',
    },
    projects: [
      {
        name: 'Merchant Platform',
        team: { en: 'Team of ~20', vi: 'Đội ~20 người' },
        summary: {
          en: 'A multi-tenant SaaS platform for 30,000+ merchants to manage storefront operations — orders, products, payments, and real-time transactions across web and mobile.',
          vi: 'Nền tảng SaaS multi-tenant cho 30.000+ merchant quản lý vận hành cửa hàng — đơn hàng, sản phẩm, thanh toán và giao dịch real-time trên web lẫn mobile.',
        },
        stack: ['Java', 'NestJS', 'PostgreSQL', 'MongoDB', 'Kafka', 'Debezium', 'ReactJS', 'PWA'],
        highlights: [
          {
            en: 'Implemented order-creation logic (validation, pricing, persistence) in the Java/PostgreSQL order service — the platform’s system of record for order, invoice and payment status.',
            vi: 'Xây logic tạo đơn (validate, tính giá, lưu trữ) trong order service Java/PostgreSQL — system of record cho trạng thái đơn, hoá đơn và thanh toán.',
          },
          {
            en: 'Built idempotent refund workflows integrated via gRPC with the payment service (idempotency key, line-item amounts).',
            vi: 'Xây workflow hoàn tiền idempotent tích hợp qua gRPC với payment service (idempotency key, số tiền theo từng dòng).',
          },
          {
            en: 'Implemented compensating-transaction logic (order-status rollback on payment failure) within a Temporal-orchestrated saga.',
            vi: 'Xây compensating-transaction (rollback trạng thái đơn khi thanh toán lỗi) trong saga điều phối bởi Temporal.',
          },
          {
            en: 'Built Kafka producers/consumers for order events backed by the outbox pattern and Debezium CDC, handling millions of orders/month; added retry with exponential backoff.',
            vi: 'Xây Kafka producer/consumer cho order event dựa trên outbox pattern và Debezium CDC, xử lý hàng triệu đơn/tháng; thêm retry backoff luỹ thừa.',
          },
          {
            en: 'Shipped updates via Helm chart image-tag changes in a GitOps workflow; used Grafana Loki and Rancher to debug production.',
            vi: 'Ship update qua đổi image-tag trong Helm chart theo GitOps; dùng Grafana Loki và Rancher để debug production.',
          },
          {
            en: 'Co-architected the NestJS/MongoDB e-invoice data service with clear boundaries in the microservice cluster.',
            vi: 'Đồng thiết kế e-invoice data service NestJS/MongoDB với ranh giới rõ ràng trong cụm microservice.',
          },
          {
            en: 'Re-architected the merchant mobile app from a legacy micro-frontend into a monolithic PWA + Capacitor; managed state with Zustand and TanStack Query.',
            vi: 'Tái kiến trúc app mobile merchant từ micro-frontend cũ sang PWA + Capacitor monolithic; quản lý state bằng Zustand và TanStack Query.',
          },
          {
            en: 'Implemented S3 presigned-URL generation for the product service’s image-upload flow (direct client uploads).',
            vi: 'Xây sinh presigned-URL S3 cho luồng upload ảnh của product service (client upload trực tiếp).',
          },
        ],
      },
      {
        name: 'Invoice Provider Gateway',
        team: { en: 'Team of ~10', vi: 'Đội ~10 người' },
        summary: {
          en: 'A request-forwarding gateway routing e-invoice requests to multiple providers (FPT, MISA, Viettel, M-Invoice) behind a single API — no invoice data is persisted.',
          vi: 'Gateway chuyển tiếp request e-invoice tới nhiều nhà cung cấp (FPT, MISA, Viettel, M-Invoice) sau một API duy nhất — không lưu dữ liệu hoá đơn.',
        },
        stack: ['Golang', 'Redis', 'Docker', 'NextJS', 'ReactJS'],
        highlights: [
          {
            en: 'Designed and built end-to-end a Go API gateway (standard net/http, no framework) routing requests to the correct provider and normalizing payloads across vendors, with hand-written middleware, Redis-based rate limiting and response caching.',
            vi: 'Thiết kế và xây end-to-end một Go API gateway (net/http thuần, không framework) route request tới đúng nhà cung cấp và chuẩn hoá payload giữa các vendor, với middleware tự viết, rate limit và cache dựa trên Redis.',
          },
          {
            en: 'Containerized the gateway with Docker for a reproducible local and deployment setup.',
            vi: 'Đóng gói gateway bằng Docker cho môi trường local và deploy tái lập được.',
          },
          {
            en: 'Built an internal operations dashboard (React, ApexCharts) visualizing orders, customers, contracts and campaign data.',
            vi: 'Xây dashboard vận hành nội bộ (React, ApexCharts) trực quan hoá đơn hàng, khách hàng, hợp đồng và dữ liệu chiến dịch.',
          },
        ],
      },
    ],
  },
]

export type Project = {
  key: string
  name: string
  tagline: Bi
  description: Bi
  stack: string[]
  accent: 'cyan' | 'blue' | 'sky'
}

export const projects: Project[] = [
  {
    key: 'merchant',
    name: 'Merchant Platform',
    tagline: { en: 'Multi-tenant fintech SaaS', vi: 'SaaS fintech multi-tenant' },
    description: {
      en: 'Storefront operations for 30,000+ merchants with an event-driven order system handling millions of orders/month — outbox + CDC to Kafka, Temporal sagas, idempotent refunds over gRPC.',
      vi: 'Vận hành cửa hàng cho 30.000+ merchant với hệ thống đơn hàng event-driven xử lý hàng triệu đơn/tháng — outbox + CDC ra Kafka, Temporal saga, hoàn tiền idempotent qua gRPC.',
    },
    stack: ['Java', 'NestJS', 'Kafka', 'Debezium', 'PostgreSQL', 'MongoDB', 'React', 'PWA'],
    accent: 'cyan',
  },
  {
    key: 'gateway',
    name: 'Invoice Provider Gateway',
    tagline: { en: 'Unified e-invoice API', vi: 'API e-invoice hợp nhất' },
    description: {
      en: 'A Go gateway (net/http, no framework) that normalizes and routes e-invoice traffic to FPT, MISA, Viettel and M-Invoice behind one API, with Redis rate limiting and response caching.',
      vi: 'Gateway Go (net/http, không framework) chuẩn hoá và route lưu lượng e-invoice tới FPT, MISA, Viettel và M-Invoice sau một API, với rate limit và cache bằng Redis.',
    },
    stack: ['Golang', 'Redis', 'Docker', 'Next.js', 'ApexCharts'],
    accent: 'blue',
  },
]

export const education = {
  school: 'University of Information Technology',
  degree: { en: 'Bachelor of Software Engineering', vi: 'Cử nhân Kỹ thuật Phần mềm' } as Bi,
  period: { en: 'Sep 2021 – Sep 2025', vi: 'Th9 2021 – Th9 2025' } as Bi,
}

export const languages = [{ name: 'English', detail: 'IELTS 6.5' }]

export const sectionIds = {
  hero: 'hero',
  about: 'about',
  skills: 'skills',
  kafka: 'kafka',
  saga: 'saga',
  gateway: 'gateway',
  experience: 'experience',
  projects: 'projects',
  contact: 'contact',
}
