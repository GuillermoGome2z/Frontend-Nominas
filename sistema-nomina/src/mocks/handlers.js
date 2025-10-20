import { http, HttpResponse } from 'msw'

const demoToken = 'demo.jwt.token'

export const handlers = [
  // LOGIN
  http.post('/api/Auth/login', async ({ request }) => {
    const body = await request.json()
    const correo = (body && body.Correo) || ''

    if (correo.toLowerCase().includes('admin')) {
      return HttpResponse.json({ Token: demoToken, Rol: 'Admin' })
    }

    return HttpResponse.json({ Token: demoToken, Rol: 'RRHH' })
  }),

  // EMPLOYEES LIST
  http.get('/api/employees', () => {
    return HttpResponse.json({
      data: [
        { id: 1, name: 'Ana López', department: 'RRHH' },
        { id: 2, name: 'Carlos Pérez', department: 'IT' },
      ],
      meta: { total: 2 },
    })
  }),

  // Some apps may request the client route /login (navigation or fetch).
  // Return a harmless JSON so the worker doesn't warn about an unhandled request.
  http.get('/login', () => {
    return HttpResponse.json({ ok: true })
  }),
]

export default handlers
