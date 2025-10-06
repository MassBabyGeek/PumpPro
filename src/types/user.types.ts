export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  weight?: number;
  height?: number;
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
  totalTime: number;
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
