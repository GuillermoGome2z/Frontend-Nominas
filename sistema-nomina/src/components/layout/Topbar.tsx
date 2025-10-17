import { Menu, LogOut } from 'lucide-react'
import { useAuthStore } from '../../features/auth/useAuthStore'

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const logout = useAuthStore((s) => s.logout)

  return (
    <header className="sticky top-0 z-30 bg-white border-b">
      <div className="h-14 px-3 flex items-center justify-between">
        <button className="lg:hidden p-2" onClick={onMenu} aria-label="Abrir menú">
          <Menu className="w-6 h-6" />
        </button>
        <div className="font-semibold">Sistema de Nómina</div>
        <button
          className="inline-flex items-center gap-2 text-sm text-red-600 hover:underline"
          onClick={() => { logout(); window.location.href = '/login' }}
        >
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </div>
    </header>
  )
}
