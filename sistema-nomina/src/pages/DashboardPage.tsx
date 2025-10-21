import { FiUsers, FiDollarSign, FiCalendar, FiUserPlus, FiFileText } from 'react-icons/fi';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatCard } from '../components/ui/StatCard';
import { ActivityItem } from '../components/ui/ActivityItem';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Empleados',
      value: '285',
      trend: { value: '+15%', isPositive: true },
      icon: <FiUsers className="h-5 w-5" />
    },
    {
      title: 'Nómina Pendiente',
      value: 'Q150,000.00',
      icon: <FiDollarSign className="h-5 w-5" />
    },
    {
      title: 'Próximo Pago',
      value: '31 Marzo, 2025',
      icon: <FiCalendar className="h-5 w-5" />
    }
  ];

  const recentActivity = [
    {
      id: 1,
      icon: <FiUserPlus className="h-5 w-5" />,
      title: 'Nuevo empleado agregado: Juan Perez',
      timestamp: '2025',
      type: 'success' as const
    },
    {
      id: 2,
      icon: <FiFileText className="h-5 w-5" />,
      title: 'Reporte de Febrero: procesada generada',
      timestamp: '2025',
      type: 'info' as const
    }
  ];

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido al Sistema de Gestión
        </h1>
        <p className="text-gray-600">
          Panel de control y estadísticas principales
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} {...activity} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
