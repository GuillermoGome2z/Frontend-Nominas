import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/http'

type Employee = {
  id: number
  name: string
  department: string
}

type ApiList<T> = {
  data: T[]
  meta: { total: number }
}

export default function EmployeesListPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await api.get<ApiList<Employee>>('/employees')
      return res.data
    },
  })

  if (isLoading) return <p>Cargando empleados…</p>
  if (isError) return <p>Error al cargar empleados</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Empleados</h1>
      <table className="min-w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">ID</th>
            <th className="border px-3 py-2 text-left">Nombre</th>
            <th className="border px-3 py-2 text-left">Departamento</th>
          </tr>
        </thead>
        <tbody>
          {data!.data.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{emp.id}</td>
              <td className="border px-3 py-2">{emp.name}</td>
              <td className="border px-3 py-2">{emp.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-gray-500 mt-2">Total: {data!.meta.total}</p>
    </div>
  )
}
