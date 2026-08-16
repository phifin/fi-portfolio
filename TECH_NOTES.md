# TECH_NOTES — fi-portfolio

Ghi chú kỹ thuật để **session sau update CV/portfolio nhanh**. Đọc file này trước khi sửa.

## 1. Tổng quan

Portfolio 3D một trang (single-page scroll) cho **Vo Nhu Phi — Fullstack Engineer**.
Song ngữ VI/EN, dark theme neon cyan/violet, deploy GitHub Pages.

- Repo: `github.com/phifin/fi-portfolio` → chạy tại `https://phifin.github.io/fi-portfolio/`
- Vì chạy ở sub-path, `vite.config.ts` đặt `base: '/fi-portfolio/'`. **Nếu đổi tên repo phải sửa `base` này** (và `homepage` trong package.json, favicon/OG path trong index.html).

## 2. Stack

| Mảng | Thư viện | Ghi chú |
|---|---|---|
| Core | React 18 + Vite 5 + TypeScript | |
| 3D | `@react-three/fiber` (R3F) + `@react-three/drei` + `@react-three/postprocessing` | Bloom cho glow |
| Animation | `gsap` + ScrollTrigger, `framer-motion` | GSAP dùng qua Lenis ticker |
| Smooth scroll | `lenis` | tắt khi `prefers-reduced-motion` |
| Styling | Tailwind CSS 3 + CSS vars (`src/index.css`) | theme **cyan + blue** (không dùng violet) |
| Icons | `lucide-react` | dùng cho nav/section/skill/social + trong SVG sơ đồ |
| i18n | Tự viết (không dùng lib) | `LanguageProvider` + dict `src/i18n/index.ts` |

> **Theme**: accent tokens `accent.cyan / accent.blue / accent.sky` (tailwind.config.js) + biến `--cyan/--blue/--sky` (index.css). Đổi màu chủ đạo sửa 2 chỗ này.

## 3. Cấu trúc thư mục

```
src/
  data/content.ts        ← NGUỒN NỘI DUNG CHÍNH (CV). Sửa CV = sửa đây.
  i18n/index.ts          ← nhãn UI song ngữ (nav, tiêu đề section, nút…)
  providers/LanguageProvider.tsx  ← state ngôn ngữ, helper pick({en,vi})
  hooks/
    useDeviceTier.ts     ← phân tầng máy (high/mid/low, isMobile) để giảm tải 3D
    useLenis.ts          ← smooth scroll + scrollToId(id) + deep-link
  components/
    intro/    Intro.tsx              (màn intro + kéo rèm khi load; skip nếu có ?static hoặc #hash)
    layout/   Nav, LanguageToggle, Footer
    ui/       Reveal, SectionHeading, AnimatedCounter, TiltCard, DeepDiveLayout, DiagramLegend
    three/    HeroScene              (canvas 3D DUY NHẤT)
    diagram/  primitives.tsx         (shape + icon + flow cho sơ đồ SVG)
    sections/ Hero, About, Skills, KafkaDeepDive, SagaDeepDive,
              GatewayDeepDive, Experience, Contact
              (Projects đã gộp vào Experience — bỏ trùng lặp)
  App.tsx                ← ghép section theo thứ tự + scroll progress + deep-link
```

## 4. Cập nhật nội dung (CV) — làm ở đâu

**Tất cả nội dung trong `src/data/content.ts`.** Mỗi trường mô tả là object `{ en, vi }`.

- **Thông tin cá nhân / tagline / summary**: `profile`
- **Liên hệ** (email, phone, github, linkedin): `contacts`
- **Số liệu đếm động** (3y, 30k+ merchants…): `stats`
- **Kỹ năng** (nhóm + danh sách): `skillGroups` — mỗi nhóm có `accent` (cyan/violet/magenta)
- **Kinh nghiệm** (công ty, project, highlights): `experiences`
- **Projects card**: `projects`
- **Học vấn / ngôn ngữ**: `education`, `languages`

Đổi **nhãn giao diện** (tiêu đề section, nút, kicker): `src/i18n/index.ts`.

Thêm ngôn ngữ mới: thêm mã vào type `Lang`, thêm nhánh trong mọi object `{en, vi}` (nhiều chỗ — cân nhắc chuyển sang lib i18n nếu >2 ngôn ngữ).

## 5. Thêm / sửa section

- Thêm section: tạo `components/sections/X.tsx`, thêm id vào `sectionIds` (content.ts), ghép vào `App.tsx`, thêm link nav ở `layout/Nav.tsx` (`links`).
- Section thường bọc nội dung bằng `<Reveal>` (fade-in khi scroll) và `<SectionHeading>`.

## 6. Deep-dive diagrams (phần "wow")

3 diagram minh hoạ kiến trúc, **tất cả là SVG động** (framer-motion) — chuẩn ký hiệu sơ đồ, chữ nằm gọn trong object, nhẹ & sắc nét. Layout chung qua `ui/DeepDiveLayout` (prop `flip` đảo trái/phải, `wide` cho khung 16:10, `Icon` cho kicker).

- **Vocabulary dùng chung**: `components/diagram/primitives.tsx` — `ServiceNode` (box + icon lucide), `Datastore` (cylinder = kho dữ liệu), `TopicNode` (Kafka có partition), `Edge` (mũi tên), `FlowPackets` (hạt chạy dọc waypoints). Bảng màu `DIA`.
- **KafkaDeepDive** — Order Service → Outbox (cylinder) → Debezium → Kafka (topic) → 3 consumer.
- **SagaDeepDive** — Temporal / Order / Payment, toggle Happy/Fail (compensating transaction), pulse chạy theo bước.
- **GatewayDeepDive** — Client → Go Gateway (4 middleware) → 4 provider + Redis (cylinder).
- Legend dùng `ui/DiagramLegend` (icon chip, **không dùng chấm tròn**).

> Chỉ còn **1 WebGL canvas duy nhất** (Hero, `three/HeroScene.tsx`). Sơ đồ đã chuyển hết sang SVG để hết lag. Thêm diagram mới → clone pattern SVG bằng primitives ở trên.

## 7. Hiệu năng / mobile (QUAN TRỌNG)

**Nguyên tắc chống lag (đã áp dụng — quan trọng khi thêm 3D):**
- **1 canvas duy nhất** (Hero). Không mount nhiều WebGL context cùng lúc.
- Hero canvas `frameloop='never'` khi cuộn khỏi viewport (IntersectionObserver) → không render frame vô ích.
- `<PerformanceMonitor onDecline>` tự hạ chất lượng (tắt bloom, giảm particle) khi tụt FPS; `<AdaptiveDpr pixelated />` tự giảm DPR.
- `useDeviceTier()` trả `{ tier, isMobile, dpr, reducedMotion }`: giảm particle (Hero 900/450/200 theo tier), tắt Bloom ở `low`, cap DPR (1.6/1.25/1).
- `prefers-reduced-motion`: Lenis tắt, animation CSS rút về ~0ms (index.css), `Reveal` vẫn chạy nhưng nhanh.
- **Tránh tràn ngang**: grid item chứa vùng `overflow-x-auto` phải có `min-w-0` (xem Skills.tsx) — nếu không track grid phình theo nội dung.

## 8. Ảnh / asset

- Avatar gốc (~2.2MB PNG) đã tối ưu bằng ImageMagick thành WebP trong `public/`:
  `avatar.webp` (900w, ~74KB), `avatar-sm.webp` (480w), `avatar-blur.webp` (LQIP 24w).
  File gốc **không commit** (đã ignore). Muốn đổi avatar: bỏ ảnh mới vào, chạy lại lệnh `convert` tương tự (xem lịch sử) rồi ghi đè public.
- CV PDF: `public/VoNhuPhi_CV.pdf` (nút Download CV trỏ tới đây qua `import.meta.env.BASE_URL`).

## 9. Build / Deploy

```bash
npm install
npm run dev        # dev tại http://localhost:5173/fi-portfolio/
npm run build      # tsc + vite build -> dist/
npm run preview    # xem bản build
```

- Deploy tự động qua **GitHub Actions**: `.github/workflows/deploy.yml` (build + upload Pages) khi push `main`.
- **Bật 1 lần trên GitHub**: repo Settings → Pages → Source = **GitHub Actions**.

## 10. Intro & một số section

- **Intro** (`components/intro/Intro.tsx`): load vào trang → dựng poster (mạng lưới + monogram + tên), rồi handle "kéo lên để vào" (wheel/touch/kéo/click đều được). Khoá scroll (Lenis stop + body overflow) khi intro còn. Hiện mỗi lần load; **skip** khi URL có `?static` hoặc `#hash` (deep-link).
- **Skills** (`sections/Skills.tsx`): desktop = **constellation** (hub danh mục + node công nghệ nối tơ, hạt chạy); mobile = chip list gọn. Chọn theo `isMobile`.
- **Experience**: nguồn dữ liệu dự án duy nhất — mỗi project là card full-width, highlights xếp lưới 2 cột.
- **Kicker** section dùng class `.kicker` (icon + chữ mono, không border/nền).

## 11. Debug flag

`?static` trên URL → `Reveal` render thẳng (bỏ animation whileInView) + bỏ qua Intro. Dùng để chụp/screenshot section mà không cần scroll. Vô hại cho production.

## 11. Checklist khi update CV

1. Sửa `src/data/content.ts` (và `src/i18n/index.ts` nếu đổi nhãn).
2. Nếu thêm kỹ năng mũi nhọn mới đáng làm deep-dive → tạo section diagram (mục 6).
3. `npm run build` kiểm tra không lỗi TS.
4. Commit + push `main` → Actions tự deploy.
