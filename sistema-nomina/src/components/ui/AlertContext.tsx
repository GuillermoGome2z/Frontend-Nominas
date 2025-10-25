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
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg shadow-lg transition-all ${
              alert.type === 'success' ? 'bg-green-500 text-white' :
              alert.type === 'error' ? 'bg-red-500 text-white' :
              alert.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{alert.message}</span>
              <button
                onClick={() => clearAlert(alert.id)}
                className="ml-4 text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
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
