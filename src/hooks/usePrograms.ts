import {useState, useCallback, useEffect} from 'react';
import {WorkoutProgram} from '../types/workout.types';
import {programService} from '../services/api';
import {useAuth} from './useAuth';
import {useToast} from './useToast';

export const usePrograms = (
  initialPrograms?: WorkoutProgram[],
  onProgramUpdate?: (programId: string, userLiked: boolean, likes: number) => void,
) => {
  const {getToken} = useAuth();
  const {toastError, toastSuccess} = useToast();
  const [programs, setPrograms] = useState<WorkoutProgram[]>(
    initialPrograms || [],
  );
  const [isLoading, setIsLoading] = useState(false);

  // Update programs when initialPrograms changes
  useEffect(() => {
    if (initialPrograms && initialPrograms.length > 0) {
      setPrograms(initialPrograms);
    }
  }, [initialPrograms]);

  // Load programs
  const loadPrograms = useCallback(
    async (filters?: any) => {
      setIsLoading(true);
      const token = await getToken();
      try {
        const data = await programService.getPrograms(
          filters,
          token || undefined,
        );
        setPrograms(data);
      } catch (err) {
        toastError('Erreur', 'Impossible de charger les programmes');
      } finally {
        setIsLoading(false);
      }
    },
    [getToken, toastError],
  );

  // Like/unlike program
  const toggleLike = async (programId: string) => {
    const program = programs?.find(p => p.id === programId);
    console.log('toggleLike program', programId, program, programs);
    if (!program) return;

    const newLiked = !program.userLiked;
    const newLikes = (program.likes || 0) + (newLiked ? 1 : -1);

    // Mise à jour optimiste locale
    setPrograms(prev =>
      prev.map(p => {
        if (p.id === programId) {
          return {
            ...p,
            userLiked: newLiked,
            likes: newLikes,
          };
        }
        return p;
      }),
    );

    // Notifier le parent (useWorkoutPrograms) pour mettre à jour aussi
    if (onProgramUpdate) {
      onProgramUpdate(programId, newLiked, newLikes);
    }

    const token = await getToken();
    try {
      if (program.userLiked) {
        await programService.unlikeProgram(programId, token || undefined);
      } else {
        await programService.likeProgram(programId, token || undefined);
      }

      toastSuccess(program.userLiked ? 'Like retiré' : 'Programme liké !');
    } catch (error) {
      // Rollback en cas d'erreur
      setPrograms(prev =>
        prev.map(p => {
          if (p.id === programId) {
            return {
              ...p,
              userLiked: program.userLiked,
              likes: program.likes || 0,
            };
          }
          return p;
        }),
      );
      if (onProgramUpdate) {
        onProgramUpdate(programId, program.userLiked || false, program.likes || 0);
      }
      toastError('Erreur', 'Impossible de modifier le like');
    }
  };

  return {
    programs,
    isLoading,
    loadPrograms,
    toggleLike,
  };
};
