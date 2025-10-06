/**
 * Mock Workout Programs
 *
 * These are example programs that simulate data coming from the backend.
 * Once the backend is ready, replace this with actual API calls.
 */

import {
  WorkoutProgram,
  FreeModeConfig,
  TargetRepsConfig,
  MaxTimeConfig,
  SetsRepsConfig,
  PyramidConfig,
  EMOMConfig,
  AMRAPConfig,
} from '../types/workout.types';

// ============================================================================
// Example Programs
// ============================================================================

export const FREE_MODE_STANDARD: FreeModeConfig = {
  id: 'free-mode-standard',
  name: 'Mode Libre',
  description: 'Fais autant de pompes que tu veux, à ton rythme',
  type: 'FREE_MODE',
  variant: 'STANDARD',
  difficulty: 'BEGINNER',
};

export const TARGET_50_REPS: TargetRepsConfig = {
  id: 'target-50',
  name: 'Objectif 50',
  description: 'Atteins 50 pompes en une seule série',
  type: 'TARGET_REPS',
  variant: 'STANDARD',
  difficulty: 'BEGINNER',
  targetReps: 50,
};

export const TARGET_100_REPS: TargetRepsConfig = {
  id: 'target-100',
  name: 'Century Challenge',
  description: "Le défi ultime : 100 pompes d'affilée",
  type: 'TARGET_REPS',
  variant: 'STANDARD',
  difficulty: 'ADVANCED',
  targetReps: 100,
  timeLimit: 600,
};

export const MAX_2_MINUTES: MaxTimeConfig = {
  id: 'max-2min',
  name: 'Max en 2 minutes',
  description: 'Fais le maximum de pompes en 2 minutes',
  type: 'MAX_TIME',
  variant: 'STANDARD',
  difficulty: 'INTERMEDIATE',
  duration: 120,
  allowRest: true,
};

export const BEGINNER_SETS: SetsRepsConfig = {
  id: 'beginner-3x8',
  name: 'Débutant - 3x8',
  description: '3 séries de 8 répétitions, parfait pour commencer',
  type: 'SETS_REPS',
  variant: 'INCLINE',
  difficulty: 'BEGINNER',
  sets: 3,
  repsPerSet: 8,
  restBetweenSets: 60,
};

export const INTERMEDIATE_SETS: SetsRepsConfig = {
  id: 'intermediate-4x12',
  name: 'Intermédiaire - 4x12',
  description: '4 séries de 12 répétitions',
  type: 'SETS_REPS',
  variant: 'STANDARD',
  difficulty: 'INTERMEDIATE',
  sets: 4,
  repsPerSet: 12,
  restBetweenSets: 45,
};

export const ADVANCED_SETS: SetsRepsConfig = {
  id: 'advanced-5x15',
  name: 'Avancé - 5x15',
  description: '5 séries de 15 répétitions',
  type: 'SETS_REPS',
  variant: 'STANDARD',
  difficulty: 'ADVANCED',
  sets: 5,
  repsPerSet: 15,
  restBetweenSets: 60,
};

export const DIAMOND_TRICEPS: SetsRepsConfig = {
  id: 'diamond-3x10',
  name: 'Triceps Focus - 3x10',
  description: 'Pompes diamant pour développer les triceps',
  type: 'SETS_REPS',
  variant: 'DIAMOND',
  difficulty: 'ADVANCED',
  sets: 3,
  repsPerSet: 10,
  restBetweenSets: 60,
};

export const PYRAMID_CLASSIC: PyramidConfig = {
  id: 'pyramid-classic',
  name: 'Pyramide Classique',
  description: 'Monte puis descend : 5-10-15-10-5',
  type: 'PYRAMID',
  variant: 'STANDARD',
  difficulty: 'BEGINNER',
  repsSequence: [5, 10, 15, 10, 5],
  restBetweenSets: 45,
};

export const PYRAMID_ADVANCED: PyramidConfig = {
  id: 'pyramid-advanced',
  name: 'Pyramide Avancée',
  description: 'Pour les guerriers : 10-15-20-25-20-15-10',
  type: 'PYRAMID',
  variant: 'STANDARD',
  difficulty: 'ADVANCED',
  repsSequence: [10, 15, 20, 25, 20, 15, 10],
  restBetweenSets: 60,
};

export const EMOM_10: EMOMConfig = {
  id: 'emom-10',
  name: 'EMOM 10 minutes',
  description: '10 pompes au début de chaque minute pendant 10 minutes',
  type: 'EMOM',
  variant: 'STANDARD',
  difficulty: 'INTERMEDIATE',
  repsPerMinute: 10,
  totalMinutes: 10,
};

export const AMRAP_5: AMRAPConfig = {
  id: 'amrap-5',
  name: 'AMRAP 5 minutes',
  description: 'Maximum de répétitions en 5 minutes',
  type: 'AMRAP',
  variant: 'STANDARD',
  difficulty: 'ADVANCED',
  duration: 300,
};

export const DECLINE_UPPER_CHEST: SetsRepsConfig = {
  id: 'decline-4x10',
  name: 'Pectoraux Hauts - 4x10',
  description: 'Pompes déclinées pour cibler le haut des pectoraux',
  type: 'SETS_REPS',
  variant: 'DECLINE',
  difficulty: 'ADVANCED',
  sets: 4,
  repsPerSet: 10,
  restBetweenSets: 60,
};

export const WIDE_CHEST: SetsRepsConfig = {
  id: 'wide-3x12',
  name: 'Pectoraux Larges - 3x12',
  description: 'Pompes larges pour développer la largeur',
  type: 'SETS_REPS',
  variant: 'WIDE',
  difficulty: 'ADVANCED',
  sets: 3,
  repsPerSet: 12,
  restBetweenSets: 45,
};

export const PIKE_SHOULDERS: SetsRepsConfig = {
  id: 'pike-3x8',
  name: 'Épaules Pike - 3x8',
  description: 'Pompes pike pour renforcer les épaules',
  type: 'SETS_REPS',
  variant: 'PIKE',
  difficulty: 'ADVANCED',
  sets: 3,
  repsPerSet: 8,
  restBetweenSets: 60,
};

// ============================================================================
// Program Collections
// ============================================================================

export const ALL_PROGRAMS: WorkoutProgram[] = [
  TARGET_50_REPS,
  TARGET_100_REPS,
  MAX_2_MINUTES,
  BEGINNER_SETS,
  INTERMEDIATE_SETS,
  ADVANCED_SETS,
  DIAMOND_TRICEPS,
  PYRAMID_CLASSIC,
  PYRAMID_ADVANCED,
  EMOM_10,
  AMRAP_5,
  DECLINE_UPPER_CHEST,
  WIDE_CHEST,
  PIKE_SHOULDERS,
];

export const BEGINNER_PROGRAMS: WorkoutProgram[] = [
  BEGINNER_SETS,
  TARGET_50_REPS,
];

export const INTERMEDIATE_PROGRAMS: WorkoutProgram[] = [
  INTERMEDIATE_SETS,
  MAX_2_MINUTES,
  PYRAMID_CLASSIC,
  DIAMOND_TRICEPS,
];

export const ADVANCED_PROGRAMS: WorkoutProgram[] = [
  ADVANCED_SETS,
  TARGET_100_REPS,
  PYRAMID_ADVANCED,
  EMOM_10,
  AMRAP_5,
];

export const PROGRAMS_BY_VARIANT: Record<string, WorkoutProgram[]> = {
  STANDARD: [
    FREE_MODE_STANDARD,
    TARGET_50_REPS,
    TARGET_100_REPS,
    MAX_2_MINUTES,
    INTERMEDIATE_SETS,
    ADVANCED_SETS,
    PYRAMID_CLASSIC,
    PYRAMID_ADVANCED,
    EMOM_10,
    AMRAP_5,
  ],
  INCLINE: [BEGINNER_SETS],
  DECLINE: [DECLINE_UPPER_CHEST],
  DIAMOND: [DIAMOND_TRICEPS],
  WIDE: [WIDE_CHEST],
  PIKE: [PIKE_SHOULDERS],
};

export const PROGRAMS_BY_TYPE: Record<string, WorkoutProgram[]> = {
  FREE_MODE: [FREE_MODE_STANDARD],
  TARGET_REPS: [TARGET_50_REPS, TARGET_100_REPS],
  MAX_TIME: [MAX_2_MINUTES],
  SETS_REPS: [
    BEGINNER_SETS,
    INTERMEDIATE_SETS,
    ADVANCED_SETS,
    DIAMOND_TRICEPS,
    DECLINE_UPPER_CHEST,
    WIDE_CHEST,
    PIKE_SHOULDERS,
  ],
  PYRAMID: [PYRAMID_CLASSIC, PYRAMID_ADVANCED],
  EMOM: [EMOM_10],
  AMRAP: [AMRAP_5],
};

// ============================================================================
// Mock API Functions (to be replaced with real API)
// ============================================================================

/**
 * Simulate fetching all programs from backend
 */
export async function fetchAllPrograms(): Promise<WorkoutProgram[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return ALL_PROGRAMS;
}

/**
 * Simulate fetching programs by difficulty
 */
export async function fetchProgramsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced',
): Promise<WorkoutProgram[]> {
  await new Promise(resolve => setTimeout(resolve, 500));

  switch (difficulty) {
    case 'beginner':
      return BEGINNER_PROGRAMS;
    case 'intermediate':
      return INTERMEDIATE_PROGRAMS;
    case 'advanced':
      return ADVANCED_PROGRAMS;
    default:
      return [];
  }
}

/**
 * Simulate fetching a single program by ID
 */
export async function fetchProgramById(
  id: string,
): Promise<WorkoutProgram | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return ALL_PROGRAMS.find(p => p.id === id) || null;
}

/**
 * Simulate saving a workout session to backend
 */
export async function saveWorkoutSession(
  session: any,
): Promise<{success: boolean; sessionId: string}> {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Saving workout session:', session);
  return {
    success: true,
    sessionId: session.sessionId,
  };
}

/**
 * Simulate creating a custom program
 */
export async function createCustomProgram(
  program: WorkoutProgram,
): Promise<{success: boolean; program: WorkoutProgram}> {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Creating custom program:', program);
  return {
    success: true,
    program: {...program, isCustom: true},
  };
}
