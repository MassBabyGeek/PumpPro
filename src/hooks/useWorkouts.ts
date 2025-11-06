import {useState, useEffect} from 'react';
import {WorkoutSession} from '../types/workout.types';
import {workoutService} from '../services/api';
import {syncService} from '../services/sync.service';
import {storageService} from '../services/storage.service';
import {STORAGE_KEYS} from '../types/offline.types';
import {useToast} from './useToast';
import {useOffline} from './useOffline';

export const useWorkouts = () => {
  const {toastError, toastSuccess} = useToast();
  const {isOnline} = useOffline();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [cacheLoaded, setCacheLoaded] = useState(false);

  // Auto-load cache on mount
  useEffect(() => {
    const loadCache = async () => {
      try {
        const cached = await storageService.getCache<WorkoutSession[]>(
          STORAGE_KEYS.WORKOUTS,
        );
        if (cached && cached.length > 0) {
          setWorkouts(cached);
          setIsCached(true);
          setCacheLoaded(true);
        } else {
          setCacheLoaded(true);
        }
      } catch (err) {
        setCacheLoaded(true);
      }
    };

    loadCache();
  }, []);

  // Load workouts for a user (cache-first strategy)
  const loadWorkouts = async (userId: string, filters?: any) => {
    setIsLoading(true);

    // 1. Try loading from cache first
    try {
      const cached = await storageService.getCache<WorkoutSession[]>(
        STORAGE_KEYS.WORKOUTS,
      );
      if (cached && cached.length > 0) {
        setWorkouts(cached);
        setIsCached(true);
      }
    } catch (err) {
      // Erreur silencieuse
    }

    // 2. If online, fetch fresh data and update cache
    if (isOnline) {
      try {
        const data = await workoutService.getWorkoutSessions(userId, filters);
        setWorkouts(data);
        setIsCached(false);

        // Update cache
        await storageService.setCache(STORAGE_KEYS.WORKOUTS, data);
      } catch (err) {
        if (workouts.length === 0) {
          toastError('Erreur', 'Impossible de charger les séances');
        }
      }
    }

    setIsLoading(false);
  };

  // Like/unlike workout (with offline support)
  const toggleLike = async (workoutId: string) => {
    const workout = workouts?.find(w => w.sessionId === workoutId);
    if (!workout) {
      return;
    }

    const newLiked = !workout.userLiked;

    // Mettre à jour localement de manière optimiste
    const updatedWorkouts = workouts.map(w => {
      if (w.sessionId === workoutId) {
        return {
          ...w,
          userLiked: newLiked,
          likes: (w.likes || 0) + (newLiked ? 1 : -1),
        };
      }
      return w;
    });

    setWorkouts(updatedWorkouts);

    // Sauvegarder le cache immédiatement pour persister les changements
    try {
      await storageService.setCache(STORAGE_KEYS.WORKOUTS, updatedWorkouts);
    } catch (err) {
      // Erreur silencieuse
    }

    if (isOnline) {
      // Online: save directly
      try {
        if (workout.userLiked) {
          await workoutService.unlikeWorkout(workoutId);
        } else {
          await workoutService.likeWorkout(workoutId);
        }

        toastSuccess(workout.userLiked ? 'Like retiré' : 'Séance likée !');
      } catch (error) {
        // Rollback en cas d'erreur
        const rolledBackWorkouts = workouts.map(w => {
          if (w.sessionId === workoutId) {
            return {
              ...w,
              userLiked: workout.userLiked,
              likes: workout.likes || 0,
            };
          }
          return w;
        });
        setWorkouts(rolledBackWorkouts);

        // Rollback cache aussi
        await storageService.setCache(
          STORAGE_KEYS.WORKOUTS,
          rolledBackWorkouts,
        );

        toastError('Erreur', 'Impossible de modifier le like');
      }
    } else {
      // Offline: add to sync queue
      const action = newLiked ? 'LIKE_SESSION' : 'UNLIKE_SESSION';
      await syncService.addAction(action, {sessionId: workoutId});
      toastSuccess(
        newLiked ? 'Like ajouté (hors ligne)' : 'Like retiré (hors ligne)',
        'Sera synchronisé plus tard',
      );
    }
  };

  return {
    workouts,
    isLoading,
    isCached,
    loadWorkouts,
    toggleLike,
  };
};
