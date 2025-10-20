import React, { useState } from 'react'
import { api } from '../../lib/http'
import { useNavigate } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/auth/forgot', { email })
    } catch {
      // ignore in mock
    }
    setShowModal(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="fixed inset-0 z-0 bg-no-repeat bg-center bg-cover" style={{ backgroundImage: "url('/img/login2.png')" }} />

  <div className="max-w-md w-full relative z-20 -translate-y-40 md:-translate-y-64">
        {!showModal && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-center text-3xl font-semibold mb-4">¿Olvidó su contraseña?</h2>

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Dirección de correo</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-300" placeholder="correo@dominio.com" required />
              </div>

              <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md text-lg font-medium transition-colors">Enviar correo</button>
            </form>

            <div className="mt-4 text-center">
              <button type="button" onClick={() => navigate('/login')} className="text-sm text-blue-600 hover:underline">Volver a Iniciar sesión</button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
              <button className="absolute top-3 right-3 text-gray-600" onClick={() => setShowModal(false)} aria-label="Cerrar">✕</button>
              <h3 className="text-xl font-semibold mb-3">Se ha enviado el correo electrónico</h3>
              <p className="text-sm text-gray-600 mb-4">Revisa el buzón de entrada de tu correo electrónico para obtener el enlace de recuperación de contraseñas. No olvides revisar tu carpeta de correo no deseado.</p>
              <div className="text-left">
                <button type="button" onClick={() => { setShowModal(false); navigate('/login') }} className="text-sm text-blue-600 hover:underline">Volver a Iniciar sesión</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
