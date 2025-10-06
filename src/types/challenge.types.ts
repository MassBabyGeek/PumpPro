import {WorkoutProgramType, PushUpVariant, DifficultyLevel} from './workout.types';

// ============================================================================
// Challenge Types
// ============================================================================

export type ChallengeCategory =
  | 'DAILY' // Challenge quotidien
  | 'WEEKLY' // Challenge hebdomadaire
  | 'MONTHLY' // Challenge mensuel
  | 'SPECIAL' // Challenge spécial/événement
  | 'COMMUNITY'; // Challenge communautaire

export type ChallengeStatus = 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'EXPIRED';

// ============================================================================
// Challenge Tasks
// ============================================================================

export interface ChallengeTask {
  id: string;
  challengeId: string;
  day: number; // Jour du challenge (1, 2, 3, etc.)
  title: string;
  description: string;
  type: WorkoutProgramType;
  variant: PushUpVariant;

  // Objectifs de la tâche
  targetReps?: number;
  duration?: number;
  sets?: number;
  repsPerSet?: number;

  // État utilisateur
  completed: boolean;
  completedAt?: Date;
  score?: number; // Score obtenu (nombre de reps réalisées, etc.)

  // Planning
  scheduledDate?: Date;
  isLocked?: boolean; // Bloqué jusqu'à ce que la tâche précédente soit complétée
}

// ============================================================================
// Challenge Interface
// ============================================================================

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  type: WorkoutProgramType;
  variant: PushUpVariant;
  difficulty: DifficultyLevel;

  // Objectifs
  targetReps?: number;
  duration?: number; // en secondes
  sets?: number;
  repsPerSet?: number;

  // Métadonnées
  imageUrl?: string;
  iconName: string;
  iconColor: string;

  // Statistiques
  participants: number;
  completions: number;
  likes: number;

  // Récompenses
  points: number;
  badge?: string;

  // Dates
  startDate?: Date;
  endDate?: Date;

  // État
  status: ChallengeStatus;
  userCompleted?: boolean;
  userLiked?: boolean;

  // Tags
  tags: string[];

  // Créateur (pour challenges communautaires)
  createdBy?: string;
  creatorName?: string;
  isOfficial: boolean;

  // Tâches du challenge
  tasks?: ChallengeTask[];
  totalDays?: number; // Nombre de jours du challenge
}

// ============================================================================
// Challenge Filters
// ============================================================================

export type ChallengeSortBy =
  | 'POPULAR' // Plus effectués
  | 'LIKED' // Plus aimés
  | 'RECENT' // Plus récents
  | 'DIFFICULTY' // Par difficulté
  | 'POINTS'; // Par points

export interface ChallengeFilters {
  category?: ChallengeCategory;
  difficulty?: DifficultyLevel;
  type?: WorkoutProgramType;
  variant?: PushUpVariant;
  status?: ChallengeStatus;
  sortBy: ChallengeSortBy;
  searchQuery?: string;
}

// ============================================================================
// User Challenge Progress
// ============================================================================

export interface UserChallengeProgress {
  challengeId: string;
  userId: string;
  progress: number; // 0-100%
  currentReps: number;
  targetReps: number;
  completedAt?: Date;
  attempts: number;
  bestScore?: number;
}

// ============================================================================
// Labels & Metadata
// ============================================================================

export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  DAILY: '📅 Quotidien',
  WEEKLY: '📆 Hebdomadaire',
  MONTHLY: '📊 Mensuel',
  SPECIAL: '⭐ Spécial',
  COMMUNITY: '👥 Communauté',
};

export const CATEGORY_COLORS: Record<ChallengeCategory, string> = {
  DAILY: '#FF6B6B',
  WEEKLY: '#4ECDC4',
  MONTHLY: '#45B7D1',
  SPECIAL: '#FFA07A',
  COMMUNITY: '#98D8C8',
};

export const SORT_LABELS: Record<ChallengeSortBy, string> = {
  POPULAR: '🔥 Populaires',
  LIKED: '❤️ Les plus aimés',
  RECENT: '🆕 Récents',
  DIFFICULTY: '📊 Difficulté',
  POINTS: '⭐ Points',
};
