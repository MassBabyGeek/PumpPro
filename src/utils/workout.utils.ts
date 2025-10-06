import {CALORIES_PER_PUSHUP} from '../constants/workout.constants';

/**
 * Formate le temps en mm:ss
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calcule les calories brûlées
 */
export const calculateCalories = (pushUpCount: number): string => {
  return (pushUpCount * CALORIES_PER_PUSHUP).toFixed(2);
};

/**
 * Génère un ID unique pour une session
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formate une date en string lisible
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Calcule la vitesse moyenne (pompes/minute)
 */
export const calculateAverageSpeed = (
  pushUpCount: number,
  elapsedTime: number,
): number => {
  if (elapsedTime === 0) return 0;
  return Math.round((pushUpCount / elapsedTime) * 60);
};
