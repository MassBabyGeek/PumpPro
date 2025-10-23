import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {WorkoutSession, WorkoutProgram} from './workout.types';

// Types pour AuthStack
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

// Types pour TrainingStack
export type TrainingStackParamList = {
  Training: undefined;
  Libre: {
    programId?: string;
    program?: WorkoutProgram;
    challengeId?: string;
    taskId?: string;
  };
  Timer: {duration: number};
  Serie: {sets: number; reps: number};
  PushUpSummary: {
    session: WorkoutSession;
    challengeId?: string;
    taskId?: string;
  };
  ChallengeCompletion: {
    challengeId: string;
    totalReps: number;
    totalDuration: number;
    earnedPoints: number;
  };
};

export type ChallengeStackParamList = {
  ChallengeDetail: {
    challengeId: string;
  };
};

// Types pour TabsNavigator
export type TabsParamList = {
  Home: undefined;
  PushUp: undefined;
  Profile: undefined;
};

// Types pour AppStack
export type AppStackParamList = {
  HomeTabs: undefined;
  EditProfile: undefined;
  WorkoutSessions: undefined;
  UserProfile: {
    userId: string;
    userName?: string;
  };
  UserWorkoutSessions: {
    userId: string;
    userName?: string;
  };
};

export type ChallengeScreenNavigationProp = StackNavigationProp<
  ChallengeStackParamList,
  'ChallengeDetail'
>;

// Types de navigation pour les écrans
export type TrainingScreenNavigationProp = StackNavigationProp<
  TrainingStackParamList,
  'Training'
>;

export type LibreScreenRouteProp = RouteProp<TrainingStackParamList, 'Libre'>;

export type LibreScreenNavigationProp = StackNavigationProp<
  TrainingStackParamList,
  'Libre'
>;

export type PushUpSummaryScreenRouteProp = RouteProp<
  TrainingStackParamList,
  'PushUpSummary'
>;

export type PushUpSummaryScreenNavigationProp = StackNavigationProp<
  TrainingStackParamList,
  'PushUpSummary'
>;
