import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar onMenu={() => setOpen(true)} />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* deja espacio para el sidebar fijo en desktop */}
      <div className="lg:pl-64">
        <main role="main" className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
