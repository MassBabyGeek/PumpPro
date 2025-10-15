import {useState, useEffect, useCallback} from 'react';
import {
  leaderboardService,
  LeaderboardEntry,
  LeaderboardPeriod,
  LeaderboardMetric,
} from '../services/api';
import Toast from 'react-native-toast-message';
import {useAuth} from './useAuth';

const PAGE_SIZE = 20;

export const useLeaderboardDetail = (
  period: LeaderboardPeriod = 'all-time',
  metric: LeaderboardMetric = 'total-pushups',
) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const {getToken} = useAuth();

  const fetchLeaderboard = useCallback(
    async (pageNum: number = 0, append: boolean = false) => {
      if (pageNum === 0) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      const token = await getToken();

      try {
        const offset = pageNum * PAGE_SIZE;
        const data = await leaderboardService.getLeaderboard(
          period,
          metric,
          PAGE_SIZE,
          offset,
          token || undefined,
        );

        if (append) {
          setLeaderboard(prev => [...prev, ...data]);
        } else {
          setLeaderboard(data);
        }

        // Si on reçoit moins d'éléments que la page size, on a atteint la fin
        setHasMore(data.length === PAGE_SIZE);
        setPage(pageNum);
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
        setIsLoadingMore(false);
      }
    },
    [period, metric, getToken],
  );

  useEffect(() => {
    setLeaderboard([]);
    setPage(0);
    setHasMore(true);
    fetchLeaderboard(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, metric]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchLeaderboard(page + 1, true);
    }
  }, [page, isLoadingMore, hasMore, fetchLeaderboard]);

  const refreshLeaderboard = useCallback(() => {
    setLeaderboard([]);
    setPage(0);
    setHasMore(true);
    fetchLeaderboard(0, false);
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refreshLeaderboard,
  };
};
