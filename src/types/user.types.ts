export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  weight?: number; // kg
  height?: number; // cm
  goal?: string;
  joinDate: string;
};

export type UserStats = {
  today: DayStats;
  week: DayStats;
  month: DayStats;
  year: DayStats;
};

export type DayStats = {
  totalPushUps: number;
  totalWorkouts: number;
  totalCalories: number;
  totalTime: number; // en secondes
  averagePushUps: number;
  bestSession: number;
};

export type ChartPeriod = 'week' | 'month' | 'year';

export type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
  }[];
};
