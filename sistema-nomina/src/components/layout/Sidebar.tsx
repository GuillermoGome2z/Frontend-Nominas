import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, BadgeDollarSign, FileBarChart, FolderOpen, X, Building2, Briefcase } from 'lucide-react'

type SidebarProps = {
  open: boolean
  onClose: () => void
}

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/empleados', label: 'Empleados', icon: Users },
  { to: '/departamentos', label: 'Departamentos', icon: Building2 },
  { to: '/puestos', label: 'Puestos', icon: Briefcase },
  { to: '/nomina', label: 'Nómina', icon: BadgeDollarSign },
  { to: '/reportes', label: 'Reportes', icon: FileBarChart },
  { to: '/expedientes', label: 'Expedientes', icon: FolderOpen },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay móvil */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 transition-opacity lg:hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Shell */}
      <aside
        aria-label="Menú lateral"
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200
          transition-transform transform
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Header del sidebar (móvil) */}
        <div className="h-14 px-4 flex items-center justify-between border-b lg:hidden">
          <div />
          <button onClick={onClose} aria-label="Cerrar menú" className="p-2 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Marca (desktop) */}
  {/* desktop brand removed as per request */}

        {/* Navegación */}
        <nav className="p-3 space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium
                 ${isActive ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`
              }
              onClick={onClose}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
