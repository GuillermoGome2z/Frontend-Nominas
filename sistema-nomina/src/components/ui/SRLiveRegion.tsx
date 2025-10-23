// src/components/ui/SRLiveRegion.tsx
import { useEffect, useState } from 'react'

/**
 * ANUNCIADOR ACCESIBLE (Screen Reader Live Region)
 * 
 * Permite anunciar mensajes dinámicamente a lectores de pantalla
 * sin interrumpir la navegación del usuario.
 * 
 * USO:
 * 1. Coloca <SRLiveRegion /> en AppLayout o raíz
 * 2. Emite evento: window.dispatchEvent(new CustomEvent('sr:announce', { detail: { message: 'Guardado exitoso' } }))
 */

type Announcement = {
  id: number
  message: string
}

export default function SRLiveRegion() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ message?: string }>
      const msg = ce.detail?.message
      if (!msg || typeof msg !== 'string') return

      const id = Date.now()
      setAnnouncements((prev) => [...prev, { id, message: msg }])

      // Limpiar después de 3 segundos para evitar acumulación
      setTimeout(() => {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id))
      }, 3000)
    }

    window.addEventListener('sr:announce', handler)
    return () => window.removeEventListener('sr:announce', handler)
  }, [])

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      role="status"
      className="sr-only"
    >
      {announcements.map((a) => (
        <span key={a.id}>{a.message}</span>
      ))}
    </div>
  )
}

/**
 * HELPER para emitir anuncios desde cualquier lugar
 */
export function announce(message: string) {
  window.dispatchEvent(
    new CustomEvent('sr:announce', { detail: { message } })
  )
}
