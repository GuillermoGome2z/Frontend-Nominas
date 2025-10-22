import EmployeeForm from './EmployeeForm';
import { useCreateEmployee } from './hooks';
import { useNavigate } from 'react-router-dom';
import { parseValidationError } from './api'

export default function EmployeeCreatePage() {
  const nav = useNavigate();
  const create = useCreateEmployee();

  return (
    <section className="p-2 sm:p-4">
      <h1 className="mb-4 text-2xl font-bold">Nuevo empleado</h1>
      <EmployeeForm
  onSubmit={(data)=> create.mutate(data, {
    onSuccess: ()=> nav('/empleados'),
    onError: (e:any)=> {
      const msg = parseValidationError(e)
      alert(msg ?? e?.message ?? 'Error al crear empleado')
      console.error('POST /Empleados error:', e?.response?.data ?? e)
    },
  })}
  submitting={create.isPending}
/>
    </section>);
}