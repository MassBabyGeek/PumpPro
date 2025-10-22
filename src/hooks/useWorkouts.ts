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
        console.log('[useWorkouts] 🔍 Cache check on mount:', {
          hasCached: !!cached,
          count: cached?.length || 0,
          key: STORAGE_KEYS.WORKOUTS,
        });
        if (cached && cached.length > 0) {
          setWorkouts(cached);
          setIsCached(true);
          setCacheLoaded(true);
          console.log(
            '[useWorkouts] ✅ Auto-loaded',
            cached.length,
            'workouts from cache',
          );
        } else {
          setCacheLoaded(true);
          console.log('[useWorkouts] ⚠️ No cache found on mount');
        }
      } catch (err) {
        console.error('[useWorkouts] ❌ Failed to auto-load cache:', err);
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
        console.log('[useWorkouts] Loaded from cache');
      }
    } catch (err) {
      console.error('[useWorkouts] Cache load error:', err);
    }

    // 2. If online, fetch fresh data and update cache
    if (isOnline) {
      try {
        console.log('[useWorkouts] 🌐 Fetching from API...');
        const data = await workoutService.getWorkoutSessions(userId, filters);
        console.log('[useWorkouts] ✅ API returned', data.length, 'workouts');
        setWorkouts(data);
        setIsCached(false);

        // Update cache
        await storageService.setCache(STORAGE_KEYS.WORKOUTS, data);
        console.log(
          '[useWorkouts] 💾 Cache saved with',
          data.length,
          'workouts',
        );
      } catch (err) {
        console.error('[useWorkouts] ❌ API error:', err);
        if (workouts.length === 0) {
          toastError('Erreur', 'Impossible de charger les séances');
        }
      }
    } else {
      console.log('[useWorkouts] 📴 Offline mode, using cached data only');
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
      console.log('[useWorkouts] Cache updated after like toggle');
    } catch (err) {
      console.error('[useWorkouts] Failed to update cache:', err);
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

  const returnValue = {
    workouts,
    isLoading,
    isCached,
    loadWorkouts,
    toggleLike,
  };

  // Debug log
  console.log('[useWorkouts] Returning:', {
    hasWorkouts: !!workouts,
    workoutsLength: workouts?.length || 0,
    hasLoadWorkouts: typeof loadWorkouts === 'function',
    hasToggleLike: typeof toggleLike === 'function',
  });

  return returnValue;
};
