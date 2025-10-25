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
      <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
        {alerts.map((alert) => {
          const styles = {
            success: {
              gradient: 'from-emerald-500 to-teal-500',
              icon: '✓',
              ring: 'ring-emerald-200',
            },
            error: {
              gradient: 'from-rose-500 to-pink-500',
              icon: '✕',
              ring: 'ring-rose-200',
            },
            warning: {
              gradient: 'from-amber-500 to-orange-500',
              icon: '⚠',
              ring: 'ring-amber-200',
            },
            info: {
              gradient: 'from-blue-500 to-indigo-500',
              icon: 'ℹ',
              ring: 'ring-blue-200',
            },
          }

          const style = styles[alert.type]

          return (
            <div
              key={alert.id}
              className={`
                animate-slide-in-right
                rounded-2xl bg-gradient-to-r ${style.gradient}
                p-4 shadow-2xl backdrop-blur-sm
                ring-4 ${style.ring}
                transform transition-all duration-300
                hover:scale-105 hover:shadow-3xl
              `}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{style.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white leading-relaxed">
                    {alert.message}
                  </p>
                </div>
                <button
                  onClick={() => clearAlert(alert.id)}
                  className="flex-shrink-0 rounded-lg p-1 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                  aria-label="Cerrar alerta"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
