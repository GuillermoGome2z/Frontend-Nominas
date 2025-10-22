export type Employee = {
  id: number;
  nombre: string;
  departamento: string | null;
  activo: boolean;
  salario: number | null;
};

export function normalizeEmployee(row: any): Employee {
  return {
    id:
      row.id ?? row.Id ?? row.idEmpleado ?? row.IdEmpleado ?? 0,
    nombre:
      row.nombre ?? row.Nombre ?? row.nombres ?? row.Nombres ?? '',
    departamento:
      row.departamento ?? row.Departamento ?? row.departamentoNombre ?? row.DepartamentoNombre ?? null,
    activo:
      (row.activo ?? row.Activo ?? row.estado ?? row.Estado ?? false) === true ||
      (typeof (row.estado ?? row.Estado) === 'string' && (row.estado ?? row.Estado).toLowerCase() === 'activo'),
    salario: Number(
      row.salario ?? row.Salario ?? row.sueldo ?? row.Sueldo ?? NaN
    ) || null,
  };
}

export type EmployeesListResponse = {
  items: Employee[];
  total: number;
  page: number;
  pageSize: number;
};

export function normalizeEmployeesList(apiResp: any): EmployeesListResponse {
  const itemsRaw =
    apiResp?.items ?? apiResp?.Items ?? apiResp?.data ?? apiResp?.Data ?? apiResp?.lista ?? apiResp?.Lista ?? [];
  const total =
    apiResp?.total ?? apiResp?.Total ?? apiResp?.count ?? apiResp?.Count ?? itemsRaw.length;
  const page =
    apiResp?.page ?? apiResp?.Page ?? apiResp?.pagina ?? apiResp?.Pagina ?? 1;
  const pageSize =
    apiResp?.pageSize ?? apiResp?.PageSize ?? apiResp?.page_size ?? apiResp?.Page_size ?? itemsRaw.length;

  const items = Array.isArray(itemsRaw) ? itemsRaw.map(normalizeEmployee) : [];
  return { items, total, page, pageSize };
}
