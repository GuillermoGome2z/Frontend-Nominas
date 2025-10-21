import { useState } from 'react';
import { useEmployees, useDeleteEmployee } from './hooks';
import Toolbar from './components/Toolbar';
import EmployeesTable from './components/EmployeesTable';
import Pagination from './components/Pagination';
import ConfirmDialog from './components/ConfirmDialog';
import { useNavigate } from 'react-router-dom';

export default function EmployeesListPage() {
  const [filters, setFilters] = useState({ page: 1, pageSize: 10 } as any);
  const { data, isLoading, isError } = useEmployees(filters);
  const del = useDeleteEmployee();
  const nav = useNavigate();
  const [toDelete, setToDelete] = useState<number | null>(null);

  const total = data?.meta.total ?? 0;
  const rows = data?.data ?? [];

  return (
    <section className="p-2 sm:p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Empleados</h1>
      </div>

      <Toolbar
        onFilter={(f)=> setFilters((prev:any)=> ({ ...prev, page: 1, ...f }))}
        onCreate={()=> nav('/empleados/nuevo')}
      />

      {isLoading && <div className="mt-6 animate-pulse rounded-2xl border p-6">Cargando…</div>}
      {isError && <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">Error al cargar empleados.</div>}
      {!isLoading && !isError && (
        <>
          <EmployeesTable rows={rows} onDelete={(id)=> setToDelete(id)} />
          <Pagination
            page={filters.page} pageSize={filters.pageSize} total={total}
            onPageChange={(p)=> setFilters((prev:any)=> ({ ...prev, page: p }))}
          />
        </>
      )}

      <ConfirmDialog
        open={toDelete != null}
        setOpen={(v) => !v && setToDelete(null)}
        title="Eliminar empleado"
        description="Esta acción no se puede deshacer."
        onCancel={()=> setToDelete(null)}
        onConfirm={()=> {
          if (toDelete == null) return;
          del.mutate(toDelete, { onSettled: ()=> setToDelete(null) });
        }}
      />
    </section>
);
}