import {useState} from 'react';
import {WorkoutSession} from '../types/workout.types';
import {workoutService} from '../services/api';
import {useAuth} from './useAuth';
import {useToast} from './useToast';

export const useWorkouts = () => {
  const {token} = useAuth();
  const {toastError, toastSuccess} = useToast();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load workouts for a user
  const loadWorkouts = async (userId: string, filters?: any) => {
    setIsLoading(true);
    try {
      const data = await workoutService.getWorkoutSessions(
        userId,
        filters,
        token || undefined,
      );
      setWorkouts(data);
    } catch (err) {
      toastError('Erreur', 'Impossible de charger les séances');
    } finally {
      setIsLoading(false);
    }
  };

  // Like/unlike workout
  const toggleLike = async (workoutId: string) => {
    const workout = workouts?.find(w => w.sessionId === workoutId);
    if (!workout) {
      return;
    }

    try {
      if (workout.userLiked) {
        await workoutService.unlikeWorkout(workoutId, token || undefined);
      } else {
        await workoutService.likeWorkout(workoutId, token || undefined);
      }

      // Mettre à jour localement
      setWorkouts(prev =>
        prev.map(w => {
          if (w.sessionId === workoutId) {
            const newLiked = !w.userLiked;
            return {
              ...w,
              userLiked: newLiked,
              likes: (w.likes || 0) + (newLiked ? 1 : -1),
            };
          }
          return w;
        }),
      );

      toastSuccess(workout.userLiked ? 'Like retiré' : 'Séance likée !');
    } catch (error) {
      toastError('Erreur', 'Impossible de modifier le like');
    }
  };

  return {
    workouts,
    isLoading,
    loadWorkouts,
    toggleLike,
  };
};
