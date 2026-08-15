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
| Styling | Tailwind CSS 3 + CSS vars (`src/index.css`) | |
| i18n | Tự viết (không dùng lib) | `LanguageProvider` + dict `src/i18n/index.ts` |

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
    layout/   Nav, LanguageToggle, Footer
    ui/       Reveal, SectionHeading, AnimatedCounter, TiltCard, DeepDiveLayout
    three/    HeroScene, FlowPrimitives, KafkaScene, DiagramCanvas
    sections/ Hero, About, Skills, KafkaDeepDive, SagaDeepDive,
              GatewayDeepDive, Experience, Projects, Contact
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

3 diagram minh hoạ kiến trúc, layout chung qua `ui/DeepDiveLayout` (prop `flip` đảo trái/phải, `wide` cho khung 16:10).

- **KafkaDeepDive** — 3D thật (R3F). Scene ở `three/KafkaScene.tsx`, primitive tái dùng ở `three/FlowPrimitives.tsx` (`Node`, `Connection`, `MessageStream` = hạt message chạy dọc curve). Vị trí node là các `Vector3` ở đầu file KafkaScene — chỉnh ở đó. Nhãn node = drei `<Html>` (screen-space).
- **SagaDeepDive** — SVG + framer-motion, có toggle Happy/Fail (compensating transaction). Tất cả trong 1 file.
- **GatewayDeepDive** — SVG + framer, request token fan-out tới 4 provider. Tất cả trong 1 file.

Thêm deep-dive mới: nếu là flow ngang nhiều node → clone pattern Kafka (3D) hoặc Saga/Gateway (SVG, nhẹ hơn, sắc nét, tốt cho mobile).

## 7. Hiệu năng / mobile (QUAN TRỌNG)

- `useDeviceTier()` trả `{ tier, isMobile, dpr, reducedMotion }`. Dùng để:
  - giảm số particle (Hero: 1400/700/300 theo tier),
  - tắt postprocessing Bloom ở tier `low`,
  - scale nhỏ KafkaScene trên mobile (0.6) để không tràn khung vuông.
- Mọi Canvas set `dpr` từ tier để không render quá nét trên máy yếu.
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

## 10. Debug flag

`?static` trên URL → `Reveal` render thẳng (bỏ animation whileInView). Dùng để chụp/screenshot section mà không cần scroll. Vô hại cho production.

## 11. Checklist khi update CV

1. Sửa `src/data/content.ts` (và `src/i18n/index.ts` nếu đổi nhãn).
2. Nếu thêm kỹ năng mũi nhọn mới đáng làm deep-dive → tạo section diagram (mục 6).
3. `npm run build` kiểm tra không lỗi TS.
4. Commit + push `main` → Actions tự deploy.
