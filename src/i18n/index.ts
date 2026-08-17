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
    sub: { en: 'Technologies I use to build great products.', vi: 'Những công nghệ mình dùng để xây sản phẩm tốt.' },
    hint: { en: 'Switch stack — each cell is a category, hover a tool to lift it.', vi: 'Chọn stack — mỗi ô là một hạng mục, hover để nổi tool lên.' },
  },
  kafka: {
    kicker: { en: 'Deep dive · 01', vi: 'Đào sâu · 01' },
    title: { en: 'Event-Driven Order Flow', vi: 'Luồng đơn hàng Event-Driven' },
    body: {
      en: 'Outbox pattern → Debezium CDC → Kafka → consumers, handling millions of orders a month with idempotency and retries.',
      vi: 'Outbox pattern → Debezium CDC → Kafka → consumer, xử lý hàng triệu đơn/tháng với idempotency và retry.',
    },
  },
  saga: {
    kicker: { en: 'Deep dive · 02', vi: 'Đào sâu · 02' },
    title: { en: 'Temporal Saga & Compensation', vi: 'Temporal Saga & Bù trừ' },
    body: {
      en: 'Order Worker orchestrates the saga with Temporal: reserve stock, then charge payment. If payment fails, the compensating transaction releases the stock and rolls back the order.',
      vi: 'Order Worker điều phối saga bằng Temporal: giữ hàng trước, rồi thu tiền. Nếu thanh toán lỗi, compensating transaction trả lại hàng đã giữ và rollback đơn.',
    },
    happy: { en: 'Happy path', vi: 'Happy path' },
    fail: { en: 'Payment fails → compensate', vi: 'Thanh toán lỗi → bù trừ' },
  },
  gateway: {
    kicker: { en: 'Deep dive · 03', vi: 'Đào sâu · 03' },
    title: { en: 'Go API Gateway', vi: 'Go API Gateway' },
    body: {
      en: 'One Go API for internal services and external partners — middleware rate-limits, caches, batches and routes each call to the right e-invoice provider, with no invoice data stored.',
      vi: 'Một Go API duy nhất cho cả service nội bộ lẫn đối tác ngoài — middleware lo rate limit, cache, gom batch và route mỗi request tới đúng nhà cung cấp, không lưu dữ liệu hoá đơn.',
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
