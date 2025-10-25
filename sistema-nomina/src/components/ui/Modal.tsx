import { useEffect } from 'react'


export type ModalType = 'success' | 'error' | 'warning' | 'info'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  type: ModalType
  title: string
  message: string
  solution?: string
}

export default function Modal({ isOpen, onClose, type, title, message, solution }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const styles = {
    success: {
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      icon: '✓',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      ring: 'ring-emerald-200',
    },
    error: {
      gradient: 'from-rose-500 via-pink-500 to-red-500',
      icon: '✕',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      ring: 'ring-rose-200',
    },
    warning: {
      gradient: 'from-amber-500 via-orange-500 to-yellow-500',
      icon: '⚠',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      ring: 'ring-amber-200',
    },
    info: {
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      icon: 'ℹ',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      ring: 'ring-blue-200',
    },
  }

  const style = styles[type]

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop borroso */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      
      {/* Modal Card */}
      <div 
        className={`
          relative z-10 w-full max-w-md sm:max-w-lg
          bg-white rounded-3xl shadow-2xl
          ring-4 ${style.ring}
          animate-scale-in
          transform transition-all duration-300
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con gradiente */}
        <div className={`relative overflow-hidden rounded-t-3xl bg-gradient-to-r ${style.gradient} p-6 sm:p-8`}>
          {/* Patrón de fondo decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="relative flex items-center gap-4">
            {/* Icono circular */}
            <div className={`
              flex-shrink-0 h-14 w-14 sm:h-16 sm:w-16
              rounded-full ${style.iconBg}
              flex items-center justify-center
              shadow-lg ring-4 ring-white/30
            `}>
              <span className={`text-2xl sm:text-3xl font-bold ${style.iconColor}`}>
                {style.icon}
              </span>
            </div>
            
            {/* Título */}
            <h3 className="flex-1 text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
              {title}
            </h3>

            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-full p-2 text-white/80 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Cerrar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 sm:p-8 space-y-4">
          {/* Mensaje principal */}
          <p className="text-sm sm:text-base leading-relaxed text-gray-700">
            {message}
          </p>

          {/* Solución sugerida (opcional) */}
          {solution && (
            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-l-4 border-indigo-400">
              <p className="text-xs sm:text-sm font-medium text-indigo-900">
                💡 <strong>Solución:</strong> {solution}
              </p>
            </div>
          )}

          {/* Botón de acción */}
          <button
            onClick={onClose}
            className={`
              w-full rounded-xl
              bg-gradient-to-r ${style.gradient}
              px-6 py-3 sm:py-4
              text-sm sm:text-base font-semibold text-white
              shadow-lg hover:shadow-xl
              transform hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200
            `}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
