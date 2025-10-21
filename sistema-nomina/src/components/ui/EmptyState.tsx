type EmptyStateProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function EmptyState({ title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
