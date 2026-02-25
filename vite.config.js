import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // 允许内网访问
    host: true
  },
  base: '/MahStudio/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})