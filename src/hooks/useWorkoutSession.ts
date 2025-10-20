import {WorkoutSession} from '../types/workout.types';
import {useAuth} from './useAuth';
import {workoutService} from '../services/api';
import Toast from 'react-native-toast-message';

const useWorkoutSession = () => {
  const {getToken} = useAuth();

  const saveWorkoutSession = async (
    session: WorkoutSession,
    challengeId?: string,
    taskId?: string,
  ) => {
    try {
      // Get token at call time, not at hook initialization
      const token = await getToken();
      console.log('[useWorkoutSession] Saving session with token:', token ? 'present' : 'missing');

      await workoutService.saveWorkoutSession(
        {
          endTime: new Date(),
          ...session,
        },
        token || undefined,
      );
    } catch (error) {
      console.error('[useWorkoutSession] Error saving session:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de sauvegarder la session',
      });
    }
  };
  return {
    saveWorkoutSession,
  };
};

export default useWorkoutSession;
