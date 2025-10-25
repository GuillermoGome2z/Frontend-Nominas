import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useToast } from '../../components/ui/Toast'
import SRLiveRegion from '../../components/ui/SRLiveRegion'
import AuthDebug from '../debug/AuthDebug'

/** Puente: escucha eventos globales y dispara tu sistema de toasts */
function ToastBridge() {
  const toast = useToast() as any

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{
        kind: 'success' | 'info' | 'warning' | 'error'
        message: string
        title?: string
      }>
      const { kind, message, title } = ce.detail || {}
      if (!kind || !message) return

      if (typeof toast?.[kind] === 'function') {
        toast[kind](message, title)
      } else if (typeof toast?.push === 'function') {
        toast.push(message, kind)
      } else if (typeof toast?.show === 'function') {
        toast.show({ kind, message, title })
      } else {
        console.warn('ToastBridge: no hay métodos para mostrar toast.', { kind, message, title })
      }
    }

    window.addEventListener('app:toast', handler as EventListener)
    return () => window.removeEventListener('app:toast', handler as EventListener)
  }, [toast])

  return null
}

export default function AppLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
      <Topbar onMenu={() => setOpen(true)} />
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* espacio para sidebar fijo */}
      <div className="lg:pl-64">
        <main role="main" className="p-4 sm:p-6">
          <div className="mx-auto max-w-7xl animate-[fadeIn_.25s_ease-out]">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastBridge />
      <SRLiveRegion />
      <AuthDebug />
    </div>
  )
}
