import { useParams, useNavigate } from 'react-router-dom';
import { useEmployee, useUpdateEmployee } from './hooks';
import EmployeeForm from './EmployeeForm';

export default function EmployeeEditPage() {
  const { id } = useParams(); const empId = Number(id);
  const { data, isLoading, isError } = useEmployee(empId);
  const upd = useUpdateEmployee(empId);
  const nav = useNavigate();

  if (isLoading) return <div className="p-4">Cargando…</div>;
  if (isError) return <div className="p-4 text-rose-600">Error al cargar.</div>;

  return (
    <section className="p-2 sm:p-4">
      <h1 className="mb-4 text-2xl font-bold">Editar empleado</h1>
      <EmployeeForm
        defaultValues={data}
        onSubmit={(form)=> upd.mutate(form, {
          onSuccess: ()=> nav(`/empleados/${empId}`),
          onError: (e:any)=> alert(e?.message ?? 'Error al actualizar'),
        })}
        submitting={upd.isPending}
      />
    </section>);
}