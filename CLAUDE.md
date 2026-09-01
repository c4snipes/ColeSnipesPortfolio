# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Build Commands

```bash
npm run dev      # dev server on port 3000, auto-opens a browser
npm run build    # production build to dist/
npm run preview  # serve the production build locally
npm run analyze  # build with a bundle treemap at dist/bundle-report.html
```

## Design brief is the source of truth

`ANTI-VIBECODING-PORTFOLIO.md` defines the palette, type scale, layout grid, motion rules,
performance budgets, and a QA checklist (§11). Source comments cite it by section number.
Read it before any visual change, and update it when a design decision changes — it is
versioned at the bottom of the file.

## Architecture

A **single-page** React 18 + Vite site. Deliberately minimal:

- **No router.** Navigation is hash anchors to sections on one page. Do not add
  react-router; there are no client routes.
- **No UI framework and no CSS framework.** All styling is hand-written in `src/index.css`
  using custom properties. Tailwind and component kits are explicitly banned by the brief.
- **No animation library.** Scroll reveals are `IntersectionObserver` + CSS transitions
  (brief §6.317 specifies opacity 0→1 with translateY 16px→0 over 500ms). The hero
  entrance is a CSS keyframe so it runs before hydration.
- **No state management.** Component-local `useState` only.

### Layout

`src/App.jsx` composes the page in document order. Section order, the nav links in
`Nav.jsx`, and the `01 —` … `06 —` counters printed in each section must stay in sync:

| # | Component | id |
|---|---|---|
| 01 | `Hero` | — |
| 02 | `TechStack` | `#stack` |
| 03 | `Work` | `#work` |
| 04 | `Timeline` | `#timeline` |
| 05 | `About` | `#about` |
| 06 | `Contact` | `#contact` |

### Data

Static content lives in `src/data/`:

- `projects.json` — Work entries, shaped goal / process / result.
- `timeline.json` — Timeline entries. `Timeline.jsx` sorts at render time; array order in
  the file is not significant.
- `stack.json` — Tech Stack groups, rendered with native `<details>`/`<summary>`.
- `site.js` — identity and off-site URLs. **Always** reference links from here. These were
  previously inline and drifted, shipping two different LinkedIn URLs on one page.

### Contact form

`Contact.jsx` POSTs directly to the Web3Forms API from the browser. There is no backend and
no `api/` directory. The access key is public by design. The `localStorage` rate limiter is
a courtesy guard against double-sends, charged only on a successful send, and it degrades to
off when storage is unavailable rather than blocking the form.

Do not add a honeypot field. The request body is hand-built JSON, so a hidden input's value
can never reach it — a previous honeypot was inert for exactly this reason.

## Accessibility invariants

These are load-bearing; check them after any change to `src/index.css` or the components.

- **Contrast.** Every text colour clears WCAG AA (4.5:1) on both `--color-base` and
  `--color-surface`, measured *after* the `body::before` noise overlay composites over the
  page — that veil costs ~0.2–0.3 of a ratio point. `--color-border` is decorative hairline
  only (1.4:1); control boundaries use `--color-border-strong`.
- **Skip link.** `.skip-link` targets `<main id="main" tabIndex="-1">`. The `tabIndex` is
  required — without it the link scrolls but never moves focus.
- **Reduced motion.** The media query resets `scroll-behavior` explicitly; it is neither an
  animation nor a transition, so the duration overrides do not reach it.
- **Live region.** The contact status paragraph is always in the DOM and starts empty. A
  live region inserted at the same moment as its text is usually not announced.
- **Generated content.** Keep `::before`/`::after` text out of interactive elements — it is
  folded into the accessible name. The Tech Stack `+`/`–` marker is an `aria-hidden` span
  for this reason.

## Design system

Tokyo Night is **not** used. The palette is "Baked Earth" — warm parchment `#F5F0E8` with
burnt-sienna accent — defined as custom properties at the top of `src/index.css`. There is
no dark mode and no theme toggle; the brief rules one out deliberately.

Fonts: Cormorant Garamond Light (display) and Space Mono Regular (body/UI). Only three
faces are loaded. Do not request additional weights without adding a rule that uses them.
