/**
 * useCache Hook
 * Generic cache-first data fetching hook
 */

import {useState, useEffect, useCallback} from 'react';
import {storageService} from '../services/storage.service';
import {useOffline} from './useOffline';

interface UseCacheOptions<T> {
  cacheKey: string;
  fetchFn: () => Promise<T>;
  enabled?: boolean;
  cacheExpiration?: number;
}

interface UseCacheReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  isCached: boolean;
}

/**
 * Hook that implements cache-first strategy
 * 1. Return cached data immediately if available
 * 2. Fetch from API if online and cache is expired
 * 3. Update cache with fresh data
 */
export function useCache<T>({
  cacheKey,
  fetchFn,
  enabled = true,
  cacheExpiration,
}: UseCacheOptions<T>): UseCacheReturn<T> {
  const {isOnline} = useOffline();

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCached, setIsCached] = useState(false);

  // Load from cache
  const loadFromCache = useCallback(async () => {
    try {
      const cached = await storageService.getCache<T>(cacheKey);
      if (cached) {
        setData(cached);
        setIsCached(true);
        setIsLoading(false);
        console.log('[useCache] Loaded from cache:', cacheKey);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[useCache] Error loading from cache:', err);
      return false;
    }
  }, [cacheKey]);

  // Fetch from API
  const fetchFromAPI = useCallback(async () => {
    if (!isOnline) {
      console.log('[useCache] Offline, skipping API fetch:', cacheKey);
      return;
    }

    try {
      setError(null);
      const freshData = await fetchFn();
      setData(freshData);
      setIsCached(false);

      // Save to cache
      await storageService.setCache(cacheKey, freshData, cacheExpiration);
      console.log('[useCache] Fetched from API and cached:', cacheKey);
    } catch (err: any) {
      setError(err);
      console.error('[useCache] Error fetching from API:', err);
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, fetchFn, isOnline, cacheExpiration]);

  // Refresh function (force fetch from API)
  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchFromAPI();
  }, [fetchFromAPI]);

  // Initial load
  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);

      // Try cache first
      const hasCached = await loadFromCache();

      // If no cache or online, fetch from API
      if (!hasCached || isOnline) {
        await fetchFromAPI();
      } else {
        setIsLoading(false);
      }
    };

    load();
  }, [enabled, cacheKey, isOnline]);

  return {
    data,
    isLoading,
    error,
    refresh,
    isCached,
  };
}

export default useCache;
