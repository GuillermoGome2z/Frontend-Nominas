import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7187',
        changeOrigin: true,
        secure: false, // cert de desarrollo .NET
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/health': {
        target: 'https://localhost:7187',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
