/**
 * Storage Service
 * Handles all local cache operations with expiration support
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CachedData,
  CacheMetadata,
  STORAGE_KEYS,
  DEFAULT_OFFLINE_SETTINGS,
  OfflineSettings,
} from '../types/offline.types';

const APP_VERSION = '1.0.0';

class StorageService {
  /**
   * Get offline settings
   */
  async getSettings(): Promise<OfflineSettings> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_SETTINGS);
      if (settings) {
        return JSON.parse(settings);
      }
      return DEFAULT_OFFLINE_SETTINGS;
    } catch (error) {
      console.error('[StorageService] Error getting settings:', error);
      return DEFAULT_OFFLINE_SETTINGS;
    }
  }

  /**
   * Update offline settings
   */
  async updateSettings(
    settings: Partial<OfflineSettings>,
  ): Promise<OfflineSettings> {
    try {
      const current = await this.getSettings();
      const updated = {...current, ...settings};
      await AsyncStorage.setItem(
        STORAGE_KEYS.OFFLINE_SETTINGS,
        JSON.stringify(updated),
      );
      return updated;
    } catch (error) {
      console.error('[StorageService] Error updating settings:', error);
      throw error;
    }
  }

  /**
   * Create cache metadata
   */
  private createMetadata(customExpiration?: number): CacheMetadata {
    const now = Date.now();
    return {
      timestamp: now,
      expiresAt: now + (customExpiration || DEFAULT_OFFLINE_SETTINGS.cacheExpiration),
      version: APP_VERSION,
    };
  }

  /**
   * Check if cached data is valid
   */
  private isValidCache<T>(cached: CachedData<T> | null): cached is CachedData<T> {
    if (!cached) return false;

    const now = Date.now();
    const isExpired = now > cached.metadata.expiresAt;
    const isWrongVersion = cached.metadata.version !== APP_VERSION;

    if (isExpired || isWrongVersion) {
      console.log('[StorageService] Cache invalid:', {
        isExpired,
        isWrongVersion,
        age: Math.floor((now - cached.metadata.timestamp) / 1000 / 60),
      });
      return false;
    }

    return true;
  }

  /**
   * Set cached data with metadata
   */
  async setCache<T>(key: string, data: T, customExpiration?: number): Promise<void> {
    try {
      const cached: CachedData<T> = {
        data,
        metadata: this.createMetadata(customExpiration),
      };
      const serialized = JSON.stringify(cached);
      await AsyncStorage.setItem(key, serialized);
      console.log('[StorageService] 💾 Cache set:', key, {
        dataSize: serialized.length,
        expiresAt: new Date(cached.metadata.expiresAt).toLocaleString(),
      });
    } catch (error) {
      console.error('[StorageService] ❌ Error setting cache:', error);
      throw error;
    }
  }

  /**
   * Get cached data if valid
   */
  async getCache<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) {
        console.log('[StorageService] ⚠️ Cache miss:', key);
        return null;
      }

      const parsed: CachedData<T> = JSON.parse(cached);

      if (!this.isValidCache(parsed)) {
        console.log('[StorageService] ⏰ Cache expired:', key);
        await this.removeCache(key);
        return null;
      }

      console.log('[StorageService] ✅ Cache hit:', key, {
        age: Math.floor((Date.now() - parsed.metadata.timestamp) / 1000 / 60),
        expiresIn: Math.floor((parsed.metadata.expiresAt - Date.now()) / 1000 / 60),
      });
      return parsed.data;
    } catch (error) {
      console.error('[StorageService] ❌ Error getting cache:', error);
      return null;
    }
  }

  /**
   * Remove cached data
   */
  async removeCache(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      console.log('[StorageService] Cache removed:', key);
    } catch (error) {
      console.error('[StorageService] Error removing cache:', error);
    }
  }

  /**
   * Clear all cache (except settings)
   */
  async clearAllCache(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS).filter(
        key => !key.includes('settings') && key.includes('cache'),
      );
      await AsyncStorage.multiRemove(keys);
      console.log('[StorageService] All cache cleared');
    } catch (error) {
      console.error('[StorageService] Error clearing cache:', error);
      throw error;
    }
  }

  /**
   * Get cache size (approximate)
   */
  async getCacheSize(): Promise<{keys: number; sizeMB: number}> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.includes('pompeurpro:cache'));

      let totalSize = 0;
      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      return {
        keys: cacheKeys.length,
        sizeMB: totalSize / (1024 * 1024),
      };
    } catch (error) {
      console.error('[StorageService] Error getting cache size:', error);
      return {keys: 0, sizeMB: 0};
    }
  }

  /**
   * Get last sync time
   */
  async getLastSyncTime(): Promise<number | null> {
    try {
      const time = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return time ? parseInt(time, 10) : null;
    } catch (error) {
      console.error('[StorageService] Error getting last sync time:', error);
      return null;
    }
  }

  /**
   * Set last sync time
   */
  async setLastSyncTime(timestamp: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp.toString());
    } catch (error) {
      console.error('[StorageService] Error setting last sync time:', error);
    }
  }
}

export const storageService = new StorageService();
