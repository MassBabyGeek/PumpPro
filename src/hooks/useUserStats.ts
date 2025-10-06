import {useState, useEffect} from 'react';

export type UserStats = {
  todayPushUps: number;
  weeklyTotal: number;
  personalBest: number;
  weekStreak: number;
  averagePerDay: number;
  totalAllTime: number;
};

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    todayPushUps: 0,
    weeklyTotal: 0,
    personalBest: 0,
    weekStreak: 0,
    averagePerDay: 0,
    totalAllTime: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Remplacer par un vrai appel API
      // const response = await fetch('/api/user/stats');
      // const data = await response.json();

      // Mock data pour le moment
      const mockStats: UserStats = {
        todayPushUps: 45,
        weeklyTotal: 287,
        personalBest: 62,
        weekStreak: 12,
        averagePerDay: 41,
        totalAllTime: 3420,
      };

      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStats = () => {
    fetchStats();
  };

  return {
    stats,
    isLoading,
    error,
    refreshStats,
  };
};
