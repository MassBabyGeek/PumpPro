// ============================================================================
// Base Types
// ============================================================================

export type WorkoutProgramType =
  | 'FREE_MODE' // Mode libre - pas de limite
  | 'TARGET_REPS' // Objectif de pompes (ex: atteindre 50 pompes)
  | 'MAX_TIME' // Max de pompes en X temps (ex: 2 minutes)
  | 'SETS_REPS' // Séries x Répétitions (ex: 3x8)
  | 'PYRAMID' // Pyramide (ex: 5-10-15-10-5)
  | 'EMOM' // Every Minute On the Minute
  | 'AMRAP'; // As Many Reps As Possible in X time

export type PushUpVariant =
  | 'STANDARD' // Pompes classiques
  | 'INCLINE' // Pompes inclinées (mains surélevées)
  | 'DECLINE' // Pompes déclinées (pieds surélevés)
  | 'DIAMOND' // Pompes diamant
  | 'WIDE' // Pompes larges
  | 'PIKE' // Pompes pike (pour épaules)
  | 'ARCHER'; // Pompes archer

// ============================================================================
// Difficulty Levels
// ============================================================================

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// ============================================================================
// Workout Program Configurations
// ============================================================================

export interface BaseProgramConfig {
  id: string;
  name: string;
  description?: string;
  type: WorkoutProgramType;
  variant: PushUpVariant;
  difficulty: DifficultyLevel;
  restBetweenSets?: number;
  createdBy?: string;
  isCustom?: boolean;
}

export interface FreeModeConfig extends BaseProgramConfig {
  type: 'FREE_MODE';
}

export interface TargetRepsConfig extends BaseProgramConfig {
  type: 'TARGET_REPS';
  targetReps: number;
  timeLimit?: number; // optionnel: temps limite en secondes
}

export interface MaxTimeConfig extends BaseProgramConfig {
  type: 'MAX_TIME';
  duration: number; // en secondes
  allowRest: boolean; // pause permise ou pas
}

export interface SetsRepsConfig extends BaseProgramConfig {
  type: 'SETS_REPS';
  sets: number;
  repsPerSet: number;
  restBetweenSets: number; // obligatoire pour ce type
}

export interface PyramidConfig extends BaseProgramConfig {
  type: 'PYRAMID';
  repsSequence: number[]; // ex: [5, 10, 15, 10, 5]
  restBetweenSets: number; // obligatoire
}

export interface EMOMConfig extends BaseProgramConfig {
  type: 'EMOM';
  repsPerMinute: number;
  totalMinutes: number;
}

export interface AMRAPConfig extends BaseProgramConfig {
  type: 'AMRAP';
  duration: number; // en secondes
}

// Union type pour tous les programmes
export type WorkoutProgram =
  | FreeModeConfig
  | TargetRepsConfig
  | MaxTimeConfig
  | SetsRepsConfig
  | PyramidConfig
  | EMOMConfig
  | AMRAPConfig;

// ============================================================================
// Workout Session & Progress Tracking
// ============================================================================

export interface SetResult {
  setNumber: number;
  targetReps?: number;
  completedReps: number;
  duration: number; // en secondes
  timestamp: Date;
}

export interface WorkoutSession {
  sessionId: string;
  program: WorkoutProgram;
  startTime: Date;
  endTime?: Date;
  sets: SetResult[];
  totalReps: number;
  totalDuration: number; // en secondes
  completed: boolean; // objectif atteint ou non
  notes?: string;
  userId?: string;
}

// ============================================================================
// Real-time Workout State (for active workout)
// ============================================================================

export interface WorkoutState {
  program: WorkoutProgram;
  currentSet: number;
  totalSets: number;
  currentReps: number;
  targetRepsForCurrentSet?: number;
  totalReps: number;
  elapsedTime: number; // en secondes
  isResting: boolean;
  restTimeRemaining?: number; // en secondes
  isCompleted: boolean;
  isPaused: boolean;
}

// ============================================================================
// Legacy Types (to maintain compatibility)
// ============================================================================

export type WorkoutType = 'libre' | 'timer' | 'serie';

export type WorkoutMode = {
  label: string;
  subLabel: string;
  icon: string;
  color: string;
  disabled: boolean;
  route: string;
};

export type WorkoutStats = {
  totalWorkouts: number;
  totalPushUps: number;
  totalCalories: number;
  totalTime: number;
  bestSession: number;
  averagePushUps: number;
};

export type MovementState = 'idle' | 'down_detected' | 'up_detected';

// ============================================================================
// Program Metadata & Labels
// ============================================================================

export const VARIANT_LABELS: Record<PushUpVariant, string> = {
  STANDARD: 'Pompes classiques',
  INCLINE: 'Pompes inclinées',
  DECLINE: 'Pompes déclinées',
  DIAMOND: 'Pompes diamant',
  WIDE: 'Pompes larges',
  PIKE: 'Pompes pike',
  ARCHER: 'Pompes archer',
};

export const TYPE_LABELS: Record<WorkoutProgramType, string> = {
  FREE_MODE: 'Mode libre',
  TARGET_REPS: 'Objectif de répétitions',
  MAX_TIME: 'Maximum en temps limité',
  SETS_REPS: 'Séries x Répétitions',
  PYRAMID: 'Pyramide',
  EMOM: 'EMOM',
  AMRAP: 'AMRAP',
};

export const VARIANT_DESCRIPTIONS: Record<PushUpVariant, string> = {
  STANDARD: "Position classique, mains écartées à largeur d'épaules",
  INCLINE: 'Mains surélevées, plus facile pour débutants',
  DECLINE: 'Pieds surélevés, cible davantage le haut des pectoraux',
  DIAMOND: 'Mains rapprochées en diamant, focus sur les triceps',
  WIDE: 'Mains plus écartées, travail des pectoraux externes',
  PIKE: 'Position en V inversé, cible les épaules',
  ARCHER: 'Bras alternés, travail unilatéral avancé',
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  BEGINNER: '🐣 Débutant',
  INTERMEDIATE: '⚔️ Intermédiaire',
  ADVANCED: '🦾 Confirmé',
};
