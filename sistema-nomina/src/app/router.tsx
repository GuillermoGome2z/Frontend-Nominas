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
import AccountSettingsPage from '@/features/account/AccountSettingsPage'

import EmployeesListPage from '../features/employees/EmployeesListPage'
import EmployeeCreatePage from '../features/employees/EmployeeCreatePage'
import EmployeeDetailPage from '../features/employees/EmployeeDetailPage'
import EmployeeEditPage from '../features/employees/EmployeeEditPage'

// Departamentos
import DepartmentsListPage from '../features/departments/DepartmentsListPage'
import DepartmentCreatePage from '../features/departments/DepartmentCreatePage'
import DepartmentEditPage from '../features/departments/DepartmentEditPage'

// Puestos
import PositionsListPage from '../features/positions/PositionsListPage'
import PositionCreatePage from '../features/positions/PositionCreatePage'
import PositionEditPage from '../features/positions/PositionEditPage'


// import PositionDetailPage from '../features/positions/PositionDetailPage'

import PeriodsListPage from '../features/payroll/pages/PeriodsListPage';
import PeriodDetailPage from '../features/payroll/pages/PeriodDetailPage';
import ReportsPage from '../features/reports/ReportsPage';
import FilesPage from '../features/files/FilesPage';
import ExpedienteDetailPage from '../features/files/ExpedienteDetailPage';

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
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DashboardPage /> },

      // ----- Empleados -----
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

      { path: 'perfil', element: <AccountSettingsPage /> },
      
      // ----- Departamentos -----
      {
        path: 'departamentos',
        element: (
          <RoleGuard roles={['ADMIN', 'RRHH']}>
            <DepartmentsListPage />
          </RoleGuard>
        ),
      },
      {
        path: 'departamentos/nuevo',
        element: (
          <RoleGuard roles={['ADMIN', 'RRHH']}>
            <DepartmentCreatePage />
          </RoleGuard>
        ),
      },
      {
        path: 'departamentos/:id/editar',
        element: (
          <RoleGuard roles={['ADMIN', 'RRHH']}>
            <DepartmentEditPage />
          </RoleGuard>
        ),
      },
      // Si agregas detalle:
      // {
      //   path: 'departamentos/:id',
      //   element: (
      //     <RoleGuard roles={['ADMIN', 'RRHH']}>
      //       <DepartmentDetailPage />
      //     </RoleGuard>
      //   ),
      // },

      // ----- Puestos -----
      {
        path: 'puestos',
        element: (
          <RoleGuard roles={['ADMIN', 'RRHH']}>
            <PositionsListPage />
          </RoleGuard>
        ),
      },
      {
        path: 'puestos/nuevo',
        element: (
          <RoleGuard roles={['ADMIN', 'RRHH']}>
            <PositionCreatePage />
          </RoleGuard>
        ),
      },
      {
        path: 'puestos/:id/editar',
        element: (
          <RoleGuard roles={['ADMIN', 'RRHH']}>
            <PositionEditPage />
          </RoleGuard>
        ),
      },
      // Detalle opcional:
      // {
      //   path: 'puestos/:id',
      //   element: (
      //     <RoleGuard roles={['ADMIN', 'RRHH']}>
      //       <PositionDetailPage />
      //     </RoleGuard>
      //   ),
      // },

      // ----- Nómina -----
      {
        path: 'nomina',
        element: (
          <RoleGuard roles={['ADMIN']}>
            <PeriodsListPage />
          </RoleGuard>
        ),
      },
      {
        path: 'nominas',
        element: (
          <RoleGuard roles={['ADMIN']}>
            <PeriodsListPage />
          </RoleGuard>
        ),
      },
      {
        path: 'nomina/periodos/:id',
        element: (
          <RoleGuard roles={['ADMIN']}>
            <PeriodDetailPage />
          </RoleGuard>
        ),
      },
      {
        path: 'nominas/periodos/:id',
        element: (
          <RoleGuard roles={['ADMIN']}>
            <PeriodDetailPage />
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
            <ExpedientesListPage />
          </RoleGuard>
        ),
      },
      {
        path: 'expedientes/:id',
        element: (
          <RoleGuard roles={['ADMIN', 'RRHH']}>
            <ExpedienteDetailPage />
          </RoleGuard>
        ),
      },

      // Catch-all reales dentro de la app protegida
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
