import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.52vmy.cn',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/api.php': {
        target: 'https://music-api.gdstudio.xyz',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api.php/, '/api.php')
      }
    }
  }
})
