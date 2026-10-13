# Development Guidelines

- Stack: Vite + React 19 + TypeScript, GSAP (ScrollTrigger) + Lenis for scroll animations, React Three Fiber only for occasional 3D elements. Static site, no backend.
- Styles with CSS Modules; design values live as CSS variables in `src/styles/tokens.css`.
- Keep content (`src/data/`), animations (`src/animations/`) and sections (`src/sections/`) separated.
- Import gsap/ScrollTrigger/useGSAP from `src/animations/gsap.ts` (plugins are registered there).
- Respect `prefers-reduced-motion` and keep the site fast on mobile.
- Use strict TypeScript types.
- Prefer clean, maintainable and modular code.
- Do not overengineer solutions.
- Explain architectural decisions before implementing them.
- Do not implement entire features without my approval.
- Help me understand the code instead of only generating it.
- Write tests using Vitest (`npm test`).
- Prioritize learning and good engineering practices.
