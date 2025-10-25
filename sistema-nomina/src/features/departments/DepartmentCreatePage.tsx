// src/features/departments/DepartmentCreatePage.tsx
import DepartmentForm from './DepartmentForm';
import { useCreateDepartment } from './hooks';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/components/ui/AlertContext';

export default function DepartmentCreatePage() {
  const nav = useNavigate();
  const create = useCreateDepartment();
  const { showSuccess, showError } = useAlert();

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
        <h1 className="text-2xl font-bold">Nuevo departamento</h1>
      </div>

      <DepartmentForm
        onSubmit={(data) =>
          create.mutate(data, {
            onSuccess: () => {
              showSuccess('✅ Departamento creado exitosamente');
              nav('/departamentos');
            },
            onError: (e: any) => {
              const msg = e?.response?.data?.mensaje ?? e?.message ?? 'Error al crear departamento';
              showError(msg);
            },
          })
        }
        submitting={create.isPending}
      />
    </section>
  );
}
