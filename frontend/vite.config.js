import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    // This ensures all routes fallback to index.html for SPA routing
    middlewareMode: false,
  },
  build: {
    // Ensure proper routing in production
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
