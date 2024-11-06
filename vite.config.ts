import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import liveReload from 'vite-plugin-live-reload';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    liveReload('dist/**', { alwaysReload: true })
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        // entryFileNames: '[name].js',
        // entryFileNames: '[name]-[hash].js',
        // chunkFileNames: '[name]-[hash].js',
        // chunkFileNames: '[name].js',
        // assetFileNames: '[name]-[hash][extname]',
      }
    },
    watch: {
      include: 'src/**',
      exclude: 'node_modules/**',
    }
  },
  base: './',
})
