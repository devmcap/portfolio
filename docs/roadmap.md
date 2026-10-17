# Roadmap

What's done, what's next, and how each piece gets built.

## Features

| # | Feature | Status |
|---|---------|--------|
| — | Sections: Hero, About, Projects, Contact + Footer | ✅ Done |
| — | Lenis off under `prefers-reduced-motion` | ✅ Done (`f9a7ec7`) |
| 1 | Light/dark theme | ✅ Done (`7fe5556`, wave `1c2d26a`) |
| 2 | ES/EN language toggle | ✅ Done (`fa366da`) |
| 3 | Cloud intro over the Hero (3D) | ✅ Done |
| 4 | Light 3D element (React Three Fiber) | ✅ Covered by the Hero cloud, for now |
| 5 | Deploy | ⏸️ On hold |

**Why this order:** the fog's colour depends on the theme, and i18n restructures the
`src/data/` files the Hero reads. Building in dependency order means nothing gets
built twice.

## Workflow per feature

1. **Questions** — the decisions that are mine to make (look, defaults, content).
2. **Architecture proposal** — files touched, why, and the alternatives discarded.
3. **Approval** — nothing gets built before this.
4. **Build** — code + Vitest tests. Big features are split into several commits.
5. **Verify** — `tsc`, `npm run lint`, `npm test`, `npm run build`, then a browser review.
6. **Commit** — one per piece, so `git log` reads as the changelog.

## 1. Light/dark theme ✅

- Dark by default (not the OS setting); the choice is saved in `localStorage`.
- Light palette: warm paper `#f4f2ec`, text `#141414`, terracotta accent `#b0410f`
  (lime is unreadable on light backgrounds).
- Sun/moon SVG button in the Nav.
- The switch animates as a rising liquid wave (View Transitions API + a wavy
  `clip-path`, in `src/animations/themeWave.ts`). Instant under reduced motion or
  in browsers without View Transitions.
- An inline script in `index.html` applies the saved theme before the first paint (no flash).
- No React context: the theme lives in CSS variables (`src/styles/tokens.css`).

## 2. ES/EN language toggle ✅

- Default from the browser (`es*` → Spanish, anything else → English); an explicit
  choice is saved in `localStorage` and wins from then on.
- Same URL for both languages.
- Translated: content and section titles. Kept in English on purpose: nav links,
  terminal-style text (`$ build next-project`, `scroll ↓`) and the role "Developer".
- The toggle shows only the language you can switch to (`ES` / `EN`).
- Content is `Localized<T>` (`{ en, es }`, `src/i18n/lang.ts`); interface text lives in
  `src/data/ui.ts`. A test walks all content to catch missing or empty translations.
- `LanguageProvider` + `useLanguage()` (React context) also keep `<html lang>` in sync.

## 3. Cloud intro over the Hero (3D)

On load, a cloud covers the Hero content; scrolling splits it and reveals the Hero.

Decisions:
- **It must be a real 3D cloud** with volume and its own cloud shape, not a flat 2D
  shape and not a full-screen haze.
- Covers the role, the name and the tagline. Mostly opaque, with a little transparency
  so you can tell something is behind it.
- Drifts on its own while idle.
- Clears by **splitting sideways**, as if the name were coming out of it.
- Nav and the "scroll ↓" hint stay visible above it from the start.
- Colour: green gas in the dark theme, black in the light theme. It reads from CSS
  variables so it follows the theme.
- Under `prefers-reduced-motion`: no cloud.

Tried and discarded (not committed):
- **Full-screen fog with CSS masks + SVG `feTurbulence` noise**: covered the whole
  screen instead of being a cloud, and slowed down the scroll and the whole page
  (masks get recomposited on every frame of the drift).
- **Flat SVG cloud** (overlapping circles, concentric tonal bands, a wavy seam
  to split it): fast, but it's a 2D shape. Rejected: it must be 3D.

Chosen approach (in progress): drei `<Clouds>` with the *Puffycloud* recipe, lazy-loaded
so three.js stays out of the main bundle. Several puffs that shiver and crash into each
other, with lightning from `maath`'s `FlashGen`. The name is hidden on load. Scrolling
grows an invisible ball at the name that pushes the puffs off screen: the cloud breaks,
the name comes out, it holds, then the Hero leaves as before. All of it follows the
scrollbar (scrub). Only scroll moves it, not the mouse. Tried and discarded: firing the
break as a timed animation after a small scroll (didn't feel right). It probably also covers feature 4 (the light 3D element).

**Physics decision:** we start with our own small physics (`src/animations/cloudPhysics.ts`:
springs + collisions, no dependency, tested). **If the result doesn't convince us, we
switch to Rapier** (`@react-three/rapier`, like the original Puffycloud): more faithful,
but about +600 KB gzip of WebAssembly and more CPU on mobile.

## 4. Light 3D element

React Three Fiber, used sparingly and kept light on mobile. Covered for now by the Hero
cloud (feature 3): it already is the site's 3D element. A second one would add weight and
compete with it; revisit only if a section clearly asks for it.

## 5. Deploy

Static site. On hold: not deploying anywhere for now. Options when it's time: Vercel,
GitHub Pages (via Actions; needs Vite's `base` unless on a custom domain) or Cloudflare Pages.

## Leftovers

Nothing pending.
