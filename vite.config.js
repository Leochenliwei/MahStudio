import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // 允许内网访问
    host: true,
    // API 代理配置
    proxy: {
      '/MajStudio/api': {
        target: 'http://mahjong-studio-admin.test.zonst.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/MajStudio/, '')  // 只去掉 /MajStudio，保留 /api 前缀
      }
    }
  },
  base: '/MajStudio/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})