import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {
  ChartData,
  RawChartItem,
  Stats,
  User,
  UserProfile,
} from '../types/user.types';
import {userService} from '../services/api';
import {useAuth} from './useAuth';

const USER_DATA_KEY = '@pompeurpro:user_data';

const initChartData: ChartData = {
  labels: [],
  datasets: [{data: [0]}],
};

export const useUser = () => {
  const {token} = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statsByPeriod, setStatsByPeriod] = useState<Stats | null>(null);

  const [rawChartData, setRawChartData] = useState<RawChartItem[]>([]);
  const [chartData, setChartData] = useState<ChartData>(initChartData);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [currentChartPeriod, setCurrentChartPeriod] = useState<
    'week' | 'month' | 'year'
  >('week');

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const reloadUser = useCallback(async () => {
    if (!user) {
      return;
    }
    const fetchedUser = await userService.getProfile(user.id, token);
    setUser(fetchedUser);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(fetchedUser));
  }, [user, token]);

  const getUser = useCallback(async () => {
    if (!token) {
      console.log('[useUser] No token, clearing user');
      setUser(null);
      setIsLoading(false);
      return;
    }

    console.log('[useUser] Loading user data...');
    setIsLoading(true);
    try {
      // First load from cache for immediate UI update
      const storedUser = await AsyncStorage.getItem(USER_DATA_KEY);
      console.log(
        '[useUser] Cached user data:',
        storedUser ? 'found' : 'not found',
      );
      if (storedUser) {
        const cachedUser = JSON.parse(storedUser);
        console.log(
          '[useUser] Setting cached user:',
          cachedUser.id,
          cachedUser.email,
        );
        setUser(cachedUser);

        // Then fetch fresh data from API
        try {
          const freshUser = await userService.getProfile(cachedUser.id, token);
          console.log('[useUser] Fresh user data fetched:', freshUser.id);
          setUser(freshUser);
          await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(freshUser));
        } catch (apiErr) {
          console.error('[useUser] Error fetching fresh user data', apiErr);
          // Keep using cached user if API fails
        }
      } else {
        // No cached user - try to fetch from API using /me endpoint if available
        console.warn('[useUser] No cached user data found');
      }
    } catch (err) {
      console.error('[useUser] getUser error', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const getStats = async (selectedPeriod: string): Promise<Stats> => {
    if (!user) {
      console.error('[useUser] getStats called but user is null!');
      throw new Error('No user logged in');
    }

    console.log(
      '[useUser] getStats for user:',
      user.id,
      'period:',
      selectedPeriod,
    );
    setIsLoading(true);
    try {
      return await userService.getStats(user.id, selectedPeriod, token);
    } catch (err) {
      console.error('[useUser] Error getting stats:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!token || !user) {
      return;
    }

    setIsLoading(true);
    try {
      const updated = await userService.updateProfile(user.id, updates, token);
      setUser(updated);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('[useUser] updateUser error', err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (imageUri: string): Promise<UserProfile> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    setIsLoading(true);
    try {
      const updatedUser = await userService.uploadAvatar(
        user.id,
        imageUri,
        token,
      );
      setUser(updatedUser);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error('[useUser] Error uploading avatar:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (): Promise<{success: boolean}> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    setIsLoading(true);
    try {
      const result = await userService.deleteAccount(user.id, token);
      setUser(null);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      return result;
    } catch (err) {
      console.error('[useUser] Error deleting account:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const setStatsPeriod = useCallback(
    async (selectedPeriod: string) => {
      if (!user) {
        console.error('[useUser] setStatsPeriod called but user is null!');
        throw new Error('No user logged in');
      }
      console.log(
        '[useUser] setStatsPeriod for user:',
        user.id,
        'period:',
        selectedPeriod,
      );
      setStatsByPeriod(null);
      setIsLoading(true);
      try {
        const stats = await userService.getStats(
          user.id,
          selectedPeriod,
          token,
        );
        setStatsByPeriod(stats);
      } catch (err) {
        console.error('[useUser] Error getting stats:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user, token],
  );

  /** ----- CHART ----- */
  const formatChartLabel = (
    date: string,
    index: number,
    period: 'week' | 'month' | 'year',
  ): string => {
    if (period === 'week') {
      // Pour la semaine: L, M, M, J, V, S, D
      const dayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
      return dayLabels[index % 7] || date;
    } else if (period === 'year') {
      // Pour l'année: J, F, M, A, M, J, J, A, S, O, N, D
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
      // Pour le mois: afficher uniquement tous les 5 jours (1, 5, 10, 15, 20, 25, 30)
      const day = index + 1; // index 0 = jour 1, index 1 = jour 2, etc.
      // Afficher le label uniquement si c'est le jour 1 ou un multiple de 5
      if (day === 1 || day % 5 === 0) {
        return day.toString();
      }
      return ''; // Pas de label pour les autres jours
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
    if (!user || isChartLoading) {
      console.log(
        '[useUser] loadChartData skipped - user:',
        !!user,
        'isChartLoading:',
        isChartLoading,
      );
      return;
    }

    console.log(
      '[useUser] loadChartData for user:',
      user.id,
      'period:',
      period,
    );
    setIsChartLoading(true);
    setCurrentChartPeriod(period);
    try {
      const data = await userService.getChartData(user.id, period, token);
      setRawChartData(data);
      setChartData(transformChartData(data, 'calories', period));
    } catch (err) {
      console.error('[useUser] loadChartData error:', err);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les données du graphique',
      });
    } finally {
      setIsChartLoading(false);
    }
  };

  /** ----- RETURN ----- */
  return {
    user,
    setUser,
    isLoading,
    updateUser,
    uploadAvatar,
    deleteAccount,
    rawChartData,
    chartData,
    getChartData,
    loadChartData,
    isChartLoading,
    getUser,
    statsByPeriod,
    setStatsPeriod,
    getStats,
    reloadUser,
  };
};
