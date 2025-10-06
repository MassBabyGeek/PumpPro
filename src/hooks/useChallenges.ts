import {useState, useMemo} from 'react';
import {
  Challenge,
  ChallengeFilters,
  ChallengeSortBy,
  ChallengeCategory,
} from '../types/challenge.types';
import {DifficultyLevel} from '../types/workout.types';
import {MOCK_CHALLENGES} from '../data/challenges.mock';

export const useChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ChallengeFilters>({
    sortBy: 'POPULAR',
  });

  // Filtrer et trier les challenges
  const filteredChallenges = useMemo(() => {
    let result = [...challenges];

    // Filtre par catégorie
    if (filters.category) {
      result = result.filter(c => c.category === filters.category);
    }

    // Filtre par difficulté
    if (filters.difficulty) {
      result = result.filter(c => c.difficulty === filters.difficulty);
    }

    // Filtre par type
    if (filters.type) {
      result = result.filter(c => c.type === filters.type);
    }

    // Filtre par status
    if (filters.status) {
      result = result.filter(c => c.status === filters.status);
    }

    // Recherche par texte
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some(tag => tag.toLowerCase().includes(query)),
      );
    }

    // Tri
    switch (filters.sortBy) {
      case 'POPULAR':
        result.sort((a, b) => b.completions - a.completions);
        break;
      case 'LIKED':
        result.sort((a, b) => b.likes - a.likes);
        break;
      case 'RECENT':
        result.sort((a, b) => {
          // Les challenges avec date de début plus récente en premier
          const dateA = a.startDate?.getTime() || 0;
          const dateB = b.startDate?.getTime() || 0;
          return dateB - dateA;
        });
        break;
      case 'DIFFICULTY':
        const difficultyOrder = {BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2};
        result.sort(
          (a, b) =>
            difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty],
        );
        break;
      case 'POINTS':
        result.sort((a, b) => b.points - a.points);
        break;
    }

    return result;
  }, [challenges, filters]);

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
  const toggleLike = (challengeId: string) => {
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
  };

  // Marquer un challenge comme complété
  const completeChallenge = (challengeId: string) => {
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
  };

  // Toggle task completion
  const toggleTaskCompletion = (challengeId: string, taskId: string) => {
    setChallenges(prev =>
      prev.map(challenge => {
        if (challenge.id === challengeId && challenge.tasks) {
          const updatedTasks = challenge.tasks.map(task => {
            if (task.id === taskId) {
              const newCompleted = !task.completed;
              return {
                ...task,
                completed: newCompleted,
                completedAt: newCompleted ? new Date() : undefined,
              };
            }
            return task;
          });

          // Auto-unlock next task if this one is completed
          const currentTaskIndex = updatedTasks.findIndex(t => t.id === taskId);
          if (
            currentTaskIndex >= 0 &&
            updatedTasks[currentTaskIndex].completed &&
            currentTaskIndex < updatedTasks.length - 1
          ) {
            updatedTasks[currentTaskIndex + 1] = {
              ...updatedTasks[currentTaskIndex + 1],
              isLocked: false,
            };
          }

          // Check if all tasks are completed
          const allCompleted = updatedTasks.every(t => t.completed);

          return {
            ...challenge,
            tasks: updatedTasks,
            userCompleted: allCompleted,
          };
        }
        return challenge;
      }),
    );
  };

  // Get challenge by ID
  const getChallengeById = (challengeId: string) => {
    return challenges.find(c => c.id === challengeId);
  };

  // Get challenge progress (percentage of tasks completed)
  const getChallengeProgress = (challengeId: string): number => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || !challenge.tasks || challenge.tasks.length === 0) {
      return 0;
    }
    const completedTasks = challenge.tasks.filter(t => t.completed).length;
    return Math.round((completedTasks / challenge.tasks.length) * 100);
  };

  // Refresh challenges (simulé, serait un appel API)
  const refreshChallenges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      setChallenges(MOCK_CHALLENGES);
    } catch (err) {
      setError('Erreur lors du chargement des challenges');
    } finally {
      setIsLoading(false);
    }
  };

  // Stats sur les challenges filtrés
  const stats = useMemo(() => {
    return {
      total: filteredChallenges.length,
      completed: filteredChallenges.filter(c => c.userCompleted).length,
      totalPoints: filteredChallenges.reduce((sum, c) => sum + c.points, 0),
    };
  }, [filteredChallenges]);

  return {
    challenges: filteredChallenges,
    allChallenges: challenges,
    isLoading,
    error,
    filters,
    stats,
    updateFilters,
    toggleCategory,
    toggleDifficulty,
    setSortBy,
    resetFilters,
    toggleLike,
    completeChallenge,
    toggleTaskCompletion,
    getChallengeById,
    getChallengeProgress,
    refreshChallenges,
  };
};
