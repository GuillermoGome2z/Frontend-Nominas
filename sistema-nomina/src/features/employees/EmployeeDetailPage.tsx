import { useParams, Link } from 'react-router-dom';
import { useEmployee } from './hooks';

import { UploadDialog, FileList } from './expediente';

// Opción C (si tu tsconfig usa "moduleResolution":"NodeNext"/"Node16" y exige extensión .js en imports TS):
// import UploadDialog from './expediente/UploadDialog.js';
// import FileList from './expediente/FileList.js';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const empId = Number(id);
  const { data, isLoading, isError } = useEmployee(empId);

  if (!id || Number.isNaN(empId)) {
    return <div className="p-4 text-rose-600">ID de empleado inválido.</div>;
  }
  if (isLoading) return <div className="p-4">Cargando…</div>;
  if (isError || !data) return <div className="p-4 text-rose-600">Error al cargar.</div>;

  const e = data;

  return (
    <section className="p-2 sm:p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Empleado #{e.id}</h1>
        <Link
          to={`/empleados/${empId}/editar`}
          className="rounded-xl border px-3 py-2 hover:bg-gray-50"
        >
          Editar
        </Link>
      </div>

      <div className="grid gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:grid-cols-2">
        <div><b>Nombre:</b> {e.nombreCompleto}</div>
        <div><b>Departamento:</b> {e.nombreDepartamento ?? '—'}</div>
        <div><b>DPI/NIT:</b> {e.dpi} / {e.nit}</div>
        <div><b>Correo:</b> {e.correo}</div>
        <div><b>Estado:</b> {e.estadoLaboral ?? '—'}</div>
        <div><b>Salario:</b> {e.salarioMensual ?? '—'}</div>
        <div><b>Teléfono:</b> {e.telefono ?? '—'}</div>
        <div><b>Dirección:</b> {e.direccion ?? '—'}</div>
      </div>

      <h2 className="mt-6 text-xl font-semibold">Expediente</h2>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <UploadDialog empleadoId={empId} />
        <FileList empleadoId={empId} />
      </div>
    </section>
  );
}
