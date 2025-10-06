import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {WorkoutProgram, WorkoutSession} from './workout.types';

// Types pour AuthStack
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

// Types pour TrainingStack
export type TrainingStackParamList = {
  Training: undefined;
  Libre: {program?: WorkoutProgram};
  Timer: {duration: number};
  Serie: {sets: number; reps: number};
  PushUpSummary: {
    session: WorkoutSession;
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
};

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
