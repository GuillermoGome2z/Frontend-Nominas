import React from 'react';
import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';

// Auth
import LoginPage from '../features/auth/LoginPage';
import PrivateRoute from '../features/auth/PrivateRoute';
import RoleGuard from '../features/auth/RoleGuard';
import PublicOnlyRoute from '../features/auth/PublicOnlyRoute';

// Pages
import DashboardPage from '../pages/DashboardPage';

// Páginas del módulo Empleados
import EmployeesListPage from '../features/employees/EmployeesListPage';
import EmployeeCreatePage from '../features/employees/EmployeeCreatePage';
import EmployeeDetailPage from '../features/employees/EmployeeDetailPage';
import EmployeeEditPage from '../features/employees/EmployeeEditPage';

/**
 * Layout principal con la estructura común de la aplicación
 */
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    {children}
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/login',
    element: <PublicOnlyRoute>
      <LoginPage />
    </PublicOnlyRoute>
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <RoleGuard roles={['ADMIN', 'RRHH', 'EMP']}>
          <Shell>
            <DashboardPage />
          </Shell>
        </RoleGuard>
      </PrivateRoute>
    )
  },
  {
    path: '/empleados',
    element: (
      <PrivateRoute>
        <RoleGuard roles={['ADMIN', 'RRHH']}>
          <Shell>
            <EmployeesListPage />
          </Shell>
        </RoleGuard>
      </PrivateRoute>
    )
  },
  {
    path: '/empleados/nuevo',
    element: (
      <PrivateRoute>
        <RoleGuard roles={['ADMIN', 'RRHH']}>
          <Shell>
            <EmployeeCreatePage />
          </Shell>
        </RoleGuard>
      </PrivateRoute>
    )
  },
  {
    path: '/empleados/:id',
    element: (
      <PrivateRoute>
        <RoleGuard roles={['ADMIN', 'RRHH']}>
          <Shell>
            <EmployeeDetailPage />
          </Shell>
        </RoleGuard>
      </PrivateRoute>
    )
  },
  {
    path: '/empleados/:id/editar',
    element: (
      <PrivateRoute>
        <RoleGuard roles={['ADMIN', 'RRHH']}>
          <Shell>
            <EmployeeEditPage />
          </Shell>
        </RoleGuard>
      </PrivateRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
]);
