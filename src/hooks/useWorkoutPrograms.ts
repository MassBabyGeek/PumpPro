/**
 * useWorkoutPrograms Hook
 *
 * Custom hook for fetching and managing workout programs
 */

import {useState, useEffect, useCallback} from 'react';
import {WorkoutProgram} from '../types/workout.types';
import {
  fetchAllPrograms,
  fetchProgramsByDifficulty,
  fetchProgramById,
  createCustomProgram,
} from '../data/workoutPrograms.mock';

interface UseWorkoutProgramsReturn {
  programs: WorkoutProgram[];
  isLoading: boolean;
  error: string | null;
  refreshPrograms: () => Promise<void>;
  getProgramById: (id: string) => Promise<WorkoutProgram | null>;
  createProgram: (program: WorkoutProgram) => Promise<WorkoutProgram>;
}

export const useWorkoutPrograms = (
  difficulty?: 'beginner' | 'intermediate' | 'advanced',
): UseWorkoutProgramsReturn => {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrograms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = difficulty
        ? await fetchProgramsByDifficulty(difficulty)
        : await fetchAllPrograms();

      setPrograms(data);
    } catch (err) {
      console.error('Error loading programs:', err);
      setError(
        err instanceof Error ? err.message : 'Erreur lors du chargement',
      );
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
      return await fetchProgramById(id);
    } catch (err) {
      console.error('Error fetching program:', err);
      return null;
    }
  }, []);

  const createProgram = useCallback(async (program: WorkoutProgram) => {
    try {
      const result = await createCustomProgram(program);
      await loadPrograms(); // Refresh after creating
      return result.program;
    } catch (err) {
      console.error('Error creating program:', err);
      throw err;
    }
  }, [loadPrograms]);

  return {
    programs,
    isLoading,
    error,
    refreshPrograms,
    getProgramById,
    createProgram,
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

export const useProgram = (id: string): UseProgramReturn => {
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProgram = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProgramById(id);
        setProgram(data);
      } catch (err) {
        console.error('Error loading program:', err);
        setError(
          err instanceof Error ? err.message : 'Erreur lors du chargement',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProgram();
  }, [id]);

  return {program, isLoading, error};
};
