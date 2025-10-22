/**
 * Offline Context
 * Provides offline functionality throughout the app
 */

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import {
  NetworkStatus,
  SyncStatus,
  ConflictData,
  OfflineSettings,
  DEFAULT_OFFLINE_SETTINGS,
} from '../types/offline.types';
import {networkService} from '../services/network.service';
import {syncService} from '../services/sync.service';
import {storageService} from '../services/storage.service';
import {useAuth} from '../hooks/useAuth';

interface OfflineContextType {
  // Network status
  networkStatus: NetworkStatus;
  isOnline: boolean;
  isOffline: boolean;

  // Sync status
  syncStatus: SyncStatus;
  conflicts: ConflictData[];

  // Settings
  settings: OfflineSettings;
  updateSettings: (settings: Partial<OfflineSettings>) => Promise<void>;

  // Actions
  sync: () => Promise<void>;
  resolveConflict: (conflictId: string, resolution: 'keep_local' | 'keep_server') => Promise<void>;
  clearCache: () => Promise<void>;

  // Forced offline mode
  forcedOffline: boolean;
  setForcedOffline: (forced: boolean) => Promise<void>;
}

export const OfflineContext = createContext<OfflineContextType | undefined>(
  undefined,
);

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider = ({children}: OfflineProviderProps) => {
  const {getToken} = useAuth();

  // Start with offline assumption until network status is verified
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: false,
    isInternetReachable: false,
    type: null,
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSyncing: false,
    pendingActions: 0,
    lastSyncTime: null,
    conflicts: 0,
    progress: 100,
  });

  const [conflicts, setConflicts] = useState<ConflictData[]>([]);
  const [settings, setSettings] = useState<OfflineSettings>(DEFAULT_OFFLINE_SETTINGS);
  const [forcedOffline, setForcedOfflineState] = useState(false);

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      // Initialize network service
      networkService.initialize();

      // Get initial status
      const initialStatus = await networkService.getCurrentStatus();
      setNetworkStatus(initialStatus);

      // Initialize sync service
      await syncService.initialize();

      // Load settings
      const loadedSettings = await storageService.getSettings();
      setSettings(loadedSettings);
      setForcedOfflineState(loadedSettings.forcedOfflineMode);

      // Get initial sync status
      const initialSyncStatus = syncService.getSyncStatus();
      const lastSync = await storageService.getLastSyncTime();
      setSyncStatus({...initialSyncStatus, lastSyncTime: lastSync});

      // Get initial conflicts
      setConflicts(syncService.getConflicts());

      console.log('[OfflineProvider] Initialized');
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      networkService.cleanup();
    };
  }, []);

  // Listen to network changes
  useEffect(() => {
    const unsubscribe = networkService.addListener(status => {
      setNetworkStatus(status);

      // Auto-sync when coming back online
      if (status.isConnected && settings.autoSync && !forcedOffline) {
        console.log('[OfflineProvider] Back online, triggering auto-sync');
        sync();
      }
    });

    return unsubscribe;
  }, [settings.autoSync, forcedOffline]);

  // Listen to sync changes
  useEffect(() => {
    const unsubscribSync = syncService.addSyncListener(async status => {
      const lastSync = await storageService.getLastSyncTime();
      setSyncStatus({...status, lastSyncTime: lastSync});
    });

    const unsubscribeConflict = syncService.addConflictListener(conflict => {
      setConflicts(prev => [...prev, conflict]);
    });

    return () => {
      unsubscribSync();
      unsubscribeConflict();
    };
  }, []);

  // Compute effective online status (considering forced offline mode)
  const isOnline = networkStatus.isConnected &&
                   networkStatus.isInternetReachable !== false &&
                   !forcedOffline;

  const isOffline = !isOnline;

  // Sync action
  const sync = useCallback(async () => {
    if (forcedOffline) {
      console.log('[OfflineProvider] Forced offline mode, skipping sync');
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        console.warn('[OfflineProvider] No token available for sync');
        return;
      }

      await syncService.sync(token);

      // Update conflicts after sync
      setConflicts(syncService.getConflicts());
    } catch (error) {
      console.error('[OfflineProvider] Sync error:', error);
    }
  }, [getToken, forcedOffline]);

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<OfflineSettings>) => {
    const updated = await storageService.updateSettings(newSettings);
    setSettings(updated);

    // Update forced offline if changed
    if (newSettings.forcedOfflineMode !== undefined) {
      setForcedOfflineState(newSettings.forcedOfflineMode);
    }
  }, []);

  // Set forced offline mode
  const setForcedOffline = useCallback(async (forced: boolean) => {
    await updateSettings({forcedOfflineMode: forced});
  }, [updateSettings]);

  // Resolve conflict
  const resolveConflict = useCallback(
    async (conflictId: string, resolution: 'keep_local' | 'keep_server') => {
      await syncService.resolveConflict(conflictId, resolution);
      setConflicts(syncService.getConflicts());

      // Re-sync if keeping local
      if (resolution === 'keep_local') {
        await sync();
      }
    },
    [sync],
  );

  // Clear cache
  const clearCache = useCallback(async () => {
    await storageService.clearAllCache();
    console.log('[OfflineProvider] Cache cleared');
  }, []);

  return (
    <OfflineContext.Provider
      value={{
        networkStatus,
        isOnline,
        isOffline,
        syncStatus,
        conflicts,
        settings,
        updateSettings,
        sync,
        resolveConflict,
        clearCache,
        forcedOffline,
        setForcedOffline,
      }}>
      {children}
    </OfflineContext.Provider>
  );
};
