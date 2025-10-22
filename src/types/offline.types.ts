/**
 * Types for offline functionality
 */

import {WorkoutSession} from './workout.types';

// ============================================================================
// Cache Types
// ============================================================================

export interface CacheMetadata {
  timestamp: number;
  expiresAt: number;
  version: string;
}

export interface CachedData<T> {
  data: T;
  metadata: CacheMetadata;
}

// ============================================================================
// Sync Queue Types
// ============================================================================

export type SyncActionType =
  | 'CREATE_SESSION'
  | 'LIKE_PROGRAM'
  | 'UNLIKE_PROGRAM'
  | 'LIKE_SESSION'
  | 'UNLIKE_SESSION'
  | 'UPDATE_PROFILE'
  | 'CREATE_FEEDBACK';

export type SyncPriority = 1 | 2 | 3 | 4; // 1 = highest (Sessions), 4 = lowest (Feedback)

export interface SyncAction {
  id: string; // UUID
  type: SyncActionType;
  priority: SyncPriority;
  timestamp: number;
  data: any;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
  error?: string;
}

// ============================================================================
// Conflict Resolution Types
// ============================================================================

export interface ConflictData<T = any> {
  id: string;
  type: 'session' | 'profile' | 'like';
  localVersion: T;
  serverVersion: T;
  localTimestamp: number;
  serverTimestamp: number;
}

export type ConflictResolution = 'keep_local' | 'keep_server' | 'merge';

// ============================================================================
// Offline Settings Types
// ============================================================================

export interface OfflineSettings {
  maxStoredSessions: number; // Paramétrable pour version payante
  cacheExpiration: number; // en ms (24h par défaut)
  autoSync: boolean;
  syncOnWifiOnly: boolean;
  forcedOfflineMode: boolean;
}

export const DEFAULT_OFFLINE_SETTINGS: OfflineSettings = {
  maxStoredSessions: 50, // Default pour version gratuite
  cacheExpiration: 24 * 60 * 60 * 1000, // 24 heures
  autoSync: true,
  syncOnWifiOnly: false,
  forcedOfflineMode: false,
};

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  // Cache
  PROGRAMS: '@pompeurpro:cache:programs',
  CHALLENGES: '@pompeurpro:cache:challenges',
  WORKOUTS: '@pompeurpro:cache:workouts',
  LEADERBOARD: '@pompeurpro:cache:leaderboard',
  USER_PROFILE: '@pompeurpro:cache:user_profile',

  // Offline data
  PENDING_SESSIONS: '@pompeurpro:offline:pending_sessions',
  SYNC_QUEUE: '@pompeurpro:offline:sync_queue',
  CONFLICTS: '@pompeurpro:offline:conflicts',

  // Settings
  OFFLINE_SETTINGS: '@pompeurpro:offline:settings',
  LAST_SYNC: '@pompeurpro:offline:last_sync',
};

// ============================================================================
// Network Status Types
// ============================================================================

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null; // wifi, cellular, etc.
}

// ============================================================================
// Sync Status Types
// ============================================================================

export interface SyncStatus {
  isSyncing: boolean;
  pendingActions: number;
  lastSyncTime: number | null;
  conflicts: number;
  progress: number; // 0-100
}
