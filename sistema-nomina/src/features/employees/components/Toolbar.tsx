import { useState } from 'react';

export default function Toolbar({ onFilter, onCreate }:{ onFilter: (f:any)=>void; onCreate: ()=>void }) {
  const [q, setQ] = useState('');
  const [departamentoId, setDepartamentoId] = useState<number | undefined>(undefined);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          onKeyDown={(e)=> e.key==='Enter' && onFilter({ q })}
          placeholder="Buscar por nombre/DPI/NIT…"
          className="w-full sm:max-w-md rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Buscar empleados"
        />
        <input
          type="number"
          placeholder="Depto ID"
          className="w-28 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={departamentoId ?? ''}
          onChange={(e)=>setDepartamentoId(e.target.value ? Number(e.target.value) : undefined)}
          aria-label="Filtrar por departamento"
        />
        <button onClick={()=> onFilter({ q, departamentoId })}
          className="rounded-xl border px-4 py-2 hover:bg-gray-50">Filtrar</button>
      </div>
      <button onClick={onCreate}
        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
        + Nuevo empleado
      </button>
    </div>
  );
}