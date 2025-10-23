import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from './useAuthStore'
import { mapBackendRole } from '../../types/auth'
import { authService } from '../../services/authService'
import { useState } from 'react'

const LoginSchema = z.object({
  correo: z.string().email('Ingresa un correo válido').min(3, 'El correo es requerido'),
  password: z.string().min(4, 'La contraseña es requerida'),
})
type LoginValues = z.infer<typeof LoginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location?.state?.from?.pathname ?? '/'

  const loginStore = useAuthStore((s) => s.login)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { correo: '', password: '' },
  })

  const mutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (values: LoginValues) => {
      return authService.login(values.correo, values.password)
    },
    onSuccess: ({ loginData, refreshToken }) => {
      const token = loginData.token
      const role = mapBackendRole(loginData.rol)

      if (!token || !refreshToken) {
        setServerError('El backend no devolvió tokens válidos.')
        return
      }

      loginStore(token, refreshToken, role)
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
            <label className="block text-sm font-medium mb-1">Correo electrónico</label>
            <input
              type="email"
              autoComplete="username email"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="tucorreo@empresa.com"
              {...register('correo')}
              disabled={mutation.isPending}
            />
            {errors.correo && <p className="text-sm text-red-600 mt-1">{errors.correo.message}</p>}
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
