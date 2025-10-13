import {useEffect, useState} from 'react';
import {WorkoutSession} from '../types/workout.types';
import {useAuth} from './useAuth';
import {workoutService} from '../services/api';
import Toast from 'react-native-toast-message';

const useWorkoutSession = () => {
  const {getToken} = useAuth();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const token = await getToken();
      setToken(token);
    };
    init();
  }, [getToken]);

  const saveWorkoutSession = async (
    session: WorkoutSession,
    challengeId?: string,
    taskId?: string,
  ) => {
    try {
      await workoutService.saveWorkoutSession(
        {
          endTime: new Date(),
          ...session,
        },
        token || undefined,
      );
    } catch (error) {
      console.error('Error saving session:', error);
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
