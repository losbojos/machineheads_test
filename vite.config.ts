import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { authProxyPlugin } from './vite-plugins/authProxy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [authProxyPlugin(), react()],
  optimizeDeps: {
    include: ['antd', '@ant-design/icons'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://rest-test.machineheads.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
      },
    },
  },
})
