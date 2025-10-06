import {UserProfile, UserStats, ChartData} from '../types/user.types';

export const MOCK_USER: UserProfile = {
  id: 'user_123',
  name: 'Lucas Usereau',
  email: 'lucas@pompeurpro.com',
  age: 25,
  weight: 75,
  height: 180,
  goal: 'Atteindre 100 pompes d\'affilée',
  joinDate: '2024-01-15',
};

export const MOCK_STATS: UserStats = {
  today: {
    totalPushUps: 45,
    totalWorkouts: 2,
    totalCalories: 13.05,
    totalTime: 420, // 7 minutes
    averagePushUps: 22.5,
    bestSession: 28,
  },
  week: {
    totalPushUps: 312,
    totalWorkouts: 12,
    totalCalories: 90.48,
    totalTime: 2940, // 49 minutes
    averagePushUps: 26,
    bestSession: 42,
  },
  month: {
    totalPushUps: 1450,
    totalWorkouts: 58,
    totalCalories: 420.5,
    totalTime: 14520, // 242 minutes
    averagePushUps: 25,
    bestSession: 58,
  },
  year: {
    totalPushUps: 15240,
    totalWorkouts: 487,
    totalCalories: 4419.6,
    totalTime: 121800, // 2030 minutes
    averagePushUps: 31.3,
    bestSession: 75,
  },
};

// Données pour les graphiques
export const WEEK_CHART_DATA: ChartData = {
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  datasets: [
    {
      data: [42, 38, 51, 45, 48, 55, 33],
    },
  ],
};

export const MONTH_CHART_DATA: ChartData = {
  labels: ['S1', 'S2', 'S3', 'S4'],
  datasets: [
    {
      data: [280, 320, 410, 440],
    },
  ],
};

export const YEAR_CHART_DATA: ChartData = {
  labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  datasets: [
    {
      data: [950, 1120, 1340, 1280, 1450, 1520, 1390, 1180, 1240, 1380, 1470, 1920],
    },
  ],
};
