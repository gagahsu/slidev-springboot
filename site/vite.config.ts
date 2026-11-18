import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import deck from './plugins/deck.ts'

export default defineConfig({
  // relative base + hash routing: works on any static host / sub-path
  base: './',
  publicDir: '../public',
  plugins: [deck({ coursesDir: '../courses', tracksDir: '../tracks' }), vue(), UnoCSS()],
  server: { port: 3040, fs: { allow: ['..'] } },
  build: { chunkSizeWarningLimit: 1500 },
})
