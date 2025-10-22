/**
 * Sync Service
 * Handles offline action queue and synchronization with server
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SyncAction,
  SyncActionType,
  SyncPriority,
  ConflictData,
  STORAGE_KEYS,
  SyncStatus,
} from '../types/offline.types';
import {workoutService, programService, userService} from './api';
import {networkService} from './network.service';
import {storageService} from './storage.service';

type SyncListener = (status: SyncStatus) => void;
type ConflictListener = (conflict: ConflictData) => void;

class SyncService {
  private syncListeners: Set<SyncListener> = new Set();
  private conflictListeners: Set<ConflictListener> = new Set();
  private isSyncing = false;
  private syncQueue: SyncAction[] = [];
  private conflicts: ConflictData[] = [];

  /**
   * Initialize sync service
   */
  async initialize(): Promise<void> {
    await this.loadQueue();
    await this.loadConflicts();
    console.log('[SyncService] Initialized with', this.syncQueue.length, 'pending actions');
  }

  /**
   * Load sync queue from storage
   */
  private async loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      if (stored) {
        this.syncQueue = JSON.parse(stored);
        // Sort by priority (1 = highest)
        this.syncQueue.sort((a, b) => a.priority - b.priority);
      }
    } catch (error) {
      console.error('[SyncService] Error loading queue:', error);
    }
  }

  /**
   * Save sync queue to storage
   */
  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('[SyncService] Error saving queue:', error);
    }
  }

  /**
   * Load conflicts from storage
   */
  private async loadConflicts(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CONFLICTS);
      if (stored) {
        this.conflicts = JSON.parse(stored);
      }
    } catch (error) {
      console.error('[SyncService] Error loading conflicts:', error);
    }
  }

  /**
   * Save conflicts to storage
   */
  private async saveConflicts(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CONFLICTS, JSON.stringify(this.conflicts));
    } catch (error) {
      console.error('[SyncService] Error saving conflicts:', error);
    }
  }

  /**
   * Get priority for action type
   */
  private getPriority(type: SyncActionType): SyncPriority {
    switch (type) {
      case 'CREATE_SESSION':
        return 1; // Highest priority
      case 'LIKE_PROGRAM':
      case 'UNLIKE_PROGRAM':
      case 'LIKE_SESSION':
      case 'UNLIKE_SESSION':
        return 2;
      case 'UPDATE_PROFILE':
        return 3;
      case 'CREATE_FEEDBACK':
        return 4; // Lowest priority
      default:
        return 4;
    }
  }

  /**
   * Add action to sync queue
   */
  async addAction(type: SyncActionType, data: any): Promise<string> {
    const action: SyncAction = {
      id: this.generateId(),
      type,
      priority: this.getPriority(type),
      timestamp: Date.now(),
      data,
      retryCount: 0,
      status: 'pending',
    };

    this.syncQueue.push(action);
    this.syncQueue.sort((a, b) => a.priority - b.priority);
    await this.saveQueue();

    console.log('[SyncService] Action added:', type, action.id);
    this.notifySyncListeners();

    return action.id;
  }

  /**
   * Execute single sync action
   */
  private async executeAction(action: SyncAction, token: string): Promise<void> {
    console.log('[SyncService] Executing action:', action.type, action.id);

    try {
      switch (action.type) {
        case 'CREATE_SESSION':
          await workoutService.saveWorkoutSession(action.data, token);
          break;

        case 'LIKE_PROGRAM':
          await programService.likeProgram(action.data.programId, token);
          break;

        case 'UNLIKE_PROGRAM':
          await programService.unlikeProgram(action.data.programId, token);
          break;

        case 'LIKE_SESSION':
          await workoutService.likeWorkout(action.data.sessionId, token);
          break;

        case 'UNLIKE_SESSION':
          await workoutService.unlikeWorkout(action.data.sessionId, token);
          break;

        case 'UPDATE_PROFILE':
          await userService.updateProfile(token, action.data);
          break;

        case 'CREATE_FEEDBACK':
          // Assume feedback service has this method
          // await feedbackService.createFeedback(action.data, token);
          console.log('[SyncService] Feedback creation not implemented yet');
          break;

        default:
          console.warn('[SyncService] Unknown action type:', action.type);
      }

      action.status = 'completed';
      console.log('[SyncService] Action completed:', action.type, action.id);
    } catch (error: any) {
      action.status = 'failed';
      action.retryCount++;
      action.error = error.message;

      // Check if it's a conflict (409 status or specific error message)
      if (error.message?.includes('conflict') || error.message?.includes('409')) {
        await this.handleConflict(action, error);
      }

      console.error('[SyncService] Action failed:', action.type, action.id, error);

      // Remove action if max retries exceeded (3 times)
      if (action.retryCount >= 3) {
        console.warn('[SyncService] Max retries exceeded, removing action:', action.id);
        throw error; // Will be caught by sync() and action will be removed
      } else {
        throw error; // Will retry later
      }
    }
  }

  /**
   * Handle conflict
   */
  private async handleConflict(action: SyncAction, error: any): Promise<void> {
    const conflict: ConflictData = {
      id: action.id,
      type: this.getConflictType(action.type),
      localVersion: action.data,
      serverVersion: error.serverData || null, // Server should return current data
      localTimestamp: action.timestamp,
      serverTimestamp: Date.now(),
    };

    this.conflicts.push(conflict);
    await this.saveConflicts();
    this.notifyConflictListeners(conflict);

    console.log('[SyncService] Conflict detected:', conflict.id);
  }

  /**
   * Get conflict type from action type
   */
  private getConflictType(actionType: SyncActionType): ConflictData['type'] {
    if (actionType === 'CREATE_SESSION') return 'session';
    if (actionType === 'UPDATE_PROFILE') return 'profile';
    return 'like';
  }

  /**
   * Sync all pending actions
   */
  async sync(token: string): Promise<void> {
    if (this.isSyncing) {
      console.log('[SyncService] Sync already in progress');
      return;
    }

    if (!networkService.isOnline()) {
      console.log('[SyncService] Device is offline, skipping sync');
      return;
    }

    // Check WiFi only setting
    const settings = await storageService.getSettings();
    if (settings.syncOnWifiOnly && !networkService.isWiFi()) {
      console.log('[SyncService] WiFi only mode, skipping sync');
      return;
    }

    this.isSyncing = true;
    this.notifySyncListeners();

    console.log('[SyncService] Starting sync with', this.syncQueue.length, 'actions');

    const actionsToSync = this.syncQueue.filter(
      action => action.status === 'pending' || action.status === 'failed',
    );

    let completed = 0;
    const total = actionsToSync.length;

    for (const action of actionsToSync) {
      if (!networkService.isOnline()) {
        console.log('[SyncService] Lost connection, stopping sync');
        break;
      }

      action.status = 'syncing';
      this.notifySyncListeners();

      try {
        await this.executeAction(action, token);
        completed++;

        // Remove completed action from queue
        this.syncQueue = this.syncQueue.filter(a => a.id !== action.id);
      } catch (error) {
        console.error('[SyncService] Sync action failed:', action.id, error);
        // Action stays in queue for retry (unless max retries exceeded)
        if (action.retryCount >= 3) {
          this.syncQueue = this.syncQueue.filter(a => a.id !== action.id);
        }
      }

      this.notifySyncListeners();
    }

    await this.saveQueue();
    await storageService.setLastSyncTime(Date.now());

    this.isSyncing = false;
    this.notifySyncListeners();

    console.log('[SyncService] Sync completed:', completed, '/', total);
  }

  /**
   * Resolve conflict
   */
  async resolveConflict(
    conflictId: string,
    resolution: 'keep_local' | 'keep_server',
  ): Promise<void> {
    const conflict = this.conflicts.find(c => c.id === conflictId);
    if (!conflict) {
      console.warn('[SyncService] Conflict not found:', conflictId);
      return;
    }

    // Find corresponding action in queue
    const action = this.syncQueue.find(a => a.id === conflictId);

    if (resolution === 'keep_local' && action) {
      // Retry the action (reset status and retry count)
      action.status = 'pending';
      action.retryCount = 0;
      action.error = undefined;
      await this.saveQueue();
    } else {
      // Keep server version - just remove the action
      this.syncQueue = this.syncQueue.filter(a => a.id !== conflictId);
      await this.saveQueue();
    }

    // Remove conflict
    this.conflicts = this.conflicts.filter(c => c.id !== conflictId);
    await this.saveConflicts();

    console.log('[SyncService] Conflict resolved:', conflictId, resolution);
    this.notifySyncListeners();
  }

  /**
   * Get sync status
   */
  getSyncStatus(): SyncStatus {
    const pending = this.syncQueue.filter(
      a => a.status === 'pending' || a.status === 'failed',
    ).length;
    const syncing = this.syncQueue.filter(a => a.status === 'syncing').length;
    const total = this.syncQueue.length;

    const progress = total === 0 ? 100 : Math.round(((total - pending) / total) * 100);

    return {
      isSyncing: this.isSyncing,
      pendingActions: pending,
      lastSyncTime: null, // Will be set from storage
      conflicts: this.conflicts.length,
      progress,
    };
  }

  /**
   * Get all conflicts
   */
  getConflicts(): ConflictData[] {
    return [...this.conflicts];
  }

  /**
   * Clear all completed actions
   */
  async clearCompleted(): Promise<void> {
    this.syncQueue = this.syncQueue.filter(a => a.status !== 'completed');
    await this.saveQueue();
    console.log('[SyncService] Completed actions cleared');
  }

  /**
   * Add sync listener
   */
  addSyncListener(listener: SyncListener): () => void {
    this.syncListeners.add(listener);
    return () => this.syncListeners.delete(listener);
  }

  /**
   * Add conflict listener
   */
  addConflictListener(listener: ConflictListener): () => void {
    this.conflictListeners.add(listener);
    return () => this.conflictListeners.delete(listener);
  }

  /**
   * Notify sync listeners
   */
  private notifySyncListeners(): void {
    const status = this.getSyncStatus();
    this.syncListeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('[SyncService] Error in sync listener:', error);
      }
    });
  }

  /**
   * Notify conflict listeners
   */
  private notifyConflictListeners(conflict: ConflictData): void {
    this.conflictListeners.forEach(listener => {
      try {
        listener(conflict);
      } catch (error) {
        console.error('[SyncService] Error in conflict listener:', error);
      }
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const syncService = new SyncService();
