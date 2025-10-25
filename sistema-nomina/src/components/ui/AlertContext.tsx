import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

interface Alert {
  id: string
  type: AlertType
  message: string
}

interface AlertContextType {
  showAlert: (type: AlertType, message: string) => void
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
  alerts: Alert[]
  clearAlert: (id: string) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const showAlert = useCallback((type: AlertType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setAlerts((prev) => [...prev, { id, type, message }])

    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id))
    }, 5000)
  }, [])

  const clearAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  const showSuccess = useCallback((message: string) => {
    showAlert('success', message)
  }, [showAlert])

  const showError = useCallback((message: string) => {
    showAlert('error', message)
  }, [showAlert])

  const showWarning = useCallback((message: string) => {
    showAlert('warning', message)
  }, [showAlert])

  const showInfo = useCallback((message: string) => {
    showAlert('info', message)
  }, [showAlert])

  return (
    <AlertContext.Provider value={{ showAlert, showSuccess, showError, showWarning, showInfo, alerts, clearAlert }}>
      {children}
      <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm sm:max-w-md">
        {alerts.map((alert) => {
          // Diseño azul premium uniforme para todas las alertas
          const styles = {
            success: {
              gradient: 'from-blue-500 via-blue-600 to-indigo-600',
              icon: '✓',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-600',
            },
            error: {
              gradient: 'from-blue-500 via-blue-600 to-indigo-600',
              icon: '✕',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-600',
            },
            warning: {
              gradient: 'from-blue-500 via-blue-600 to-indigo-600',
              icon: '⚠',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-600',
            },
            info: {
              gradient: 'from-blue-500 via-blue-600 to-indigo-600',
              icon: 'ℹ',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-600',
            },
          }

          const style = styles[alert.type]

          return (
            <div
              key={alert.id}
              className={`
                animate-slide-in-right
                rounded-2xl bg-gradient-to-r ${style.gradient}
                p-4 sm:p-5 shadow-2xl
                ring-4 ring-blue-200/50
                transform transition-all duration-300
                hover:scale-[1.02] hover:shadow-3xl
              `}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`
                  flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10
                  rounded-full ${style.iconBg}
                  flex items-center justify-center
                  shadow-lg ring-2 ring-white/40
                `}>
                  <span className={`text-lg sm:text-xl font-bold ${style.iconColor}`}>
                    {style.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-white leading-relaxed drop-shadow-sm">
                    {alert.message}
                  </p>
                </div>
                <button
                  onClick={() => clearAlert(alert.id)}
                  className="flex-shrink-0 rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 hover:rotate-90"
                  aria-label="Cerrar alerta"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </AlertContext.Provider>
  )
}

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}
