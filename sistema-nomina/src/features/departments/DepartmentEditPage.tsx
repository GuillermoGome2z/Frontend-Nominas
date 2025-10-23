// src/features/departments/DepartmentEditPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useDepartment, useUpdateDepartment } from './hooks';
import DepartmentForm from './DepartmentForm';

export default function DepartmentEditPage() {
  const { id } = useParams();
  const deptId = Number(id);
  const { data, isLoading, isError } = useDepartment(deptId);
  const upd = useUpdateDepartment(deptId);
  const nav = useNavigate();

  if (isLoading) return <div className="p-4">Cargando…</div>;
  if (isError) return <div className="p-4 text-rose-600">Error al cargar.</div>;

  return (
    <section className="mx-auto max-w-4xl p-3 sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => nav(-1)}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
        >
          ← Regresar
        </button>
        <h1 className="text-2xl font-bold">Editar departamento</h1>
      </div>

      <DepartmentForm
        defaultValues={data}
        onSubmit={(form) =>
          upd.mutate(form, {
            onSuccess: () => nav('/departamentos'),
            onError: (e: any) =>
              alert(
                e?.response?.data?.mensaje ??
                  e?.message ??
                  'Error al actualizar',
              ),
          })
        }
        submitting={upd.isPending}
        isEdit={true}
      />
    </section>
  );
}
