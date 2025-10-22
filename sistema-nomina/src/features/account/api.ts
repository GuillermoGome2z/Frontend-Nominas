import { api } from '@/lib/api'

export type MyProfile = {
  id: number
  nombreCompleto: string
  correo: string
  telefono?: string
  direccion?: string
  // si tu backend expone más campos, agrégalos aquí
}

// GET / me
export async function getMyProfile(): Promise<MyProfile> {
  const { data } = await api.get('/Usuarios/me')
  // Normaliza posibles PascalCase/camelCase:
  const p = data || {}
  return {
    id: p.id ?? p.Id ?? 0,
    nombreCompleto: p.nombreCompleto ?? p.NombreCompleto ?? '',
    correo: p.correo ?? p.Correo ?? '',
    telefono: p.telefono ?? p.Telefono ?? '',
    direccion: p.direccion ?? p.Direccion ?? '',
  }
}

// PUT / me
export async function updateMyProfile(payload: Partial<MyProfile>) {
  const body = {
    Id: payload.id,
    NombreCompleto: payload.nombreCompleto,
    Telefono: payload.telefono,
    Direccion: payload.direccion,
    // Correo como solo lectura: NO lo mandamos a menos que tu backend permita editarlo.
  }
  const res = await api.put('/Usuarios/me', body)
  return res.status
}

// PUT / me/password
export async function changeMyPassword(oldPassword: string, newPassword: string) {
  const body = { OldPassword: oldPassword, NewPassword: newPassword }
  const res = await api.put('/Usuarios/me/password', body)
  return res.status
}
