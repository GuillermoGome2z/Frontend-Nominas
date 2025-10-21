interface StatCardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export function StatCard({ title, value, trend, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-baseline">
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <span
            className={`ml-2 text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
            aria-label={trend.isPositive ? 'Tendencia positiva' : 'Tendencia negativa'}
            title={trend.isPositive ? 'Tendencia positiva' : 'Tendencia negativa'}
          >
            {trend.isPositive ? '▲' : '▼'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
