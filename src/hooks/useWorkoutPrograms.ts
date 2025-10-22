/**
 * useWorkoutPrograms Hook
 *
 * Custom hook for fetching and managing workout programs
 */

import {useState, useEffect, useCallback} from 'react';
import {WorkoutProgram} from '../types/workout.types';
import {programService} from '../services/api';
import {useToast} from './useToast';

interface UseWorkoutProgramsReturn {
  programs: WorkoutProgram[];
  isLoading: boolean;
  error: string | null;
  refreshPrograms: () => Promise<void>;
  getProgramById: (id: string) => Promise<WorkoutProgram | null>;
  createProgram: (program: WorkoutProgram) => Promise<WorkoutProgram>;
  getProgramIcon: (type: string) => string;
  updateProgramLike: (programId: string, userLiked: boolean, likes: number) => void;
}

export const useWorkoutPrograms = (
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
): UseWorkoutProgramsReturn => {
  const {toastError, toastSuccess} = useToast();
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrograms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await programService.getPrograms(
        difficulty ? {difficulty} : undefined,
      );

      setPrograms(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      toastError('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, toastError]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const refreshPrograms = useCallback(async () => {
    await loadPrograms();
  }, [loadPrograms]);

  const getProgramById = useCallback(async (id: string) => {
    try {
      return await programService.getProgramById(id);
    } catch (err) {
      toastError('Erreur', 'Impossible de charger le programme');
      return null;
    }
  }, [toastError]);

  const createProgram = useCallback(
    async (program: WorkoutProgram) => {
      try {
        const result = await programService.createProgram(program);
        await loadPrograms(); // Refresh after creating
        toastSuccess('Succès', 'Programme créé avec succès');
        return result;
      } catch (err) {
        toastError('Erreur', 'Impossible de créer le programme');
        throw err;
      }
    },
    [loadPrograms, toastSuccess, toastError],
  );

  const getProgramIcon = (type: string) => {
    switch (type) {
      case 'FREE_MODE':
        return 'infinite';
      case 'TARGET_REPS':
        return 'flag';
      case 'MAX_TIME':
        return 'timer';
      case 'SETS_REPS':
        return 'layers';
      case 'PYRAMID':
        return 'triangle';
      case 'EMOM':
        return 'alarm';
      case 'AMRAP':
        return 'fitness';
      default:
        return 'help-circle';
    }
  };

  const updateProgramLike = useCallback(
    (programId: string, userLiked: boolean, likes: number) => {
      setPrograms(prev =>
        prev.map(p =>
          p.id === programId
            ? {...p, userLiked, likes}
            : p
        )
      );
    },
    []
  );

  return {
    programs,
    isLoading,
    error,
    refreshPrograms,
    getProgramById,
    createProgram,
    getProgramIcon,
    updateProgramLike,
  };
};

/**
 * useProgram Hook
 *
 * Hook for fetching a single program by ID
 */

interface UseProgramReturn {
  program: WorkoutProgram | null;
  isLoading: boolean;
  error: string | null;
}

export const useProgram = (id?: string): UseProgramReturn => {
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {toastError} = useToast();

  useEffect(() => {
    // Don't load if no ID provided
    if (!id) {
      setIsLoading(false);
      return;
    }

    const loadProgram = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await programService.getProgramById(id);
        setProgram(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors du chargement';
        setError(errorMessage);
        toastError('Erreur', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgram();
  }, [id, toastError]);

  return {program, isLoading, error};
};
