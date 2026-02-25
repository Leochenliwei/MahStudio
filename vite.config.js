import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // 允许内网访问
    host: true
  },
  base: '/MahConfig_WebPlatform_2026/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})