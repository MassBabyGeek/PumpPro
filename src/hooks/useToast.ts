/**
 * useToast Hook
 *
 * Custom hook for showing toast notifications
 */

import {useState, useCallback} from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
  hideToast: (id: string) => void;
  clearAll: () => void;
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const toast: Toast = {id, message, type, duration};

      setToasts(prev => [...prev, toast]);

      // Auto-hide after duration
      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    [],
  );

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showSuccess = useCallback(
    (message: string) => showToast(message, 'success'),
    [showToast],
  );

  const showError = useCallback(
    (message: string) => showToast(message, 'error'),
    [showToast],
  );

  const showInfo = useCallback(
    (message: string) => showToast(message, 'info'),
    [showToast],
  );

  const showWarning = useCallback(
    (message: string) => showToast(message, 'warning'),
    [showToast],
  );

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideToast,
    clearAll,
  };
};
