# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Start dev server (port 3000, auto-opens browser)
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
```

## Architecture

This is a React 18 portfolio site built with Vite. Key architectural decisions:

**Routing** (React Router DOM v7):
- `/` - Home (hero, about, featured projects, contact)
- `/projects` - Searchable/filterable project gallery
- `/skills` - Skills radar visualization
- `/coursework` - Academic courses

**State Management**:
- `AchievementContext` (src/context/) - Achievement system persisted to localStorage
- `useTheme` hook - Dark/light theme toggle with system preference detection
- localStorage keys: theme, achievements, visited pages, viewed projects

**Key Libraries**:
- **Framer Motion** - All animations (page transitions, scroll-triggered, parallax)
- **Three.js** via @react-three/fiber - 3D hero section (desktop only, lazy-loaded)
- **Recharts** - Skills radar chart visualization

**Component Organization**:
- `src/components/Layout.jsx` - Wraps all routes, handles achievement tracking
- `src/components/ThreeHero/` - 3D background with CSS orb fallback for mobile
- `src/data/` - Static JSON for projects, skills, coursework; JS for achievements

**Performance Patterns**:
- ThreeHero is lazy-loaded with Suspense (only on desktop without reduced-motion)
- Theme applied via script in index.html before React hydration to prevent FOUC
- Project/tag filtering uses useMemo
- Animations use whileInView to only animate visible elements

## Design System

Uses Tokyo Night color theme with CSS custom properties defined in `src/index.css`. Theme toggle affects `--bg`, `--text`, `--accent` variables.

Fonts: Inter (body), JetBrains Mono (code/terminal), Space Grotesk (headings).
