import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyProfile, updateMyProfile, changeMyPassword, type MyProfile } from './api'
import { useToast } from '@/components/ui/Toast'

export default function AccountSettingsPage() {
  const navigate = useNavigate()
  const { success, error, warning } = useToast()

  // ----- Perfil -----
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<MyProfile | null>(null)

  const [nombreCompleto, setNombreCompleto] = useState('')
  const [correo, setCorreo] = useState('')        // readOnly
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')

  // ----- Password -----
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPass, setSavingPass] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const me = await getMyProfile()
        if (!mounted) return
        setProfile(me)
        setNombreCompleto(me.nombreCompleto ?? '')
        setCorreo(me.correo ?? '')
        setTelefono(me.telefono ?? '')
        setDireccion(me.direccion ?? '')
      } catch (e) {
        error('No se pudo cargar tu perfil.')
        // console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [error])

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    if (!nombreCompleto.trim()) {
      warning('El nombre es obligatorio.')
      return
    }
    setSavingProfile(true)
    try {
      await updateMyProfile({
        id: profile.id,
        nombreCompleto: nombreCompleto.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
      })
      success('Perfil actualizado')
    } catch (e) {
      error('No se pudo actualizar el perfil.')
      // console.error(e)
    } finally {
      setSavingProfile(false)
    }
  }

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      warning('Completa todos los campos de contraseña.')
      return
    }
    if (newPassword.length < 8) {
      warning('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      warning('La confirmación no coincide.')
      return
    }
    setSavingPass(true)
    try {
      await changeMyPassword(oldPassword, newPassword)
      success('Contraseña actualizada')
      setOldPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (e) {
      error('No se pudo cambiar la contraseña.')
      // console.error(e)
    } finally {
      setSavingPass(false)
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl p-3 sm:p-6">
        <div className="animate-pulse rounded-2xl border bg-white p-6 text-gray-500 shadow-sm">
          Cargando tu información…
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl p-3 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
          aria-label="Regresar"
        >
          ← Regresar
        </button>
        <h1 className="ml-1 text-2xl font-bold">Tu perfil</h1>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* ==== Columna Perfil ==== */}
        <form
          onSubmit={onSaveProfile}
          className="rounded-2xl border bg-white p-5 shadow-sm"
          noValidate
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">1</span>
            <h2 className="text-lg font-semibold">Perfil</h2>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Nombre completo</label>
              <input
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Correo</label>
              <input
                value={correo}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border bg-gray-50 px-3 py-2 text-gray-700"
              />
              <p className="mt-1 text-xs text-gray-500">El correo es tu identificador de acceso.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Teléfono</label>
                <input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  inputMode="tel"
                  className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Dirección</label>
                <input
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {savingProfile ? 'Guardando…' : 'Guardar perfil'}
            </button>
          </div>
        </form>

        {/* ==== Columna Contraseña ==== */}
        <form
          onSubmit={onChangePassword}
          className="rounded-2xl border bg-white p-5 shadow-sm"
          noValidate
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">2</span>
            <h2 className="text-lg font-semibold">Contraseña</h2>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Contraseña actual</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Nueva contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres. Evita usar datos evidentes.</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Confirmar nueva contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={savingPass}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
            >
              {savingPass ? 'Actualizando…' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
