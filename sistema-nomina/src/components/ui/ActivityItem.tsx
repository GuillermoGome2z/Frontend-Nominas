interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export function ActivityItem({ icon, title, timestamp, type }: ActivityItemProps) {
  const typeStyles = {
    success: 'bg-green-100 text-green-600',
    info: 'bg-blue-100 text-blue-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600'
  };

  return (
    <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200">
      <div className={`p-2 rounded-full ${typeStyles[type]}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
}