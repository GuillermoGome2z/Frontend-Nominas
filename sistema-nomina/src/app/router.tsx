import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import DashboardPage from '../pages/DashboardPage'
import NotFoundPage from '../pages/NotFoundPage'
import NotAuthorizedPage from '../pages/NotAuthorizedPage'
import LoginPage from '../features/auth/LoginPage'
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage'
import ProtectedRoute from '../features/auth/ProtectedRoute'
import RoleGuard from '../features/auth/RoleGuard'
import EmployeesListPage from '../features/employees/EmployeesListPage'
import PayrollListPage from '../features/payroll/PayrollListPage'
import ReportsPage from '../features/reports/ReportsPage'
import FilesPage from '../features/files/FilesPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
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

      // RRHH + ADMIN
      {
        path: 'empleados',
        element: (
          <RoleGuard roles={['ADMIN', 'RRHH']}>
            <EmployeesListPage />
          </RoleGuard>
        ),
      },
      // Solo ADMIN
      {
        path: 'nomina',
        element: (
          <RoleGuard roles={['ADMIN']}>
            <PayrollListPage />
          </RoleGuard>
        ),
      },
      // RRHH + ADMIN
      {
        path: 'reportes',
        element: (
          <RoleGuard roles={['ADMIN', 'RRHH']}>
            <ReportsPage />
          </RoleGuard>
        ),
      },
      // RRHH + ADMIN
      {
        path: 'expedientes',
        element: (
          <RoleGuard roles={['ADMIN', 'RRHH']}>
            <FilesPage />
          </RoleGuard>
        ),
      },
    ],
    errorElement: <NotFoundPage />,
  },
])
