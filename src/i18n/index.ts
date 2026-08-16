/** UI label dictionary (VI/EN). Content data lives in src/data/content.ts. */

export type Lang = 'en' | 'vi'

export const ui = {
  nav: {
    about: { en: 'About', vi: 'Giới thiệu' },
    skills: { en: 'Skills', vi: 'Kỹ năng' },
    architecture: { en: 'Architecture', vi: 'Kiến trúc' },
    experience: { en: 'Experience', vi: 'Kinh nghiệm' },
    projects: { en: 'Projects', vi: 'Dự án' },
    contact: { en: 'Contact', vi: 'Liên hệ' },
  },
  hero: {
    scroll: { en: 'Scroll to explore', vi: 'Cuộn để khám phá' },
    cta: { en: 'Explore my work', vi: 'Khám phá công việc' },
    resume: { en: 'Download CV', vi: 'Tải CV' },
    available: { en: 'Open to opportunities', vi: 'Sẵn sàng cơ hội mới' },
  },
  about: {
    kicker: { en: 'Who I am', vi: 'Tôi là ai' },
    title: { en: 'Backend-leaning fullstack, fintech scale', vi: 'Fullstack thiên backend, quy mô fintech' },
  },
  skills: {
    kicker: { en: 'Toolbox', vi: 'Bộ công cụ' },
    title: { en: 'Skills & Technologies', vi: 'Kỹ năng & Công nghệ' },
    hint: { en: 'Select a layer to highlight it on the live architecture map — one real system, front to back.', vi: 'Chọn một tầng để làm nổi bật trên sơ đồ kiến trúc — một hệ thống thật, từ front tới back.' },
  },
  kafka: {
    kicker: { en: 'Deep dive · 01', vi: 'Đào sâu · 01' },
    title: { en: 'Event-Driven Order Flow', vi: 'Luồng đơn hàng Event-Driven' },
    body: {
      en: 'Orders are written transactionally, published through the outbox pattern, streamed by Debezium CDC into Kafka, and fanned out to consumers — millions of orders a month, with idempotency and retries.',
      vi: 'Đơn hàng được ghi transactional, phát qua outbox pattern, được Debezium CDC stream vào Kafka rồi fan-out tới các consumer — hàng triệu đơn mỗi tháng, có idempotency và retry.',
    },
  },
  saga: {
    kicker: { en: 'Deep dive · 02', vi: 'Đào sâu · 02' },
    title: { en: 'Temporal Saga & Compensation', vi: 'Temporal Saga & Bù trừ' },
    body: {
      en: 'Temporal is the orchestration infra. The Order Worker runs OrderWorkflow; scheduling a payment pushes an activity onto the payment-task-queue, which the Payment Worker pulls and executes. On failure the workflow runs a compensating transaction to roll the order back.',
      vi: 'Temporal là hạ tầng điều phối. Order Worker chạy OrderWorkflow; khi cần thanh toán, workflow đẩy một activity vào payment-task-queue để Payment Worker tự pull về và execute. Khi lỗi, workflow chạy compensating transaction để rollback đơn hàng.',
    },
    happy: { en: 'Happy path', vi: 'Happy path' },
    fail: { en: 'Payment fails → compensate', vi: 'Thanh toán lỗi → bù trừ' },
  },
  gateway: {
    kicker: { en: 'Deep dive · 03', vi: 'Đào sâu · 03' },
    title: { en: 'Go API Gateway', vi: 'Go API Gateway' },
    body: {
      en: 'One API for both internal services and external partners. Hand-written middleware rate-limits and caches in Redis, batches bulk-sign requests, then normalizes and routes each call to the right provider (FPT, MISA, Viettel, M-Invoice) — no invoice data stored.',
      vi: 'Một API cho cả internal service lẫn đối tác bên ngoài. Middleware tự viết lo rate limit và cache trong Redis, gom (batch) các request ký hàng loạt, rồi chuẩn hoá và route mỗi request tới đúng nhà cung cấp (FPT, MISA, Viettel, M-Invoice) — không lưu dữ liệu hoá đơn.',
    },
  },
  experience: {
    kicker: { en: 'Journey', vi: 'Hành trình' },
    title: { en: 'Experience', vi: 'Kinh nghiệm' },
    highlights: { en: 'Highlights', vi: 'Điểm nhấn' },
  },
  projects: {
    kicker: { en: 'Selected work', vi: 'Dự án tiêu biểu' },
    title: { en: 'Projects', vi: 'Dự án' },
  },
  contact: {
    kicker: { en: "Let's talk", vi: 'Kết nối' },
    title: { en: 'Get in touch', vi: 'Liên hệ với tôi' },
    body: {
      en: 'Building something that needs solid backend architecture or a polished frontend? I’d love to hear about it.',
      vi: 'Bạn đang xây thứ gì cần kiến trúc backend vững hoặc frontend chỉn chu? Rất vui được nghe về nó.',
    },
    email: { en: 'Email me', vi: 'Gửi email' },
  },
  footer: {
    built: { en: 'Built with React, Three.js & GSAP', vi: 'Xây bằng React, Three.js & GSAP' },
  },
  education: {
    title: { en: 'Education', vi: 'Học vấn' },
    languages: { en: 'Languages', vi: 'Ngôn ngữ' },
  },
} as const
