export default function NotAuthorizedPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white p-8 rounded-2xl shadow border text-center">
        <h1 className="text-2xl font-bold mb-2">403 – No autorizado</h1>
        <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
      </div>
    </div>
  )
}
