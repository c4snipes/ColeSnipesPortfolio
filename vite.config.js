import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

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
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
}))
