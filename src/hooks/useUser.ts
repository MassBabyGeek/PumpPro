/**
 * useUser Hook
 *
 * Custom hook that encapsulates all user-related operations
 * Uses useAuth for authentication context and userService for API calls
 */

import {useState} from 'react';
import {useAuth} from './useAuth';
import {userService} from '../services/api';
import {UserProfile, ChartData, Stats} from '../types/user.types';

interface UseUserReturn {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  uploadAvatar: (imageUri: string) => Promise<UserProfile>;
  deleteAccount: () => Promise<{success: boolean}>;
  getStats: (selectedPeriod: string) => Promise<Stats>;
  getChartData: (period: 'week' | 'month' | 'year') => Promise<ChartData>;
}

export const useUser = (): UseUserReturn => {
  const {user, updateUser, getToken} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Update user profile
   * @param data - Partial user data to update
   * @returns Updated user profile
   */
  const updateProfile = async (
    data: Partial<UserProfile>,
  ): Promise<UserProfile> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    console.log('[useUser] updateProfile:', user.id, data);
    setIsLoading(true);
    setError(null);

    const token = await getToken();

    try {
      // Call API service to update profile
      const updatedUser = await userService.updateProfile(
        user.id,
        data,
        token || undefined,
      );

      // Update auth context with new user data
      await updateUser(updatedUser);

      console.log('[useUser] Profile updated successfully');
      return updatedUser;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useUser] Error updating profile:', message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Upload user avatar
   * @param imageUri - Local image URI
   * @returns Updated user profile with new avatar
   */
  const uploadAvatar = async (imageUri: string): Promise<UserProfile> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    console.log('[useUser] uploadAvatar:', user.id, imageUri);
    setIsLoading(true);
    setError(null);

    try {
      // Call API service to upload avatar
      const token = await getToken();
      const updatedUser = await userService.uploadAvatar(
        user.id,
        imageUri,
        token || undefined,
      );

      // Update auth context with new user data
      await updateUser(updatedUser);

      console.log('[useUser] Avatar uploaded successfully');
      return updatedUser;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useUser] Error uploading avatar:', message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete user account
   * @returns Success status
   */
  const deleteAccount = async (): Promise<{success: boolean}> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    console.log('[useUser] deleteAccount:', user.id);
    setIsLoading(true);
    setError(null);

    const token = await getToken();
    try {
      // Call API service to delete account
      const result = await userService.deleteAccount(token || undefined);

      console.log('[useUser] Account deleted successfully');
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useUser] Error deleting account:', message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get user statistics
   * @param selectedPeriod - Period to retrieve (today, week, month, year)
   * @returns User workout statistics
   */
  const getStats = async (selectedPeriod: string): Promise<Stats> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    setIsLoading(true);
    setError(null);

    const token = await getToken();
    console.log('[useUser] token:', token);
    const userId = user.id;
    console.log('[useUser] userId:', user);
    try {
      // Call API service to get user stats
      const stats = await userService.getStats(
        userId,
        selectedPeriod,
        token || undefined,
      );

      console.log('[useUser] getStats:', selectedPeriod, stats);
      return stats;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useUser] Error getting stats:', message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get chart data for specific period
   * @param period - Time period (week, month, year)
   * @returns Chart data
   */
  const getChartData = async (
    period: 'week' | 'month' | 'year',
  ): Promise<ChartData> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    console.log('[useUser] getChartData:', user.id, period);
    setIsLoading(true);
    setError(null);

    const token = await getToken();
    try {
      // Call API service to get chart data
      const chartData = await userService.getChartData(
        user.id,
        period,
        token || undefined,
      );

      console.log('[useUser] Chart data retrieved successfully');
      return chartData;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useUser] Error getting chart data:', message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    updateProfile,
    uploadAvatar,
    deleteAccount,
    getStats,
    getChartData,
  };
};
