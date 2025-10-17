import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../../lib/http'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from './useAuthStore'

const schema = z.object({
  username: z.string().email('Ingrese un correo válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const { errors, isSubmitting } = formState

  const onSubmit = async (data: FormData) => {
    const res = await api.post('/auth/login', data)
    login(res.data.token, res.data.role)
    window.location.href = '/'
  }
  const navigate = useNavigate()
  

  return (
    <div className="min-h-screen w-full text-slate-800 flex flex-col relative">
      {/* HEADER */}
    <header className="h-16 md:h-20 bg-gradient-to-r from-[#163a6a] to-[#2a4f7c] text-white shadow relative z-20">
      <div className="h-full w-full flex items-center justify-between px-2 md:px-4">
        <div className="flex items-center gap-3">
          <img
            src="/img/logo-umg.png"
            alt="UMG"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/10 p-1 object-contain"
          />
          <div className="leading-4">
            <p className="text-sm md:text-base font-bold uppercase opacity-95 tracking-wide">
              UNIVERSIDAD MARIANO GALVEZ
            </p>
            <p className="text-sm md:text-base font-bold uppercase opacity-95 tracking-wide">DE GUATEMALA</p>
          </div>
        </div>
        <img
          src="/user-icon.svg"
          alt="Usuario"
          className="h-5 w-5 opacity-80 hidden sm:block"
        />
      </div>
    </header>

  {/* Background image full-screen behind header and main */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat"
        style={{
          backgroundImage: "url('/img/login.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      />
      {/* overlay removed to display original image */}

  {/* MAIN */}
  <main className="flex-1 flex items-center justify-center px-4 relative z-20">
        <div className="w-full max-w-lg text-center">
          {/* Escudo (usado solo en header) */}
          {/* Icono de usuario centrado */}
          <div className="mb-4">
            <UserIcon className="h-20 w-20 md:h-24 md:w-24 mx-auto text-[#2a4f7c]" />
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-5xl font-bold mb-8 text-slate-700">
            Iniciar Sesión
          </h1>

          {/* Card del formulario */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-2 py-4 space-y-5"
          >
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Correo"
                autoComplete="username"
                className="w-full rounded-md border border-slate-300 bg-white px-3 pr-14 py-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2a4f7c]"
                {...register('username')}
              />
              <MessageIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-500" />
              {errors.username && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                autoComplete="current-password"
                className="w-full rounded-md border border-slate-300 bg-white px-3 pr-14 py-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2a4f7c]"
                {...register('password')}
              />
              <LockIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-500" />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Botón */}
            <div className="flex items-center gap-2 text-sm">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <span className="ml-2 text-sm text-slate-700">Mostrar contraseña</span>
              </label>
            </div>

      {/* Botón */}
      <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-3 rounded-md bg-[#2a4f7c] text-white font-semibold text-lg shadow hover:brightness-110 transition disabled:opacity-60"
            >
              {isSubmitting ? 'Ingresando…' : 'INGRESAR'}
            </button>

            {/* Link */}
            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-[#2a4f7c] hover:underline"
              >
                ¿Olvidó su contraseña?
              </button>
            </div>
          </form>
          

          {/* Footer */}
          <p className="mt-10 text-xs text-slate-600 text-center">
            2025 Sistema de Nomina y Gestion de Recursos Humanos - UMG
          </p>
        </div>
      </main>
    </div>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V7a4 4 0 10-8 0v4M7 11h10a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a2 2 0 012-2z"
      />
    </svg>
  )
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13A2.5 2.5 0 0 0 21 15.5v-7A2.5 2.5 0 0 0 18.5 6h-13A2.5 2.5 0 0 0 3 8.5z"
      />
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8l-9 6-9-6"
      />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className}>
      <circle cx="32" cy="20" r="10" strokeWidth="2" />
      <path d="M8 54c0-10 8-18 24-18s24 8 24 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
