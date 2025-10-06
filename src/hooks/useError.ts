/**
 * useError Hook
 *
 * Custom hook for error handling and display
 */

import {useState, useCallback} from 'react';

interface ErrorState {
  message: string;
  code?: string;
  details?: any;
}

interface UseErrorReturn {
  error: ErrorState | null;
  hasError: boolean;
  setError: (error: string | Error | ErrorState) => void;
  clearError: () => void;
  handleError: (error: unknown) => void;
}

export const useError = (): UseErrorReturn => {
  const [error, setErrorState] = useState<ErrorState | null>(null);

  const setError = useCallback((err: string | Error | ErrorState) => {
    if (typeof err === 'string') {
      setErrorState({message: err});
    } else if (err instanceof Error) {
      setErrorState({
        message: err.message,
        code: 'ERROR',
        details: err.stack,
      });
    } else {
      setErrorState(err);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleError = useCallback(
    (err: unknown) => {
      console.error('Error caught:', err);

      if (err instanceof Error) {
        setError(err);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Une erreur inattendue est survenue');
      }
    },
    [setError],
  );

  return {
    error,
    hasError: error !== null,
    setError,
    clearError,
    handleError,
  };
};

/**
 * useAsyncError Hook
 *
 * Hook for handling errors in async operations with loading state
 */

interface UseAsyncErrorReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: ErrorState | null;
  execute: (asyncFn: () => Promise<T>) => Promise<void>;
  reset: () => void;
}

export const useAsyncError = <T = any>(): UseAsyncErrorReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {error, setError, clearError} = useError();

  const execute = useCallback(
    async (asyncFn: () => Promise<T>) => {
      try {
        setIsLoading(true);
        clearError();
        const result = await asyncFn();
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError('Une erreur est survenue');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, setError],
  );

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    clearError();
  }, [clearError]);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
};
