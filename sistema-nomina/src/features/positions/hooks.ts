import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PosFilters, PosListResponse, PositionDTO } from './api'
import { listPositions, getPosition, createPosition, updatePosition, togglePositionActive } from './api'
import { useToast } from '@/components/ui/Toast'

export function usePositions(filters: PosFilters) {
  return useQuery<PosListResponse, Error>({
    queryKey: ['positions', filters],
    queryFn: () => listPositions(filters),
    placeholderData: (p)=>p,
    staleTime: 30_000,
  })
}

export function usePosition(id:number) {
  return useQuery<PositionDTO, Error>({
    queryKey: ['position', id],
    queryFn: ()=> getPosition(id),
    enabled: Number.isFinite(id) && id>0,
    staleTime: 30_000,
  })
}

export function useCreatePosition() {
  const qc = useQueryClient()
  const { success, error } = useToast()
  return useMutation({
    mutationFn: createPosition,
    onSuccess: ()=> {
      qc.invalidateQueries({queryKey:['positions']})
      success('Puesto creado.')
    },
    onError: ()=> error('No se pudo crear el puesto.'),
  })
}

export function useUpdatePosition(id:number) {
  const qc = useQueryClient()
  const { success, error } = useToast()
  return useMutation({
    mutationFn: (p:Partial<PositionDTO>)=> updatePosition(id,p),
    onSuccess: ()=> {
      qc.invalidateQueries({queryKey:['position',id]})
      qc.invalidateQueries({queryKey:['positions']})
      success('Puesto actualizado.')
    },
    onError: ()=> error('No se pudo actualizar el puesto.'),
  })
}

export function useTogglePosition() {
  const qc = useQueryClient()
  const { success, info, error } = useToast()
  return useMutation({
    mutationFn: (p:{id:number; activo:boolean}) => togglePositionActive(p.id, p.activo),
    onSuccess: (_d, v)=> {
      qc.invalidateQueries({queryKey:['position', v.id]})
      qc.invalidateQueries({queryKey:['positions']})
      success(`Puesto ${v.activo ? 'activado' : 'desactivado'}.`)
    },
    onError: (e:any)=> {
      const status = e?.response?.status
      if (status === 409) {
        const d = e?.response?.data
        const msg = d?.message ?? 'No se puede desactivar: hay empleados activos en este puesto.'
        info(msg); return
      }
      error('No se pudo cambiar el estado.')
    },
  })
}
