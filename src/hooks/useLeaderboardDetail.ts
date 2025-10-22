import {useState, useEffect, useCallback} from 'react';
import {
  leaderboardService,
  LeaderboardEntry,
  LeaderboardPeriod,
  LeaderboardMetric,
} from '../services/api';
import {useToast} from './useToast';

const PAGE_SIZE = 20;

export const useLeaderboardDetail = (
  initialPeriod: LeaderboardPeriod = 'all-time',
  initialMetric: LeaderboardMetric = 'total-pushups',
) => {
  const [period, setPeriod] = useState<LeaderboardPeriod>(initialPeriod);
  const [metric, setMetric] = useState<LeaderboardMetric>(initialMetric);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const {toastError} = useToast();

  const fetchLeaderboard = useCallback(
    async (pageNum: number, append: boolean, currentPeriod: LeaderboardPeriod, currentMetric: LeaderboardMetric) => {
      if (pageNum === 0) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const offset = pageNum * PAGE_SIZE;
        const data = await leaderboardService.getLeaderboard(
          currentPeriod,
          currentMetric,
          PAGE_SIZE,
          offset,
        );

        setLeaderboard(prev => (append ? [...prev, ...data] : data));
        setHasMore(data.length === PAGE_SIZE);
        setPage(pageNum);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Erreur de chargement du classement';
        setError(errorMessage);
        toastError('Erreur', errorMessage);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [toastError],
  );

  useEffect(() => {
    setLeaderboard([]);
    setPage(0);
    setHasMore(true);
    fetchLeaderboard(0, false, period, metric);
  }, [period, metric, fetchLeaderboard]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchLeaderboard(page + 1, true, period, metric);
    }
  }, [page, isLoadingMore, hasMore, fetchLeaderboard, period, metric]);

  const refresh = useCallback(() => {
    setLeaderboard([]);
    setPage(0);
    setHasMore(true);
    fetchLeaderboard(0, false, period, metric);
  }, [fetchLeaderboard, period, metric]);

  return {
    leaderboard,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    period,
    setPeriod,
    metric,
    setMetric,
    refresh,
  };
};
