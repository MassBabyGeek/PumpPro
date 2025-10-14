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

  /** ----- USER ----- */
  useEffect(() => {
    getUser();
  }, [token]);

  const getUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem(USER_DATA_KEY);
      if (storedUser) setUser(JSON.parse(storedUser));
      else {
        const fetchedUser = await userService.getProfile(token);
        setUser(fetchedUser);
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(fetchedUser));
      }
    } catch (err) {
      console.error('[useUser] getUser error', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const getStats = async (selectedPeriod: string): Promise<Stats> => {
    if (!user) throw new Error('No user logged in');

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
    if (!token || !user) return;

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
    if (!user) throw new Error('No user logged in');

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
    if (!user) throw new Error('No user logged in');

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
      if (!user) throw new Error('No user logged in');
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
  const transformChartData = useCallback(
    (
      rawData: RawChartItem[],
      key: 'pushUps' | 'duration' | 'calories',
      showLabels = true,
    ): ChartData => ({
      labels: rawData.map(item => (showLabels ? item.date : '')),
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
        return transformChartData(rawChartData, key, showLabels);
      }
      return {labels: [], datasets: [{data: [0]}]};
    },
    [rawChartData, transformChartData],
  );

  const loadChartData = async (period: 'week' | 'month' | 'year') => {
    if (!user || isChartLoading) return;

    setIsChartLoading(true);
    try {
      const data = await userService.getChartData(user.id, period, token);
      setRawChartData(data);
      setChartData(transformChartData(data, 'calories'));
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
  };
};
