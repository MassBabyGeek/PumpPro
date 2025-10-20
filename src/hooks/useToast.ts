import {useCallback} from 'react';
import Toast from 'react-native-toast-message';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastConfig {
  title: string;
  message?: string;
  duration?: number;
}

export const useToast = () => {
  const showToast = useCallback((type: ToastType, config: ToastConfig) => {
    Toast.show({
      type: type,
      text1: config.title,
      text2: config.message,
      visibilityTime: config.duration || 3000,
      position: 'top',
      topOffset: 60,
    });
  }, []);

  const toastSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast('success', {title, message, duration});
    },
    [showToast],
  );

  const toastError = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast('error', {title, message, duration});
    },
    [showToast],
  );

  const toastInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast('info', {title, message, duration});
    },
    [showToast],
  );

  const toastWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast('warning', {title, message, duration});
    },
    [showToast],
  );

  return {
    toastError,
    toastSuccess,
    toastInfo,
    toastWarning,
  };
};
