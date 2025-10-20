import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5009', // Tu backend en HTTP
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:5009', // También apuntar al mismo backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
