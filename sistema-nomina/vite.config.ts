import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: 'localhost', // Volver a localhost para que coincida con CORS
    // NO usar proxy - conectar directamente al backend
    // El frontend hará peticiones directas a http://localhost:5009/api
  },
})
