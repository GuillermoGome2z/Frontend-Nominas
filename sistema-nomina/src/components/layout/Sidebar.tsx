import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Wallet, FileBarChart, Folder } from 'lucide-react'
import { useAuthStore } from '../../features/auth/useAuthStore'

type Role = 'ADMIN' | 'RRHH' | 'EMP'

type Item = {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles: Role[]
}

const items: Item[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN','RRHH','EMP'] },
  { to: '/empleados', label: 'Empleados', icon: Users, roles: ['ADMIN','RRHH'] },
  { to: '/nomina', label: 'Nómina', icon: Wallet, roles: ['ADMIN'] },
  { to: '/reportes', label: 'Reportes', icon: FileBarChart, roles: ['ADMIN','RRHH'] },
  { to: '/expedientes', label: 'Expedientes', icon: Folder, roles: ['ADMIN','RRHH'] },
]

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const role = useAuthStore((s) => s.role)

  return (
    <>
      {/* Backdrop móvil */}
      <div
        className={`fixed inset-0 bg-black/30 lg:hidden transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white border-r shadow-sm transform transition-transform
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="p-4 font-bold text-lg border-b">RRHH & Nómina</div>
        <nav className="p-2 space-y-1">
          {items
            .filter((it) => !role || it.roles.includes(role))
            .map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 font-semibold' : ''
                  }`
                }
                onClick={onClose}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </NavLink>
            ))}
        </nav>
      </aside>
    </>
  )
}
