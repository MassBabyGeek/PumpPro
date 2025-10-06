export type WorkoutType = 'libre' | 'timer' | 'serie';

export type WorkoutMode = {
  label: string;
  subLabel: string;
  icon: string;
  color: string;
  disabled: boolean;
  route: string;
};

export type WorkoutSession = {
  id: string;
  type: WorkoutType;
  pushUpCount: number;
  elapsedTime: number;
  calories: number;
  date: string;
  averageSpeed?: number;
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
