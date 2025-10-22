import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'path' // Import path

// https://vite.dev/config/
export default defineConfig({
  resolve: { // Add resolve configuration
    alias: {
      '@utils': path.resolve(__dirname, './src/utils'),
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
})
