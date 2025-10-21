import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <section className="max-w-7xl mx-auto p-4 sm:p-6">
      {children}
    </section>
  );
}
