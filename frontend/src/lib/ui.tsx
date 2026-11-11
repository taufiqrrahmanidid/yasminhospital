// frontend/src/lib/ui.tsx
// Sistem notifikasi modern global: toast + confirm dialog.
// - `window.alert` otomatis dialihkan ke toast modern (semua alert lama jadi modern).
// - `confirmDialog(msg)` menggantikan `window.confirm` (native) dengan modal modern.
import React, { useCallback, useEffect, useState } from 'react';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ConfirmState {
  message: string;
  resolve: (value: boolean) => void;
}

let emitToast: ((message: string, type: ToastType) => void) | null = null;
let emitConfirm: ((message: string, resolve: (v: boolean) => void) => void) | null = null;
let toastSeq = 0;

/** Tampilkan toast modern dari mana saja (termasuk luar komponen). */
export function toast(message: string, type: ToastType = 'info') {
  if (emitToast) emitToast(String(message ?? ''), type);
  else console.log(`[toast:${type}]`, message);
}

/** Pengganti window.confirm — mengembalikan Promise<boolean>. */
export function confirmDialog(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (emitConfirm) emitConfirm(String(message ?? ''), resolve);
    else resolve(true);
  });
}

const TOAST_STYLE: Record<ToastType, string> = {
  info: 'border-slate-200 bg-white text-slate-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
};

const TOAST_ICON: Record<ToastType, string> = {
  info: 'ℹ️',
  success: '✅',
  error: '⛔',
  warning: '⚠️',
};

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastSeq;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const openConfirm = useCallback((message: string, resolve: (v: boolean) => void) => {
    setConfirmState({ message, resolve });
  }, []);

  useEffect(() => {
    emitToast = addToast;
    emitConfirm = openConfirm;

    // Modernisasi otomatis: semua pemanggilan alert() lama menjadi toast.
    const nativeAlert = window.alert;
    window.alert = (msg?: any) => {
      addToast(String(msg ?? ''), 'info');
    };

    return () => {
      emitToast = null;
      emitConfirm = null;
      window.alert = nativeAlert;
    };
  }, [addToast, openConfirm]);

  const answerConfirm = (value: boolean) => {
    if (confirmState) {
      confirmState.resolve(value);
      setConfirmState(null);
    }
  };

  return (
    <>
      {children}

      {/* ===== TOAST CONTAINER ===== */}
      <div className="fixed top-4 right-4 z-[100000] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg text-sm font-medium animate-fade-in ${TOAST_STYLE[t.type]}`}
            role="status"
          >
            <span className="shrink-0 text-base leading-5">{TOAST_ICON[t.type]}</span>
            <span className="flex-1 leading-relaxed break-words whitespace-pre-line">{t.message}</span>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="shrink-0 text-gray-400 hover:text-gray-700 font-bold leading-none px-1"
              aria-label="Tutup notifikasi"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* ===== CONFIRM DIALOG ===== */}
      {confirmState && (
        <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => answerConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{confirmState.message}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => answerConfirm(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => answerConfirm(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
