import { useId, useState } from 'react';
import type { ReactNode } from 'react';

type BaseProps = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  /** Contenido del botón/disparador que abre el diálogo (modo no controlado) */
  trigger?: ReactNode;
  /** Contenido del botón de confirmación (opcional, por defecto texto) */
  confirmSlot?: ReactNode;
  /** Contenido del botón de cancelar (opcional, por defecto texto) */
  cancelSlot?: ReactNode;
  /** Clases extra a aplicar al contenedor del modal */
  className?: string;
};

type ControlledProps =
  | {
      /** Si se provee, el componente se vuelve controlado */
      open: boolean;
      setOpen: (v: boolean) => void;
    }
  | {
      open?: never;
      setOpen?: never;
    };

type Props = BaseProps & ControlledProps;

/**
 * ConfirmDialog
 * - Soporta modo **no controlado** (con `trigger`) y **controlado** (con `open` / `setOpen`).
 * - Usa Tailwind para estilos básicos.
 */
export default function ConfirmDialog(props: Props) {
  const {
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    trigger,
    confirmSlot,
    cancelSlot,
    className,
  } = props;

  const isControlled = typeof (props as any).open === 'boolean';
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? (props as any).open : internalOpen;
  const setOpen = isControlled ? (props as any).setOpen : setInternalOpen;

  const titleId = useId();
  const descId = useId();

  const handleConfirm = () => {
    onConfirm?.();
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  return (
    <>
      {/* Trigger sólo en modo no controlado */}
      {!isControlled && trigger ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border px-3 py-1 hover:bg-gray-50"
          aria-haspopup="dialog"
          aria-controls={titleId}
        >
          {trigger}
        </button>
      ) : null}

      {open && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${className ?? ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          {/* Dialog */}
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 id={titleId} className="mb-1 text-lg font-semibold">
              {title}
            </h3>
            {description ? (
              <p id={descId} className="mb-4 text-sm text-gray-600">
                {description}
              </p>
            ) : null}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                {cancelSlot ?? cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
              >
                {confirmSlot ?? confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
