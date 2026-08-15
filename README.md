# fi-portfolio

3D interactive portfolio for **Vo Nhu Phi — Fullstack Engineer**.
Bilingual (VI/EN), dark neon theme, React + Three.js, deployed to GitHub Pages.

**Live:** https://phifin.github.io/fi-portfolio/

## Stack

React 18 · Vite · TypeScript · React Three Fiber (+ drei, postprocessing) · GSAP + ScrollTrigger · Framer Motion · Lenis · Tailwind CSS

## Development

```bash
npm install
npm run dev        # http://localhost:5173/fi-portfolio/
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## Deploy (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml` (build → deploy).

One-time setup on GitHub: **Settings → Pages → Source → GitHub Actions**.

> The app is served from the `/fi-portfolio/` sub-path — see `base` in `vite.config.ts`.
> If you rename the repo, update `base`, `homepage` (package.json) and the asset paths in `index.html`.

## Updating content

All CV content lives in [`src/data/content.ts`](src/data/content.ts); UI labels in [`src/i18n/index.ts`](src/i18n/index.ts).
See [`TECH_NOTES.md`](TECH_NOTES.md) for the full map, architecture-diagram guide, and performance/mobile notes.
