import { Link } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';

const navigation = [
  { name: 'Inicio', href: '/dashboard' },
  { name: 'Empleados', href: '/empleados' },
  { name: 'Departamentos', href: '/departamentos' },
  { name: 'Puestos', href: '/puestos' },
  { name: 'Reportes', href: '/reportes' }
];

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/img/logo.svg"
                alt="Logo"
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side content */}
          <div className="flex items-center space-x-4">
            {/* Verify Payment Button */}
            <div className="flex flex-col items-end">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Verificar Pago
              </button>
              <span className="text-xs text-gray-500 mt-1">Ref: #PAY-2025-03</span>
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <FiBell className="h-6 w-6" />
            </button>

            {/* User Menu */}
            <div className="ml-3 relative">
              <div className="flex items-center">
                <button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User avatar"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}