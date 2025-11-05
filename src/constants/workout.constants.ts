import appColors from '../assets/colors';
import {WorkoutMode} from '../types/workout.types';

export const WORKOUT_MODES: WorkoutMode[] = [
  {
    label: 'Libre',
    subLabel: 'Sans limite !',
    icon: 'infinite-outline',
    color: appColors.primary,
    disabled: false,
    route: 'Libre',
  },
  {
    label: 'Timer',
    subLabel: 'Une session de 15 minutes ?',
    icon: 'hourglass-outline',
    color: appColors.primary,
    disabled: true,
    route: 'Timer',
  },
  {
    label: 'Série',
    subLabel: "3 séries t'attendent..",
    icon: 'repeat-outline',
    color: appColors.primary,
    disabled: true,
    route: 'Serie',
  },
];

// Constantes de calcul
export const CALORIES_PER_PUSHUP = 0.29;

// Constantes de détection de visage
// Logique inversée : 0 = proche (position basse), 100 = loin (position haute)
export const FACE_DETECTION = {
  MIN_FACE_WIDTH: 0.5,
  MAX_FACE_WIDTH: 1.6,
  CLOSE_THRESHOLD: 30, // Position basse : valeur basse (proche du sol)
  FAR_THRESHOLD: 60,   // Position haute : valeur haute (loin du sol)
} as const;
