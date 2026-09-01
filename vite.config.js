import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

/**
 * React is aliased to preact/compat at build time.
 *
 * The design brief (§7.2) sets a hard budget of <50KB of uncompressed JS. React +
 * ReactDOM alone is ~178KB, so the target is unreachable on React no matter what
 * the app code does. Preact implements the same API surface this site uses —
 * hooks, class components with getDerivedStateFromError/componentDidCatch,
 * createRoot, StrictMode — in roughly a tenth of the bytes.
 *
 * Nothing in src/ changes: every file still imports from 'react'. Only the
 * resolution target moves. To go back to React, delete this alias block and
 * reinstall react + react-dom — no component edits required.
 *
 * Order matters. The list is matched top-down, so the more specific
 * 'react-dom/…' and 'react/…' entries must precede the bare package names,
 * otherwise 'react' would swallow 'react/jsx-runtime' first.
 */
const preactAliases = [
  { find: /^react-dom\/test-utils$/, replacement: 'preact/test-utils' },
  // createRoot lives in preact/compat/client, NOT preact/compat. Pointing this
  // at preact/compat builds cleanly and then blanks the page at runtime with
  // "createRoot is not a function".
  { find: /^react-dom\/client$/,     replacement: 'preact/compat/client' },
  { find: /^react-dom$/,             replacement: 'preact/compat' },
  { find: /^react\/jsx-runtime$/,     replacement: 'preact/jsx-runtime' },
  { find: /^react\/jsx-dev-runtime$/, replacement: 'preact/jsx-dev-runtime' },
  { find: /^react$/,                 replacement: 'preact/compat' },
]

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      filename: 'dist/bundle-report.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: preactAliases,
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
}))
