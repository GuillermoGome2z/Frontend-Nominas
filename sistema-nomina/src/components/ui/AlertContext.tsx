import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';/**

 * AlertContext - Contexto global para manejar alertas flotantes

export type AlertType = 'success' | 'error' | 'warning' | 'info'; * Permite mostrar errores y mensajes importantes desde cualquier componente

 */

interface Alert {

  id: string;import { createContext, useContext, useState, useCallback } from 'react'

  type: AlertType;import type { ReactNode } from 'react'

  message: string;import FloatingAlert from './FloatingAlert'

}import type { AlertType } from './FloatingAlert'



interface AlertContextType {interface AlertConfig {

  showAlert: (type: AlertType, message: string) => void;  type: AlertType

  alerts: Alert[];  title: string

  clearAlert: (id: string) => void;  message?: string

}  autoClose?: number

  actions?: Array<{

const AlertContext = createContext<AlertContextType | undefined>(undefined);    label: string

    onClick: () => void

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {    variant?: 'primary' | 'secondary' | 'danger'

  const [alerts, setAlerts] = useState<Alert[]>([]);  }>

}

  const showAlert = useCallback((type: AlertType, message: string) => {

    const id = Math.random().toString(36).substr(2, 9);interface AlertContextValue {

    setAlerts((prev) => [...prev, { id, type, message }]);  showAlert: (config: AlertConfig) => void

  showError: (title: string, message?: string) => void

    // Auto-dismiss after 5 seconds  showWarning: (title: string, message?: string) => void

    setTimeout(() => {  showInfo: (title: string, message?: string) => void

      setAlerts((prev) => prev.filter((alert) => alert.id !== id));  showSuccess: (title: string, message?: string) => void

    }, 5000);  closeAlert: () => void

  }, []);}



  const clearAlert = useCallback((id: string) => {const AlertContext = createContext<AlertContextValue | null>(null)

    setAlerts((prev) => prev.filter((alert) => alert.id !== id));

  }, []);export function useAlert() {

  const context = useContext(AlertContext)

  return (  if (!context) {

    <AlertContext.Provider value={{ showAlert, alerts, clearAlert }}>    throw new Error('useAlert must be used within AlertProvider')

      {children}  }

      <div className="fixed top-4 right-4 z-50 space-y-2">  return context

        {alerts.map((alert) => (}

          <div

            key={alert.id}interface AlertProviderProps {

            className={`p-4 rounded-lg shadow-lg transition-all ${  children: ReactNode

              alert.type === 'success' ? 'bg-green-500 text-white' :}

              alert.type === 'error' ? 'bg-red-500 text-white' :

              alert.type === 'warning' ? 'bg-yellow-500 text-white' :export function AlertProvider({ children }: AlertProviderProps) {

              'bg-blue-500 text-white'  const [alert, setAlert] = useState<(AlertConfig & { isOpen: boolean }) | null>(null)

            }`}

          >  const showAlert = useCallback((config: AlertConfig) => {

            <div className="flex items-center justify-between">    setAlert({ ...config, isOpen: true })

              <span>{alert.message}</span>  }, [])

              <button

                onClick={() => clearAlert(alert.id)}  const closeAlert = useCallback(() => {

                className="ml-4 text-white hover:text-gray-200"    setAlert((prev) => (prev ? { ...prev, isOpen: false } : null))

              >  }, [])

                ✕

              </button>  const showError = useCallback(

            </div>    (title: string, message?: string) => {

          </div>      showAlert({ type: 'error', title, message })

        ))}    },

      </div>    [showAlert]

    </AlertContext.Provider>  )

  );

};  const showWarning = useCallback(

    (title: string, message?: string) => {

export const useAlert = (): AlertContextType => {      showAlert({ type: 'warning', title, message })

  const context = useContext(AlertContext);    },

  if (!context) {    [showAlert]

    throw new Error('useAlert must be used within an AlertProvider');  )

  }

  return context;  const showInfo = useCallback(

};    (title: string, message?: string) => {

      showAlert({ type: 'info', title, message })
    },
    [showAlert]
  )

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showAlert({ type: 'success', title, message, autoClose: 3000 })
    },
    [showAlert]
  )

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        showError,
        showWarning,
        showInfo,
        showSuccess,
        closeAlert
      }}
    >
      {children}
      {alert && (
        <FloatingAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          isOpen={alert.isOpen}
          onClose={closeAlert}
          autoClose={alert.autoClose}
          actions={alert.actions}
        />
      )}
    </AlertContext.Provider>
  )
}
