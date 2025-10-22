import {useState, useCallback, useEffect} from 'react';
import {WorkoutProgram} from '../types/workout.types';
import {programService} from '../services/api';
import {storageService} from '../services/storage.service';
import {syncService} from '../services/sync.service';
import {STORAGE_KEYS} from '../types/offline.types';
import {useToast} from './useToast';
import {useOffline} from './useOffline';

export const usePrograms = (
  initialPrograms?: WorkoutProgram[],
  onProgramUpdate?: (
    programId: string,
    userLiked: boolean,
    likes: number,
  ) => void,
) => {
  const {toastError, toastSuccess} = useToast();
  const {isOnline} = useOffline();
  const [programs, setPrograms] = useState<WorkoutProgram[]>(
    initialPrograms || [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [cacheLoaded, setCacheLoaded] = useState(false);

  // Auto-load cache on mount
  useEffect(() => {
    const loadCache = async () => {
      try {
        const cached = await storageService.getCache<WorkoutProgram[]>(
          STORAGE_KEYS.PROGRAMS,
        );
        if (cached && cached.length > 0) {
          setPrograms(cached);
          setIsCached(true);
          setCacheLoaded(true);
          console.log('[usePrograms] Auto-loaded cache on mount');
        } else {
          setCacheLoaded(true);
        }
      } catch (err) {
        console.error('[usePrograms] Failed to auto-load cache:', err);
        setCacheLoaded(true);
      }
    };

    loadCache();
  }, []);

  // Update programs when initialPrograms changes
  useEffect(() => {
    if (initialPrograms && initialPrograms.length > 0) {
      setPrograms(initialPrograms);
    }
  }, [initialPrograms]);

  // Load programs (cache-first strategy)
  const loadPrograms = useCallback(
    async (filters?: any) => {
      setIsLoading(true);

      // 1. Try loading from cache first
      try {
        const cached = await storageService.getCache<WorkoutProgram[]>(
          STORAGE_KEYS.PROGRAMS,
        );
        if (cached && cached.length > 0) {
          setPrograms(cached);
          setIsCached(true);
          console.log('[usePrograms] Loaded from cache');
        }
      } catch (err) {
        console.error('[usePrograms] Cache load error:', err);
      }

      // 2. If online, fetch fresh data and update cache
      if (isOnline) {
        try {
          const data = await programService.getPrograms(filters);
          setPrograms(data);
          setIsCached(false);

          // Update cache
          await storageService.setCache(STORAGE_KEYS.PROGRAMS, data);
          console.log('[usePrograms] Fetched fresh data and updated cache');
        } catch (err) {
          if (programs.length === 0) {
            toastError('Erreur', 'Impossible de charger les programmes');
          }
        }
      } else {
        console.log('[usePrograms] Offline mode, using cached data only');
      }

      setIsLoading(false);
    },
    [toastError, isOnline, programs.length],
  );

  // Like/unlike program (with offline support)
  const toggleLike = async (programId: string) => {
    const program = programs?.find(p => p.id === programId);
    console.log('toggleLike program', programId, program, programs);
    if (!program) return;

    const newLiked = !program.userLiked;
    const newLikes = (program.likes || 0) + (newLiked ? 1 : -1);

    // Mise à jour optimiste locale
    const updatedPrograms = programs.map(p => {
      if (p.id === programId) {
        return {
          ...p,
          userLiked: newLiked,
          likes: newLikes,
        };
      }
      return p;
    });

    setPrograms(updatedPrograms);

    // Sauvegarder le cache immédiatement pour persister les changements
    try {
      await storageService.setCache(STORAGE_KEYS.PROGRAMS, updatedPrograms);
      console.log('[usePrograms] Cache updated after like toggle');
    } catch (err) {
      console.error('[usePrograms] Failed to update cache:', err);
    }

    // Notifier le parent (useWorkoutPrograms) pour mettre à jour aussi
    if (onProgramUpdate) {
      onProgramUpdate(programId, newLiked, newLikes);
    }

    if (isOnline) {
      try {
        if (program.userLiked) {
          await programService.unlikeProgram(programId);
        } else {
          await programService.likeProgram(programId);
        }

        toastSuccess(program.userLiked ? 'Like retiré' : 'Programme liké !');
      } catch (error) {
        // Rollback en cas d'erreur
        const rolledBackPrograms = programs.map(p => {
          if (p.id === programId) {
            return {
              ...p,
              userLiked: program.userLiked,
              likes: program.likes || 0,
            };
          }
          return p;
        });
        setPrograms(rolledBackPrograms);

        // Rollback cache aussi
        await storageService.setCache(
          STORAGE_KEYS.PROGRAMS,
          rolledBackPrograms,
        );

        if (onProgramUpdate) {
          onProgramUpdate(
            programId,
            program.userLiked || false,
            program.likes || 0,
          );
        }
        toastError('Erreur', 'Impossible de modifier le like');
      }
    } else {
      // Offline: add to sync queue
      const action = newLiked ? 'LIKE_PROGRAM' : 'UNLIKE_PROGRAM';
      await syncService.addAction(action, {programId});
      toastSuccess(
        newLiked ? 'Like ajouté (hors ligne)' : 'Like retiré (hors ligne)',
        'Sera synchronisé plus tard',
      );
    }
  };

  return {
    programs,
    isLoading,
    isCached,
    loadPrograms,
    toggleLike,
  };
};
