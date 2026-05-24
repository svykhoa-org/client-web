import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  define: {
    // Polyfill cho draft.js (global is not defined)
    global: 'window',
  },
  plugins: [react(), tsConfigPaths(), tailwindcss()],
})
