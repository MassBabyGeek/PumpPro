import {BaseEntity} from './base.types';

export interface UserProfile extends BaseEntity {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  joinDate: string;
}

// Alias for backward compatibility
export type User = UserProfile;

export type AllStats = {
  today: Stats;
  week: Stats;
  month: Stats;
  year: Stats;
};

export type Stats = {
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
