import {WorkoutSession} from '../types/workout.types';
import {useOffline} from './useOffline';
import {workoutService} from '../services/api';
import {syncService} from '../services/sync.service';
import {storageService} from '../services/storage.service';
import {STORAGE_KEYS} from '../types/offline.types';
import {useToast} from './useToast';

const useWorkoutSession = () => {
  const {isOnline} = useOffline();
  const {toastSuccess, toastInfo} = useToast();

  const saveWorkoutSession = async (
    session: WorkoutSession,
    challengeId?: string,
    taskId?: string,
  ) => {
    const sessionData = {
      endTime: new Date(),
      ...session,
    };

    if (isOnline) {
      // Online: save directly to server
      try {
        await workoutService.saveWorkoutSession(sessionData);

        toastSuccess('Session sauvegardée !');

        // Update local cache
        try {
          const cached =
            (await storageService.getCache<WorkoutSession[]>(
              STORAGE_KEYS.WORKOUTS,
            )) || [];
          await storageService.setCache(STORAGE_KEYS.WORKOUTS, [
            sessionData,
            ...cached,
          ]);
        } catch (err) {
          // Failed to update cache
        }
      } catch (error) {
        // Fallback to offline queue if API fails
        await syncService.addAction('CREATE_SESSION', {
          session: sessionData,
          challengeId,
          taskId,
        });

        toastInfo('Session sauvegardée localement', 'Sera synchronisée plus tard');
      }
    } else {
      // Offline: add to sync queue
      await syncService.addAction('CREATE_SESSION', {
        session: sessionData,
        challengeId,
        taskId,
      });

      // Add to local cache immediately
      try {
        const cached =
          (await storageService.getCache<WorkoutSession[]>(
            STORAGE_KEYS.WORKOUTS,
          )) || [];
        await storageService.setCache(STORAGE_KEYS.WORKOUTS, [
          sessionData,
          ...cached,
        ]);
      } catch (err) {
        // Failed to update cache
      }

      toastSuccess('Session sauvegardée (hors ligne)', 'Sera synchronisée plus tard');
    }
  };

  return {
    saveWorkoutSession,
  };
};

export default useWorkoutSession;
