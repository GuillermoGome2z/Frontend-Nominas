import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import DashboardPage from '../pages/DashboardPage'
import NotFoundPage from '../pages/NotFoundPage'
import NotAuthorizedPage from '../pages/NotAuthorizedPage'
import LoginPage from '../features/auth/LoginPage'
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage'
import ProtectedRoute from '../features/auth/ProtectedRoute'
import PublicOnlyRoute from '../features/auth/PublicOnlyRoute'
import RoleGuard from '../features/auth/RoleGuard'
import EmployeesListPage from '../features/employees/EmployeesListPage'
import PayrollListPage from '../features/payroll/PayrollListPage'
import ReportsPage from '../features/reports/ReportsPage'
import FilesPage from '../features/files/FilesPage'
import EmployeeCreatePage from '../features/employees/EmployeeCreatePage'
import EmployeeDetailPage from '../features/employees/EmployeeDetailPage'
import EmployeeEditPage from '../features/employees/EmployeeEditPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicOnlyRoute>
        <ForgotPasswordPage />
      </PublicOnlyRoute>
    ),
  },
  { path: '/403', element: <NotAuthorizedPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
  { index: true, element: <DashboardPage /> },

  {
    path: 'empleados',
    element: (
      <RoleGuard roles={['ADMIN', 'RRHH']}>
        <EmployeesListPage />
      </RoleGuard>
    ),
  },
  {
    path: 'empleados/nuevo',
    element: (
      <RoleGuard roles={['ADMIN', 'RRHH']}>
        <EmployeeCreatePage />
      </RoleGuard>
    ),
  },
  {
    path: 'empleados/:id',
    element: (
      <RoleGuard roles={['ADMIN', 'RRHH']}>
        <EmployeeDetailPage />
      </RoleGuard>
    ),
  },
  {
    path: 'empleados/:id/editar',
    element: (
      <RoleGuard roles={['ADMIN', 'RRHH']}>
        <EmployeeEditPage />
      </RoleGuard>
    ),
  },

  {
    path: 'nomina',
    element: (
      <RoleGuard roles={['ADMIN']}>
        <PayrollListPage />
      </RoleGuard>
    ),
  },
  {
    path: 'reportes',
    element: (
      <RoleGuard roles={['ADMIN', 'RRHH']}>
        <ReportsPage />
      </RoleGuard>
    ),
  },
  {
    path: 'expedientes',
    element: (
      <RoleGuard roles={['ADMIN', 'RRHH']}>
        <FilesPage />
      </RoleGuard>
    ),
  },

  { path: '*', element: <NotFoundPage /> },
],

    // Puedes mantener errorElement si lo usas con loaders/actions
    errorElement: <NotFoundPage />,
  },
])
