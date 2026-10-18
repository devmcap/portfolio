# devmcap

Personal portfolio of Miguel Molina, built as a scroll-driven narrative.

**Live:** [devmcap.vercel.app](https://devmcap.vercel.app)

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript (strict)
- [GSAP](https://gsap.com) with ScrollTrigger for scroll animations
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- CSS Modules, with design tokens as CSS variables
- [Vitest](https://vitest.dev) for tests

Static site, no backend. Deployed on [Vercel](https://vercel.com): every push to `main` goes to production.

## Getting started

```bash
npm install
npm run dev      # dev server at http://localhost:5173
```

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the tests (Vitest) |
| `npm run lint` | Lint with oxlint |

## Project structure

```
src/
├── animations/   GSAP setup (plugins registered in gsap.ts) and animation hooks
├── components/   Reusable pieces: Nav, ThemeToggle, SmoothScroll, SpecList…
├── data/         Site content, kept apart from the markup
├── sections/     Page sections: Hero, About, Projects, Contact
└── styles/       tokens.css — colors, fonts and spacing for both themes
```

## Accessibility

- Respects `prefers-reduced-motion`: animations and smooth scrolling are turned off.
- Light and dark themes, with text contrast that meets WCAG AA.

## Roadmap

See [docs/roadmap.md](docs/roadmap.md).
