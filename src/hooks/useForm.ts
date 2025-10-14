/**
 * useForm Hook
 *
 * Custom hook for form state management and validation
 */

import {useState, useCallback} from 'react';

interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

interface FieldConfig<T> {
  initialValue: T;
  validators?: ValidationRule<T>[];
}

interface FormConfig<T extends Record<string, any>> {
  [key: string]: FieldConfig<T[keyof T]>;
}

interface UseFormReturn<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (field: keyof T, value: any) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (
    onSubmit: (values: T) => void | Promise<void>,
  ) => Promise<void>;
  reset: () => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  validateField: (field: keyof T) => boolean;
  validateAll: () => boolean;
}

export const useForm = <T extends Record<string, any>>(
  config: FormConfig<T>,
): UseFormReturn<T> => {
  // Initialize state from config
  const initialValues = Object.keys(config).reduce((acc, key) => {
    acc[key as keyof T] = config[key].initialValue;
    return acc;
  }, {} as T);

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback(
    (field: keyof T): boolean => {
      const fieldConfig = config[field as string];
      if (!fieldConfig || !fieldConfig.validators) {
        return true;
      }

      const value = values[field];
      for (const rule of fieldConfig.validators) {
        if (!rule.validate(value)) {
          setErrors(prev => ({...prev, [field]: rule.message}));
          return false;
        }
      }

      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
      return true;
    },
    [config, values],
  );

  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const fields = Object.keys(config) as (keyof T)[];

    for (const field of fields) {
      if (!validateField(field)) {
        isValid = false;
      }
    }

    return isValid;
  }, [config, validateField]);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({...prev, [field]: value}));
  }, []);

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched(prev => ({...prev, [field]: true}));
      validateField(field);
    },
    [validateField],
  );

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({...prev, [field]: value}));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({...prev, [field]: error}));
  }, []);

  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => void | Promise<void>) => {
      // Mark all fields as touched
      const allTouched = Object.keys(config).reduce(
        (acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        },
        {} as Record<keyof T, boolean>,
      );
      setTouched(allTouched);

      // Validate all fields
      if (validateAll()) {
        await onSubmit(values);
      }
    },
    [config, validateAll, values],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    validateField,
    validateAll,
  };
};

// Common validators
export const validators = {
  required: <T>(message = 'Ce champ est requis'): ValidationRule<T> => ({
    validate: (value: T) => {
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      return value !== null && value !== undefined;
    },
    message,
  }),

  email: (message = 'Email invalide'): ValidationRule<string> => ({
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => value.length >= min,
    message: message || `Minimum ${min} caractères`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => value.length <= max,
    message: message || `Maximum ${max} caractères`,
  }),

  min: (min: number, message?: string): ValidationRule<number> => ({
    validate: (value: number) => value >= min,
    message: message || `Valeur minimum: ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule<number> => ({
    validate: (value: number) => value <= max,
    message: message || `Valeur maximum: ${max}`,
  }),

  pattern: (
    regex: RegExp,
    message = 'Format invalide',
  ): ValidationRule<string> => ({
    validate: (value: string) => regex.test(value),
    message,
  }),
};
