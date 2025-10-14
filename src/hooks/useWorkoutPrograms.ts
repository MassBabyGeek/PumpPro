/**
 * useWorkoutPrograms Hook
 *
 * Custom hook for fetching and managing workout programs
 */

import {useState, useEffect, useCallback} from 'react';
import {WorkoutProgram} from '../types/workout.types';
import {programService} from '../services/api';
import Toast from 'react-native-toast-message';
import {useAuth} from './useAuth';

interface UseWorkoutProgramsReturn {
  programs: WorkoutProgram[];
  isLoading: boolean;
  error: string | null;
  refreshPrograms: () => Promise<void>;
  getProgramById: (id: string) => Promise<WorkoutProgram | null>;
  createProgram: (program: WorkoutProgram) => Promise<WorkoutProgram>;
  getProgramIcon: (type: string) => string;
}

export const useWorkoutPrograms = (
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
): UseWorkoutProgramsReturn => {
  const {getToken} = useAuth();
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrograms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();
      const data = await programService.getPrograms(
        difficulty ? {difficulty} : undefined,
        token || undefined,
      );

      console.log('[usePrograms] Loaded programs:', data);

      setPrograms(data);
    } catch (err) {
      console.error('Error loading programs:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [difficulty]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const refreshPrograms = useCallback(async () => {
    await loadPrograms();
  }, [loadPrograms]);

  const getProgramById = useCallback(async (id: string) => {
    try {
      const token = await getToken();
      return await programService.getProgramById(id, token || undefined);
    } catch (err) {
      console.error('Error fetching program:', err);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger le programme',
      });
      return null;
    }
  }, []);

  const createProgram = useCallback(
    async (program: WorkoutProgram) => {
      const token = await getToken();
      try {
        const result = await programService.createProgram(
          program,
          token || undefined,
        );
        await loadPrograms(); // Refresh after creating
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Programme créé avec succès',
        });
        return result;
      } catch (err) {
        console.error('Error creating program:', err);
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'Impossible de créer le programme',
        });
        throw err;
      }
    },
    [loadPrograms],
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

  return {
    programs,
    isLoading,
    error,
    refreshPrograms,
    getProgramById,
    createProgram,
    getProgramIcon,
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
  const {getToken} = useAuth();

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
        const token = await getToken();
        const data = await programService.getProgramById(
          id,
          token || undefined,
        );
        setProgram(data);
      } catch (err) {
        console.error('Error loading program:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors du chargement';
        setError(errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProgram();
  }, [id]);

  return {program, isLoading, error};
};
