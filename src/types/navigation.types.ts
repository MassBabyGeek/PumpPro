import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

// Types pour AuthStack
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

// Types pour TrainingStack
export type TrainingStackParamList = {
  Training: undefined;
  Libre: undefined;
  Timer: {duration: number};
  Serie: {sets: number; reps: number};
  PushUpSummary: {
    pushUpCount: number;
    elapsedTime: number;
    calories: string;
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

export type PushUpSummaryScreenRouteProp = RouteProp<
  TrainingStackParamList,
  'PushUpSummary'
>;

export type PushUpSummaryScreenNavigationProp = StackNavigationProp<
  TrainingStackParamList,
  'PushUpSummary'
>;
