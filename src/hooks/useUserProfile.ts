import {useState, useCallback} from 'react';
import {
  ChartData,
  RawChartItem,
  Stats,
  User,
} from '../types/user.types';
import {userService} from '../services/api';
import {useToast} from './useToast';

const initChartData: ChartData = {
  labels: [],
  datasets: [{data: [0]}],
};

/**
 * Hook pour gérer les données d'un utilisateur spécifique (pas l'utilisateur connecté)
 * Utilisé pour afficher le profil d'autres utilisateurs
 */
export const useUserProfile = (userId: string) => {
  const {toastError} = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statsByPeriod, setStatsByPeriod] = useState<Stats | null>(null);

  const [rawChartData, setRawChartData] = useState<RawChartItem[]>([]);
  const [chartData, setChartData] = useState<ChartData>(initChartData);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [currentChartPeriod, setCurrentChartPeriod] = useState<
    'week' | 'month' | 'year'
  >('week');

  const loadUserProfile = useCallback(async () => {
    if (!userId) {
      return;
    }

    setIsLoading(true);
    try {
      const userData = await userService.getProfile(userId);
      setUser(userData);
    } catch (err) {
      toastError('Erreur', 'Impossible de charger le profil utilisateur');
    } finally {
      setIsLoading(false);
    }
  }, [userId, toastError]);

  const getStats = async (selectedPeriod: string): Promise<Stats> => {
    if (!userId) {
      throw new Error('No user ID provided');
    }

    setIsLoading(true);
    try {
      return await userService.getStats(userId, selectedPeriod);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const setStatsPeriod = useCallback(
    async (selectedPeriod: string) => {
      if (!userId) {
        throw new Error('No user ID provided');
      }
      setStatsByPeriod(null);
      setIsLoading(true);
      try {
        const stats = await userService.getStats(userId, selectedPeriod);
        setStatsByPeriod(stats);
      } catch (err) {
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  /** ----- CHART ----- */
  const formatChartLabel = (
    date: string,
    index: number,
    period: 'week' | 'month' | 'year',
  ): string => {
    if (period === 'week') {
      const dayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
      return dayLabels[index % 7] || date;
    } else if (period === 'year') {
      const monthLabels = [
        'J',
        'F',
        'M',
        'A',
        'M',
        'J',
        'J',
        'A',
        'S',
        'O',
        'N',
        'D',
      ];
      return monthLabels[index % 12] || date;
    } else if (period === 'month') {
      const day = index + 1;
      if (day === 1 || day % 5 === 0) {
        return day.toString();
      }
      return '';
    }
    return date;
  };

  const transformChartData = useCallback(
    (
      rawData: RawChartItem[],
      key: 'pushUps' | 'duration' | 'calories',
      period: 'week' | 'month' | 'year',
      showLabels = true,
    ): ChartData => ({
      labels: rawData.map((item, index) =>
        showLabels ? formatChartLabel(item.date, index, period) : '',
      ),
      datasets: [{data: rawData.map(item => item[key])}],
    }),
    [],
  );

  const getChartData = useCallback(
    (
      key: 'pushUps' | 'duration' | 'calories' = 'calories',
      showLabels = true,
    ): ChartData => {
      if (rawChartData && rawChartData.length > 0) {
        return transformChartData(
          rawChartData,
          key,
          currentChartPeriod,
          showLabels,
        );
      }
      return {labels: [], datasets: [{data: [0]}]};
    },
    [rawChartData, transformChartData, currentChartPeriod],
  );

  const loadChartData = async (period: 'week' | 'month' | 'year') => {
    if (!userId || isChartLoading) {
      return;
    }

    setIsChartLoading(true);
    setCurrentChartPeriod(period);
    try {
      const data = await userService.getChartData(userId, period);
      setRawChartData(data);
      setChartData(transformChartData(data, 'calories', period));
    } catch (err) {
      toastError('Erreur', 'Impossible de charger les données du graphique');
    } finally {
      setIsChartLoading(false);
    }
  };

  /** ----- RETURN ----- */
  return {
    user,
    isLoading,
    loadUserProfile,
    rawChartData,
    chartData,
    getChartData,
    loadChartData,
    isChartLoading,
    statsByPeriod,
    setStatsPeriod,
    getStats,
  };
};
