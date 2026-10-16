# Roadmap

What's done, what's next, and how each piece gets built.

## Features

| # | Feature | Status |
|---|---------|--------|
| — | Sections: Hero, About, Projects, Contact + Footer | ✅ Done |
| — | Lenis off under `prefers-reduced-motion` | ✅ Done (`f9a7ec7`) |
| 1 | Light/dark theme | ✅ Done (`7fe5556`, wave `1c2d26a`) |
| 2 | ES/EN language toggle | ✅ Done, pending visual review |
| 3 | Fog intro over the Hero | ⏭️ Next |
| 4 | Light 3D element (React Three Fiber) | Planned |
| 5 | Deploy | Planned |

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

## 3. Fog intro over the Hero

On load, a dark cloud covers the name; scrolling clears it and reveals the Hero.

Open questions:
- Name fully hidden, or faintly visible through the fog?
- Does the fog drift while idle, or stay static until scroll?
- How does it clear: thins out evenly, opens from the centre, lifts, splits sideways?
- Are the Nav and the "scroll ↓" hint visible above the fog from the start?
- What does the fog look like in the light theme?

Technical direction: CSS gradients + SVG `feTurbulence` noise, scrubbed with GSAP
(lightest option). Colour comes from CSS variables, so it follows the theme. Under
`prefers-reduced-motion`: no fog, or an instant reveal.

## 4. Light 3D element

React Three Fiber, used sparingly and kept light on mobile. Details to be decided.

## 5. Deploy

Static site. Hosting to be decided.

## Leftovers

- Check the Nav at 375px with both toggles (estimated ~360px, tight).
- Maybe reword "developed alongside AI agents" (the site shouldn't look AI-made).
- Add a `.gitattributes` to silence the LF/CRLF warnings.
