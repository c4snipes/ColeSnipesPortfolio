# Anti-Vibecoding Portfolio — Full Design System & Build Brief

> A living document for a personal portfolio that reads like a printed monograph, not a SaaS landing page.

---

## 1. Design Philosophy

This portfolio is built on one conviction: **craft is legible**. Visitors should feel, within three seconds, that a human with taste made deliberate choices — not a developer who hit "generate" and shipped.

The visual language borrows from:
- **Printed editorial design** — Kinfolk, Emigre, Eye Magazine
- **Institutional museum identity** — MoMA, the V&A, the Cooper Hewitt
- **Mid-century technical documentation** — NASA manuals, Bell Labs reports, Swiss railway signage

The goal is not to look "old." It is to look *considered*. Restraint applied with precision is more impressive than spectacle applied without it.

### Anti-patterns (banned, no exceptions)
| Banned Pattern | Why It Fails |
|---|---|
| Inter / Roboto body text | Signals default-ness, zero typographic intent |
| Purple-to-pink gradients | The visual fingerprint of AI-generated slop |
| Bento grid project layouts | Every junior portfolio looks identical |
| Floating glass-morphism cards | Cheap depth substitute for real layout thinking |
| Lottie icon animations | Decorative noise, not meaningful motion |
| "I am a passionate developer" copy | Meaningless opener that wastes prime attention real estate |
| Emoji as UI elements | Degrades typographic tone immediately |
| Hero particle systems | A decade past their expiry date |
| Custom cursor or `cursor: none` | Breaks native affordances and reads as a gimmick |
| Inline `<style>` blocks in JSX | Hides the system and encourages quick-fix styling |
| Inline `style={{}}` for layout/typography | Makes design decisions unsearchable and inconsistent |

---

## 2. Typography System

Typography does 80% of the personality work. Every size, weight, and spacing decision is intentional.

### 2.1 Font Stack

| Role | Font | Source | Fallback |
|---|---|---|---|
| Display / H1–H2 | Cormorant Garamond | Google Fonts | Georgia, serif |
| Section Headers / H3–H4 | Cormorant Garamond Italic | Google Fonts | Georgia italic, serif |
| Body / UI Labels | Space Mono | Google Fonts | Courier New, monospace |
| Data / Captions | Space Mono | Google Fonts | monospace |

**Why this pairing:** Cormorant's extreme stroke contrast (hairline thins against bold swells) creates visual drama at large sizes without needing color or animation. Space Mono grounds it in a technical, precise register — the combination reads as "architect's sketchbook" rather than "generic portfolio."

### 2.2 Type Scale (Major Third — 1.250 ratio)

```
--step-5: clamp(3.052rem, 5vw, 6.104rem)   /* Hero name */
--step-4: clamp(2.441rem, 4vw, 4.883rem)   /* Hero subtitle */
--step-3: clamp(1.953rem, 3vw, 3.052rem)   /* Section titles */
--step-2: clamp(1.563rem, 2vw, 1.953rem)   /* Project titles */
--step-1: clamp(1.25rem, 1.5vw, 1.563rem)  /* Sub-headings */
--step-0: clamp(1rem, 1vw, 1.25rem)        /* Body copy */
--step--1: clamp(0.8rem, 0.9vw, 1rem)      /* Captions, meta */
--step--2: clamp(0.64rem, 0.8vw, 0.8rem)   /* Labels, footnotes */
```

### 2.3 Typographic Rules

- **Line height:** 1.2 for display, 1.6 for body, 1.4 for UI labels
- **Measure (line length):** 60–72ch for body paragraphs. Never let body text run full-width.
- **Letter spacing:** `+0.04em` on all-caps labels. Never stretch display type.
- **Hierarchy signal:** Weight alone is insufficient. Use size, spacing, AND color contrast together.
- **Orphan control:** CSS `text-wrap: balance` on all headings.
- **No underlines as decoration** — underlines are reserved exclusively for functional hyperlinks.
- **Drop caps appear once** on the lead paragraph only. Never on every paragraph.

---

## 3. Color System

### 3.1 Palette — "Baked Earth"

```css
/* Background layers */
--color-base:          #F5F0E8;   /* Warm parchment — primary background */
--color-surface:       #EDE7D9;   /* Slightly deeper — card/section surfaces */
--color-border:        #D4C9B5;   /* Stone — decorative dividers and rules ONLY */
--color-border-strong: #8A7758;   /* Control boundaries — form fields, buttons */

/* Text */
--color-ink:      #1A1612;   /* Near-black with warm undertone */
--color-muted:    #6B5F52;   /* Warm mid-gray — secondary copy */
--color-ghost:    #736044;   /* Captions, metadata, deemphasized labels */

/* Accent — used sparingly, never as fill color */
--color-accent:   #A93C24;   /* Burnt sienna — more restrained than #FF4500 */
--color-accent-2: #2E4A6B;   /* Slate blue — secondary accent for tags/code */

/* Functional */
--color-selection: rgba(169, 60, 36, 0.15);  /* Accent tint for text selection */
```

**Revised in v1.2 for contrast.** The original `--color-ghost` `#A89880` measured **2.48:1**
on `--color-base` — roughly half the AA minimum — and carried the footer, every project year
and descriptor, the hero availability line, and the accordion markers. The original
`--color-accent` `#C84B2F` measured 4.11:1 on base and 3.78:1 on the surface-backed sections,
so section numbers, the timeline years, and the contact form's error message all failed.
This is the failure §11.11 flags against this brief's own palette.

Ratios below are measured **after** the §3.3 grain overlay composites over the page — that
veil costs roughly 0.2–0.3 of a ratio point, which is decisive at the margin.

| Token | on `--color-base` | on `--color-surface` |
|---|---|---|
| `--color-ink` | 14.45:1 | 13.33:1 |
| `--color-muted` | 5.12:1 | 4.72:1 |
| `--color-ghost` | 4.98:1 | 4.59:1 |
| `--color-accent` | 5.22:1 | 4.81:1 |
| `--color-accent-2` | 7.38:1 | 6.81:1 |
| `--color-border-strong` | 3.63:1 | 3.34:1 (non-text, needs 3:1) |
| `--color-border` | 1.43:1 | 1.32:1 (decorative only — never a control edge) |

Any new colour used for text must be checked against **both** backgrounds with the veil
applied, not just against `--color-base`.

### 3.2 Usage Rules

- **Accent color appears on no more than 5% of any viewport** — it is a signal, not a wash.
- Accent is used for: section numbering (01, 02, 03...), nav hover underlines, hover states on project titles, and the About drop cap.
- **No dark mode toggle.** The palette is warm and singular. A toggle implies the designer wasn't sure. Commit.
- **Background is never pure white (#FFFFFF) or pure black (#000000).** Both signal digital laziness.

### 3.3 Grain Texture

Apply an SVG-based noise overlay at `opacity: 0.045` over the `--color-base` background. This breaks the "digital plastic" flatness without being visually distracting.

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* feTurbulence noise */
  opacity: 0.045;
  pointer-events: none;
  z-index: 9999;
}
```

---

## 4. Layout System

### 4.1 Core Grid

Not a standard 12-column grid. Instead: a **named-area editorial grid** that allows intentional asymmetry.

```css
.editorial-grid {
  display: grid;
  grid-template-columns:
    [margin-start] 1fr
    [content-start] 2fr
    [feature-start] 5fr
    [feature-end] 2fr
    [content-end] 1fr
    [margin-end];
  column-gap: clamp(1.5rem, 3vw, 3rem);
}
```

- Text columns use `content-start / content-end` (9 of 11 units)
- Full-bleed elements use `margin-start / margin-end`
- Pull-quotes and figures intentionally break to `feature-start / margin-end` — off-balance by design
- Never use `direction: rtl` to swap layout order. Use grid areas or ordering so reading direction stays logical.

### 4.2 Vertical Rhythm

All spacing derives from a base unit: `--space-unit: 0.5rem`

```
--space-xs:   0.5rem   (4px)
--space-sm:   1rem     (8px)
--space-md:   2rem     (16px)
--space-lg:   4rem     (32px)
--space-xl:   8rem     (64px)
--space-2xl: 16rem    (128px) /* Section breathing room */
```

Sections are separated by `--space-2xl` minimum. Whitespace is not wasted space — it is pacing.

### 4.3 Section Numbering Convention

Each major section carries a left-column counter: `01 —`, `02 —`, `03 —`. Set in `Space Mono`, `--step--1`, color `--color-accent`. This creates a documentary/index feeling across the scroll.

---

## 5. Section-by-Section Build Spec

### 5.1 Navigation

**Style:** Minimal top strip. Not sticky. Disappears as you scroll into work.

```
[COLE SNIPES]                                           [work] [about] [contact]
```

- Name in `Cormorant Garamond`, `--step-1`, `--color-ink`
- Nav links in `Space Mono`, `--step--2`, uppercase, `letter-spacing: 0.1em`
- Active link has a 1px `--color-accent` underline, not bold
- No hamburger menu on mobile — links collapse into a horizontal scroll strip

---

### 5.2 Hero

**Objective:** Make the viewer feel something before they read anything.

**Layout sketch:**
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                                                          │
│   01 —                                                   │
│                                                          │
│              COLE                                        │
│              SNIPES                  ←  oversized        │
│                                         kinetic serif    │
│                    ───────────────────────────────────   │
│                    Frontend Engineer. Systems thinker.   │
│                    Building interfaces that earn trust.  │
│                                                          │
│                    Indianapolis → Available for work     │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Rules:**
- Name is `--step-5`, `Cormorant Garamond`, weight 300 (light). The *thinness* creates elegance, not weakness.
- Subtitle is `Space Mono`, `--step-0`, `--color-muted`
- The rule line (`───`) is a 1px `--color-border` `<hr>` element, not a decorative SVG
- No CTA button. The scroll is the call to action.
- On load: name slides up from `translateY(24px)` over 700ms `cubic-bezier(0.16, 1, 0.3, 1)`. No bounce, no spring theater.

---

### 5.3 Work / Projects

**Layout:** Each project alternates between left-weighted and right-weighted layout. Never a uniform grid.

**Project Card Structure:**
```
┌─────────────────────────────────────────────────────────┐
│  02 — WORK                                              │
│                                                         │
│  ┌──────────────────────┐                               │
│  │                      │   KSPT Curricular             │
│  │   [project image]    │   Command Center      ────── │
│  │                      │                              │
│  │                      │   SvelteKit · Firebase        │
│  │                      │   Gemini AI · 2025            │
│  └──────────────────────┘                               │
│                                                         │
│   GOAL ─────────────────────────────────────────────── │
│   Map DPT curriculum to CAPTE standards — a process     │
│   that previously lived in disconnected spreadsheets.   │
│                                                         │
│   PROCESS ─────────────────────────────────────────── │
│   Built a SvelteKit 2 frontend with Svelte 5 reactivity,│
│   designing component architecture around accreditation  │
│   data models before writing a single line of UI code.  │
│                                                         │
│   RESULT ──────────────────────────────────────────── │
│   Reduced manual mapping time by ~60%. Deployed on      │
│   Firebase with Google OAuth and real-time sync.        │
└─────────────────────────────────────────────────────────┘
```

**Rules:**
- Section labels (`GOAL`, `PROCESS`, `RESULT`) are `Space Mono`, uppercase, with a 1px `--color-border` rule extending to the right margin
- Project title is `Cormorant Garamond Italic`, `--step-2`
- Tech stack tags are `Space Mono`, `--step--2`, padded with a 1px `--color-accent-2` border. No filled chips.
- Project images use `mix-blend-mode: multiply` over a `--color-surface` background — photographs gain warmth, mockups integrate naturally
- No "View Project" buttons with arrows. The project title itself is the link — underline appears on hover.

---

### 5.4 About

**Not a biography. A position statement.**

**Copy direction:**
```
I write code that makes difficult information feel navigable.

Most of my work sits at the boundary between data systems
and the people who need to trust them — accreditation 
committees, educators, students. The interface is often
the only part they see.

I care about what happens after deployment.
```

**Layout:** Single column, `60ch` max-width, centered in the `feature` column. Large initial cap on the first word using `::first-letter`. No headshot unless it is high-quality editorial photography — a blurry profile photo does more harm than no photo.

---

### 5.5 Contact

**Keep it austere.**

```
03 — CONTACT

Let's work together.

cole@[domain].com
github.com/c4snipes
linkedin.com/in/[handle]
```

- No contact form. Email is direct and intentional.
- Links are bare text in `Space Mono`. No icons.
- A single horizontal rule separates this from the footer.

---

### 5.6 Footer

```
Cole Snipes — Indianapolis, IN          Built without Lorem Ipsum. © 2025.
```

One line. `Space Mono`, `--step--2`, `--color-ghost`. Full-width. That's it.

---

## 6. Motion & Interaction

### 6.1 Principles

- **Motion has one job:** reveal structure. It should never distract or perform.
- **One entrance animation** on the hero (name, then subtitle, staggered by 120ms). Everything else appears at scroll entry, no animation.
- **No JS-driven choreography** for simple reveals. Use CSS keyframes or transitions.
- **Scroll-triggered:** Sections fade from `opacity: 0` to `opacity: 1` with `translateY(16px → 0)` over 500ms when they enter the viewport. Use `IntersectionObserver`, not a scroll event listener.
- **No looping animations** anywhere on the page unless the user explicitly has reduced motion disabled.
- Always respect `prefers-reduced-motion: reduce`. When set, disable all transforms; crossfades are allowed.

### 6.2 Hover States

| Element | Hover Behavior |
|---|---|
| Nav links | 1px `--color-accent` underline slides in from left over 200ms |
| Project titles | `--color-ink` → `--color-accent`, no underline |
| Project images | `scale(1.02)` over 400ms `ease-out`, `box-shadow` depth increase |
| Contact links | Strikethrough appears then disappears in 150ms — a typographic wink |
| Body text links | Underline color transitions from `--color-border` → `--color-accent` |

### 6.3 Cursor

No custom cursor. The system cursor is the UI contract — keep it. Never hide it with `cursor: none` or replace it with DOM elements. If emphasis is needed, use hover and focus styles on the element itself.

---

## 7. Technical Stack

### 7.1 Recommended

- **Framework:** SvelteKit 2 — you know it deeply, it ships fast HTML, no unnecessary client JS
- **Styling:** Native CSS custom properties (no Tailwind — the utility class names visible in DevTools reduce perceived craft)
- **Fonts:** Load via `@font-face` from a self-hosted or `fonts.googleapis.com` import, with `font-display: swap`
- **Images:** WebP with AVIF fallback, lazy-loaded with native `loading="lazy"`. No placeholder blur hashes unless you implement them properly.
- **Hosting:** Netlify or Vercel. Set `Cache-Control: public, max-age=31536000, immutable` on static assets.
- **Analytics:** Plausible (privacy-first) or nothing. Do not use Google Analytics on a portfolio — it signals you haven't thought about this.

### 7.2 Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 95 |
| First Contentful Paint | < 1.2s |
| Cumulative Layout Shift | < 0.05 |
| Total JS (uncompressed) | < 50KB |
| Largest Contentful Paint | < 2.0s |

A portfolio that scores 72 on Lighthouse is a self-own.

### 7.3 Accessibility

- All color combinations must pass WCAG AA contrast (4.5:1 for body, 3:1 for large text)
- Focus states must be visible and styled — `outline: 2px solid var(--color-accent)` with `outline-offset: 3px`
- All images require descriptive `alt` text
- Semantic HTML: `<nav>`, `<main>`, `<article>` for each project, `<footer>`
- Font sizes never below `0.75rem` (12px) on any viewport

---

## 8. Copy & Voice Guidelines

### 8.1 Tone

The writing sounds like a senior engineer explaining their work to an intelligent non-technical stakeholder. Not academic. Not casual. **Precise and dry, with occasional wit.**

### 8.2 Copy Formulas to Avoid

| Cliché | Replace with |
|---|---|
| "Passionate developer" | Name the specific domain you care about |
| "I love solving problems" | Describe a specific problem you solved |
| "Full-stack developer" | Say what kind of full-stack (frontend-weighted, data-heavy, etc.) |
| "Seeking new opportunities" | State what kind of work you want, specifically |
| "Let's connect!" | "Let's work together." or just the email address |
| "Built with [10 logos]" | Name the technologies in prose, in context |

### 8.3 Project Copy Template

```
[Project Name]                [1–2 word descriptor, e.g. "Accreditation Tool"]

GOAL
One or two sentences. What was the real problem, not the feature list.
Who was harmed by the problem existing?

PROCESS
Two to four sentences. What was the interesting decision?
What would a different engineer have done that you didn't?
What did you learn that changed the approach mid-build?

RESULT
One to two sentences. Measurable if possible. Honest if not.
What can someone do now that they couldn't before?
```

---

## 9. Build Sequence

Follow this order strictly. Reviewing each phase before moving to the next prevents design drift.

```
Phase 1 — Foundation
  ├── CSS custom properties (all tokens defined)
  ├── Font imports verified and rendering correctly
  ├── Grain texture overlay working
  └── Base typographic scale visually verified on all viewports

Phase 2 — Navigation + Hero
  ├── Nav layout and hover states
  ├── Hero name sizing and entrance animation
  ├── Hero subtitle and rule line
  └── Spacing review: does it breathe?

Phase 3 — First Project Entry
  ├── Project card layout (one card only)
  ├── GOAL / PROCESS / RESULT label treatment
  ├── Image blend mode
  └── Hover states on title and image

Phase 4 — Full Projects Section
  ├── Alternating left/right layout rhythm
  ├── Section numbering system
  └── Scroll-triggered reveal on all cards

Phase 5 — About + Contact + Footer
  ├── About copy and first-letter treatment
  ├── Contact link styling
  └── Footer one-liner

Phase 6 — Polish & QA
  ├── Lighthouse audit
  ├── Reduced motion check
  ├── Mobile viewport review (375px, 390px, 428px)
  ├── Focus state audit (tab through entire page)
  └── Copy pass: remove any remaining clichés
```

---

## 10. What Success Looks Like

A recruiter, engineer, or creative director should land on this portfolio and think — in order:

1. *This person has taste.*
2. *This person can write.*
3. *I want to know more about this project.*
4. *I should email this person.*

They should not think: "another developer portfolio." If it looks like it could belong to anyone else, it needs more work.

---

## 11. Vibecoding QA Checklist

Run this against the live build in Phase 6, and periodically after. Anything checked off is a tell that the site was generated and shipped without a second pass.

### 11.1 Visual defaults left untouched
- [ ] Tailwind's stock palette showing through: `blue-500`, `indigo-600`, `violet-500` gradients, especially as button fills or hero backgrounds
- [ ] Uniform `rounded-xl` or `rounded-2xl` on every card, button, and image with no variation in radius logic
- [ ] Soft ambient `box-shadow` glow under every card (the "floating in a void" look)
- [ ] shadcn/ui components used with zero customization, still recognizable as shadcn/ui
- [ ] `backdrop-blur` sticky nav bar, especially paired with a semi-transparent white/black background
- [ ] Icon-plus-heading feature grids (icon, bold title, one-line description, repeated 3-4 times) — the single most common AI-scaffolded section
- [ ] Every heading using the same weight and size relationship as every other heading, so the page has no real hierarchy despite lots of headings

### 11.2 Motion tells
- [ ] `framer-motion` (or equivalent) fade+slide-up applied uniformly to every section with identical timing, so the whole page scrolls like a slideshow
- [ ] Stat counters that count up on scroll for numbers that don't need drama (e.g., "3 projects")
- [ ] Hover scale-and-shadow on literally every interactive element, same values throughout

### 11.3 Code/structural tells (visible in DevTools or view-source)
- [ ] Default `<title>` still reading the framework's scaffold name, unedited
- [ ] Meta description missing or still the framework boilerplate
- [ ] Favicon is the framework's default icon
- [ ] Console warnings from unused boilerplate (dev warnings, unhandled config, etc.)
- [ ] Class names that are pure utility soup with no semantic structure underneath, nested five deep
- [ ] No custom CSS variables at all — every value is a raw utility class, so there's no evidence of an actual design system, just accretion

### 11.4 Copy tells
- [ ] Opens with "Welcome to my portfolio" or "I'm passionate about..."
- [ ] Bullet-pointed skill lists with no sentences connecting them to real work
- [ ] Project descriptions that list technologies used but never say what the project does or why it exists
- [ ] Testimonial or "trusted by" sections with no real names, logos, or quotes — clearly scaffolded and never replaced

### 11.5 Structural tells
- [ ] A "Features" or "Services" section on a personal portfolio (that's SaaS-landing-page language, not applicable to one person's work)
- [ ] Fake social proof: star ratings, "100+ happy clients," logo strips of companies you didn't work with
- [ ] Chat widget bubble in the bottom right with no actual chat behind it

### 11.6 Dependency and bundle tells
- [ ] `package.json` with a dozen unused UI libraries (multiple icon packs, two animation libraries, a component kit that's never imported) from generate-then-abandon iterations
- [ ] Total JS bundle well past the 50KB target (Section 7.2), usually from importing an entire icon library instead of tree-shaken individual icons
- [ ] Fonts imported for five weights of three different typefaces when the page only uses two
- [ ] `node_modules` full of packages installed for a feature that got cut, never removed

### 11.7 Form and interaction tells
- [ ] A contact form with no working backend, just a `console.log(formData)` or an `alert("Message sent!")` on submit
- [ ] Newsletter signup field on a personal portfolio, with no actual mailing list behind it
- [ ] Search bar on a five-page personal site
- [ ] Multi-step forms or wizards for something that could be one field

### 11.8 Content-structure tells
- [ ] Placeholder Latin text (Lorem Ipsum) left in a footer or about section, sometimes half-replaced
- [ ] Project count inflated with tutorials, course projects, or forked repos presented at the same weight as real work
- [ ] "Coming soon" sections that have been coming soon since the first deploy
- [ ] Generic stock photography for team/hero images on a one-person site

### 11.9 SEO and metadata tells
- [ ] No Open Graph tags, so link previews show a blank card or the framework default
- [ ] `sitemap.xml` and `robots.txt` either missing or still the scaffolded defaults, sometimes blocking all crawlers by accident
- [ ] Structured data (JSON-LD) either absent or copy-pasted from a template with the wrong `@type`, wrong name, wrong URLs

### 11.10 Rendering and performance tells
- [ ] Layout shift on load because fonts and images aren't preloaded, so text visibly reflows
- [ ] Unoptimized full-resolution PNG screenshots used as project thumbnails, sometimes several MB each
- [ ] No lazy loading below the fold, so every image loads on first paint
- [ ] Lighthouse score noticeably worse on mobile than desktop, meaning it was only ever tested on a wide viewport

### 11.11 Accessibility tells
- [ ] Color contrast failures used decoratively without checking numbers (see the `--color-ghost` issue already flagged against this brief's own palette)
- [ ] Missing or generic `alt` text (`alt="image"`, `alt="project screenshot"`) on every image
- [ ] No visible focus states, so keyboard navigation is invisible
- [ ] Click targets under 44px on mobile, especially nav links crammed into a horizontal strip

### 11.12 Deployment tells
- [ ] Vercel/Netlify preview URL still referenced somewhere (an old share link, a hardcoded API endpoint) instead of the production domain
- [ ] No custom 404 page, so broken links hit the host's default error page
- [ ] HTTP instead of HTTPS somewhere in hardcoded asset URLs
- [ ] Console errors on load from a misconfigured env variable or an API key that was never rotated out of a demo

---

*Document version: 1.2 — Update this brief whenever a design decision is locked in, so it remains the source of truth.*

*1.2 — §3.1 palette revised for WCAG AA; `--color-border-strong` added for control boundaries.*
