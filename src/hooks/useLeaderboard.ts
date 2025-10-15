import {useState, useEffect, useCallback} from 'react';
import {
  leaderboardService,
  LeaderboardEntry,
  LeaderboardPeriod,
} from '../services/api';
import Toast from 'react-native-toast-message';
import {useAuth} from './useAuth';

export const useLeaderboard = (
  period: LeaderboardPeriod = 'weekly',
  limit: number = 20,
) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {getToken} = useAuth();

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = await getToken();

    try {
      const data = await leaderboardService.getLeaderboard(
        period,
        'total-pushups',
        limit,
        0,
        token || undefined,
      );
      setLeaderboard(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Erreur de chargement du classement';
      setError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [period, limit, getToken]);

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
