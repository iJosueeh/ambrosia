import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@utils': path.resolve(process.cwd(), './src/utils'),
      '@shared': path.resolve(process.cwd(), './src/shared'),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ],
    },
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})