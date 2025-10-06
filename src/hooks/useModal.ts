/**
 * useModal Hook
 *
 * Custom hook for managing modal state
 */

import {useState, useCallback} from 'react';

interface UseModalReturn {
  isVisible: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useModal = (initialState = false): UseModalReturn => {
  const [isVisible, setIsVisible] = useState(initialState);

  const open = useCallback(() => {
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggle = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return {
    isVisible,
    open,
    close,
    toggle,
  };
};

/**
 * useModalWithData Hook
 *
 * Modal hook with data payload
 */

interface UseModalWithDataReturn<T> {
  isVisible: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
}

export const useModalWithData = <T = any>(
  initialState = false,
): UseModalWithDataReturn<T> => {
  const [isVisible, setIsVisible] = useState(initialState);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((payload?: T) => {
    setIsVisible(true);
    if (payload !== undefined) {
      setData(payload);
    }
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setData(null);
  }, []);

  return {
    isVisible,
    data,
    open,
    close,
  };
};
