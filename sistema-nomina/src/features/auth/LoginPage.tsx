import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { api } from '../../lib/http'
import { useAuthStore } from './useAuthStore'
import { mapBackendRole } from '../../lib/roles'
import { useState } from 'react'

const LoginSchema = z.object({
  identity: z.string().min(3, 'Ingresa tu usuario o correo').max(100, 'Muy largo'),
  password: z.string().min(4, 'La contraseña es requerida'),
})
type LoginValues = z.infer<typeof LoginSchema>

// 👇 Ajustado a lo que devuelve tu backend (minúsculas)
type LoginResponse = {
  token: string
  rol: string
  nombreUsuario?: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location?.state?.from?.pathname ?? '/'

  const loginStore = useAuthStore((s) => s.login)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { identity: '', password: '' },
  })

  const mutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (values: LoginValues) => {
      const payload = {
        Correo: values.identity,
        ['Contraseña']: values.password,
      }
      const res = await api.post<LoginResponse>('/Auth/login', payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      return res.data
    },
    onSuccess: (data) => {
      // 👇 Leemos minúsculas y mapeamos el rol
      const token = data.token
      const role = mapBackendRole(data.rol)

      if (!token) {
        setServerError('El backend no devolvió un token válido.')
        return
      }

      loginStore(token, role)
      navigate(from, { replace: true })
    },
    onError: (err: any) => {
      const msg = err?.message || err?.detail || err?.title || 'No fue posible iniciar sesión. Verifica tus datos.'
      setServerError(msg)
    },
  })

  const onSubmit = (values: LoginValues) => {
    setServerError(null)
    mutation.mutate(values)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">Iniciar sesión</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Accede con tu cuenta para continuar
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Usuario o correo</label>
            <input
              type="text"
              autoComplete="username email"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="tucorreo@empresa.com"
              {...register('identity')}
              disabled={mutation.isPending}
            />
            {errors.identity && <p className="text-sm text-red-600 mt-1">{errors.identity.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              {...register('password')}
              disabled={mutation.isPending}
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          {serverError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-xl bg-indigo-600 text-white py-2.5 font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
          >
            {mutation.isPending ? 'Ingresando…' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Olvidaste tu contraseña?{' '}
          <Link to="/forgot-password" className="text-indigo-600 hover:underline">
            Recuperar
          </Link>
        </div>

        <div className="mt-2 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Sistema de Nómina
        </div>
      </div>
    </div>
  )
}
