// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import Providers from './app/providers'
import { router } from './app/router'
import './index.css'
import { ToastProvider } from './components/ui/Toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Toast global (una sola vez) */}
    <ToastProvider>
      {/* Tus demás providers (QueryClient, Theme, Auth, etc.) */}
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ToastProvider>
  </React.StrictMode>
)
