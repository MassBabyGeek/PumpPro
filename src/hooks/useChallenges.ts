import {useState, useMemo, useEffect, useCallback} from 'react';
import {
  Challenge,
  ChallengeFilters,
  ChallengeSortBy,
  ChallengeCategory,
  ChallengeTask,
} from '../types/challenge.types';
import {DifficultyLevel, WorkoutProgram} from '../types/workout.types';
import {challengeService} from '../services/api';
import Toast from 'react-native-toast-message';
import {useAuth} from './useAuth';

export const useChallenges = (challengeId?: string) => {
  const {getToken} = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ChallengeFilters>({
    sortBy: 'POPULAR',
  });

  useEffect(() => {
    if (challengeId) {
      getChallengeById(challengeId);
    }
  }, [challengeId]);

  // Charger les challenges depuis l'API
  const loadChallenges = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = await getToken();
    try {
      const data = await challengeService.getChallenges(
        filters,
        token || undefined,
      );
      setChallenges(data);
    } catch (err) {
      const errorMessage = 'Erreur lors du chargement des challenges';
      setError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Charger les challenges au montage et quand les filtres changent
  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  // Filtrer et trier les challenges (côté client pour performance)
  const filteredChallenges = useMemo(() => {
    return challenges; // Le tri/filtre est déjà fait par l'API
  }, [challenges]);

  // Mettre à jour les filtres
  const updateFilters = (newFilters: Partial<ChallengeFilters>) => {
    setFilters(prev => ({...prev, ...newFilters}));
  };

  // Toggle catégorie
  const toggleCategory = (category: ChallengeCategory | undefined) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? undefined : category,
    }));
  };

  // Fonction pour convertir une ChallengeTask en WorkoutProgram
  const convertTaskToProgram = (
    task: ChallengeTask,
    challengeDifficulty: DifficultyLevel,
  ): WorkoutProgram => {
    const baseConfig = {
      id: task.id,
      name: task.title,
      description: task.description || '',
      variant: task.variant || 'STANDARD',
      difficulty: challengeDifficulty || 'INTERMEDIATE',
      type: task.type || 'TARGET_REPS',
      restBetweenSets: 60,
      isCustom: false,
    };

    switch (task.type || 'TARGET_REPS') {
      case 'FREE_MODE':
        return {
          ...baseConfig,
          type: 'FREE_MODE',
        } as WorkoutProgram;

      case 'TARGET_REPS':
        return {
          ...baseConfig,
          type: 'TARGET_REPS',
          targetReps: task.targetReps || 20,
          timeLimit: task.duration,
        } as WorkoutProgram;

      case 'MAX_TIME':
        return {
          ...baseConfig,
          type: 'MAX_TIME',
          duration: task.duration || 120,
          allowRest: true,
        } as WorkoutProgram;

      case 'SETS_REPS':
        return {
          ...baseConfig,
          type: 'SETS_REPS',
          sets: task.sets || 3,
          repsPerSet: task.repsPerSet || 10,
          restBetweenSets: 60,
        } as WorkoutProgram;

      default:
        return {
          ...baseConfig,
          type: 'TARGET_REPS',
          targetReps: task.targetReps || 20,
        } as WorkoutProgram;
    }
  };

  const convertChallengeToProgram = (challenge: Challenge): WorkoutProgram => {
    const baseConfig: WorkoutProgram = {
      id: challenge.id,
      name: challenge.title,
      description: challenge.description,
      variant: challenge.variant,
      difficulty: challenge.difficulty,
      type: challenge.type,
      restBetweenSets: challenge.duration,
      isCustom: false,
      createdBy: challenge.createdBy,
      sets: challenge.sets ?? 0,
      repsPerSet: challenge.repsPerSet ?? 0,
      allowRest: true,
      totalMinutes: challenge.duration,
      targetReps: challenge.targetReps,
    };
    return baseConfig;
  };

  // Toggle difficulté
  const toggleDifficulty = (difficulty: DifficultyLevel | undefined) => {
    setFilters(prev => ({
      ...prev,
      difficulty: prev.difficulty === difficulty ? undefined : difficulty,
    }));
  };

  // Change sort
  const setSortBy = (sortBy: ChallengeSortBy) => {
    setFilters(prev => ({...prev, sortBy}));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({sortBy: 'POPULAR'});
  };

  // Like/unlike challenge
  const toggleLike = async (challengeId: string) => {
    const challenge = challenges?.find(c => c.id === challengeId);
    if (!challenge) return;

    const token = await getToken();
    try {
      if (challenge.userLiked) {
        await challengeService.unlikeChallenge(challengeId, token || undefined);
      } else {
        await challengeService.likeChallenge(challengeId, token || undefined);
      }

      // Mettre à jour localement
      setChallenges(prev =>
        prev.map(c => {
          if (c.id === challengeId) {
            const newLiked = !c.userLiked;
            return {
              ...c,
              userLiked: newLiked,
              likes: newLiked ? c.likes + 1 : c.likes - 1,
            };
          }
          return c;
        }),
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de modifier le like',
      });
    }
  };

  // Marquer un challenge comme complété
  const completeChallenge = async (challengeId: string) => {
    const token = await getToken();
    try {
      await challengeService.completeChallenge(challengeId, token || undefined);

      setChallenges(prev =>
        prev.map(c => {
          if (c.id === challengeId) {
            return {
              ...c,
              userCompleted: true,
              completions: c.completions + 1,
            };
          }
          return c;
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Félicitations! 🎉',
        text2: 'Challenge complété',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de compléter le challenge',
      });
    }
  };

  // Complete a task with score
  const completeTask = async (
    challengeId: string,
    taskId: string,
    score: number,
  ) => {
    const token = await getToken();
    try {
      await challengeService.completeTask(
        challengeId,
        taskId,
        score,
        token || undefined,
      );

      // Mettre à jour localement
      setChallenges(prev =>
        prev.map(challenge => {
          if (challenge?.id === challengeId && challenge?.challengeTasks) {
            const updatedTasks = challenge?.challengeTasks?.map(
              challengeTask => {
                if (challengeTask.id === taskId) {
                  return {
                    ...challengeTask,
                    userProgress: {
                      id: taskId,
                      userId: '',
                      taskId,
                      challengeId,
                      completed: true,
                      completedAt: new Date(),
                      score,
                      attempts: 1,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                  };
                }
                return challengeTask;
              },
            );

            const allCompleted = updatedTasks?.every(t => t.userProgress?.completed);

            return {
              ...challenge,
              challengeTasks: updatedTasks,
              userCompleted: allCompleted,
            };
          }
          return challenge;
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Tâche complétée! ✅',
        text2: `Score: ${score}`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de compléter la tâche',
      });
    }
  };

  // Check if challenge is completed
  const isChallengeCompleted = (challengeId: string): boolean => {
    const challenge = challenges?.find(c => c.id === challengeId);
    if (
      !challenge ||
      !challenge?.challengeTasks ||
      challenge.challengeTasks?.length === 0
    ) {
      return false;
    }
    return challenge?.challengeTasks?.every(t => t.userProgress?.completed);
  };

  // Get challenge by ID
  const getChallengeById = async (challengeId: string) => {
    if (!challengeId) return null;
    if (!selectedChallenge || selectedChallenge.id !== challengeId) {
      setIsLoading(true);
      const token = await getToken();
      const challenge = await challengeService.getChallengeById(
        challengeId,
        token || undefined,
      );
      setSelectedChallenge(challenge);
      setIsLoading(false);
    }
    return selectedChallenge;
  };

  const refreshChallengesById = getChallengeById;

  // Get challenge progress
  const getChallengeProgress = useCallback(
    (challengeId: string): number => {
      if (!selectedChallenge || selectedChallenge.id !== challengeId) return 0;

      const tasks = selectedChallenge.challengeTasks ?? [];
      if (tasks.length === 0) return 0;

      const completedTasks = tasks.filter(t => t.userProgress?.completed).length;
      return Math.round((completedTasks / tasks.length) * 100);
    },
    [selectedChallenge],
  );

  // Refresh challenges
  const refreshChallenges = loadChallenges;

  // Stats
  const stats = useMemo(() => {
    return {
      total: filteredChallenges?.length || 0,
      completed: filteredChallenges?.filter(c => c.userCompleted)?.length || 0,
      totalPoints:
        filteredChallenges?.reduce((sum, c) => sum + c.points, 0) || 0,
    };
  }, [filteredChallenges]);

  return {
    challenges: filteredChallenges,
    allChallenges: challenges,
    isLoading,
    error,
    filters,
    stats,
    selectedChallenge,
    updateFilters,
    refreshChallengesById,
    toggleCategory,
    toggleDifficulty,
    setSortBy,
    resetFilters,
    toggleLike,
    completeChallenge,
    completeTask,
    isChallengeCompleted,
    getChallengeById,
    getChallengeProgress,
    refreshChallenges,
    convertTaskToProgram,
    convertChallengeToProgram,
  };
};
