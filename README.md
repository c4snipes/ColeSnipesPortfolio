# Cole Snipes — Portfolio

Personal portfolio for Cole Snipes, a Computer Science graduate of the University of
Indianapolis (B.S., May 2026, concentration in Software Engineering). Single-page,
editorial in tone, built to read like a printed monograph rather than a SaaS landing page.

**Live:** [colesnipes.dev](https://colesnipes.dev)

---

## Design brief

`ANTI-VIBECODING-PORTFOLIO.md` is the source of truth for the design system — palette,
type scale, motion rules, performance targets, and a QA checklist. Several source files
reference it by section number. Read it before changing anything visual.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 8 |
| Styling | Hand-written CSS with custom properties — no Tailwind, no UI kit |
| Fonts | Cormorant Garamond + Space Mono (Google Fonts, `display=swap`) |
| Contact form | Web3Forms, called directly from the browser |
| Analytics | Vercel Analytics + Speed Insights |
| Hosting | Vercel |

There is no backend and no `api/` directory. The contact form POSTs straight to the
Web3Forms API from the client; the access key is public by design. Rate limiting is a
client-side courtesy guard in `localStorage`, not a security control.

---

## Sections

Rendered in this order, matching the `01 —` … `06 —` counters printed on the page:

1. Hero
2. Tech Stack
3. Work
4. Timeline
5. About
6. Contact

---

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server on :3000, opens a browser
npm run build    # production build to dist/
npm run preview  # serve the production build locally
npm run analyze  # build with a bundle treemap at dist/bundle-report.html
```

---

## Content

All copy and project data live in `src/data/`:

- `projects.json` — Work section. Each entry is goal / process / result, not a feature list.
- `timeline.json` — Timeline entries. Order is computed at render time, so entries can be
  added in any order.
- `stack.json` — Tech Stack accordions.
- `site.js` — identity and off-site URLs. Add links here rather than inline, so the hero
  and the contact block cannot disagree.

Project images live in `public/assets/projects/`, authored at 1200×800 and served as WebP.
Two are real screenshots of running software (KSPT, and this site). The other seven are
typographic plates carrying that project's headline figure — a CLI tool or a Colab notebook
has no interface to photograph, and a mocked-up one would be dishonest. Regenerate or
replace any of them freely; each project's `imageAlt` in `projects.json` must be updated
to match whatever the image actually shows.

---

## Resume

`resume/Cole_Snipes_Resume.html` is the source for `public/assets/Cole_Snipes_Resume.pdf`.
Edit the HTML, then regenerate:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --no-pdf-header-footer --print-to-pdf=public/assets/Cole_Snipes_Resume.pdf \
  resume/Cole_Snipes_Resume.html
```

It is deliberately single-column with standard section headings and real selectable text, so
applicant tracking systems can parse it. Keep it to one page — check the page count after
regenerating. `vercel.json` serves the PDF with `max-age=0, must-revalidate`, so an updated
resume reaches visitors immediately instead of being cached for a year.

---

## Contact

- Email: [cole.snipes@icloud.com](mailto:cole.snipes@icloud.com)
- LinkedIn: [linkedin.com/in/cole-snipes](https://www.linkedin.com/in/cole-snipes/)
- GitHub: [github.com/c4snipes](https://github.com/c4snipes)
