import {useState, useEffect, useCallback} from 'react';
import {
  leaderboardService,
  LeaderboardEntry,
  LeaderboardPeriod,
} from '../services/api';
import {useToast} from './useToast';

export const useLeaderboard = (
  period: LeaderboardPeriod = 'weekly',
  limit: number = 20,
) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {toastError} = useToast();

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await leaderboardService.getLeaderboard(
        period,
        'total-pushups',
        limit,
        0,
      );
      setLeaderboard(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Erreur de chargement du classement';
      setError(errorMessage);
      toastError('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [period, limit, toastError]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const refreshLeaderboard = () => {
    fetchLeaderboard();
  };

  return {
    leaderboard,
    isLoading,
    error,
    refreshLeaderboard,
  };
};
