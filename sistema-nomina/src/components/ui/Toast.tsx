import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Toast = { id: number; message: string; tone?: 'info' | 'success' | 'error' };
type Ctx = { push: (message: string, tone?: Toast['tone']) => void };

const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const push = useCallback((message: string, tone: Toast['tone'] = 'info') => {
    const id = Date.now() + Math.random();
    setItems(prev => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setItems(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {items.map(t => (
          <div
            key={t.id}
            className={`rounded-xl border px-4 py-2 text-sm shadow-soft bg-white ${
              t.tone === 'success'
                ? 'border-emerald-200 text-emerald-700'
                : t.tone === 'error'
                ? 'border-rose-200 text-rose-700'
                : 'border-sky-200 text-sky-700'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider/>');
  return ctx;
}
