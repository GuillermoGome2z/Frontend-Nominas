interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export function ActivityItem({ icon, title, timestamp, type }: ActivityItemProps) {
  const typeStyles: Record<ActivityItemProps['type'], string> = {
    success: 'bg-green-50 text-green-700 border-green-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border ${typeStyles[type]} bg-white`}
      role="listitem"
    >
      <div className="p-2 rounded-full bg-white/60 border">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
}
