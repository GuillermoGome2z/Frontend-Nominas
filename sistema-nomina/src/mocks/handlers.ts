import { http, HttpResponse } from 'msw'

const demoToken = 'demo.jwt.token'

export const handlers = [
  // LOGIN - use absolute URL so axios requests to http://localhost:3000/api/auth/login match
  http.post('http://localhost:3000/api/auth/login', async ({ request }) => {
    const body = await request.json() as { username?: string }
    if (body.username && body.username.toLowerCase().includes('admin')) {
      return HttpResponse.json({ token: demoToken, role: 'ADMIN' })
    }
    return HttpResponse.json({ token: demoToken, role: 'RRHH' })
  }),

  // EMPLOYEES LIST
  http.get('http://localhost:3000/api/employees', () => {
    return HttpResponse.json({
      data: [
        { id: 1, name: 'Ana López', department: 'RRHH' },
        { id: 2, name: 'Carlos Pérez', department: 'IT' },
      ],
      meta: { total: 2 },
    })
  }),
]
