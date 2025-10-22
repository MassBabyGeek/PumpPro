/**
 * Network Service
 * Handles network status detection and monitoring
 */

import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {NetworkStatus} from '../types/offline.types';

type NetworkStatusListener = (status: NetworkStatus) => void;

class NetworkService {
  private listeners: Set<NetworkStatusListener> = new Set();
  private currentStatus: NetworkStatus = {
    isConnected: true,
    isInternetReachable: null,
    type: null,
  };
  private unsubscribe: (() => void) | null = null;

  /**
   * Initialize network monitoring
   */
  initialize(): void {
    if (this.unsubscribe) {
      console.warn('[NetworkService] Already initialized');
      return;
    }

    this.unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const newStatus: NetworkStatus = {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      };

      // Only notify if status changed
      if (this.hasStatusChanged(newStatus)) {
        console.log('[NetworkService] Status changed:', newStatus);
        this.currentStatus = newStatus;
        this.notifyListeners(newStatus);
      }
    });

    console.log('[NetworkService] Initialized');
  }

  /**
   * Check if status has changed
   */
  private hasStatusChanged(newStatus: NetworkStatus): boolean {
    return (
      this.currentStatus.isConnected !== newStatus.isConnected ||
      this.currentStatus.isInternetReachable !== newStatus.isInternetReachable ||
      this.currentStatus.type !== newStatus.type
    );
  }

  /**
   * Get current network status
   */
  async getCurrentStatus(): Promise<NetworkStatus> {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
    };
  }

  /**
   * Get cached network status (synchronous)
   */
  getStatus(): NetworkStatus {
    return this.currentStatus;
  }

  /**
   * Check if device is online
   */
  isOnline(): boolean {
    return this.currentStatus.isConnected &&
           (this.currentStatus.isInternetReachable !== false);
  }

  /**
   * Check if connection is WiFi
   */
  isWiFi(): boolean {
    return this.currentStatus.type === 'wifi';
  }

  /**
   * Add status change listener
   */
  addListener(listener: NetworkStatusListener): () => void {
    this.listeners.add(listener);
    console.log('[NetworkService] Listener added, total:', this.listeners.size);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
      console.log('[NetworkService] Listener removed, total:', this.listeners.size);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(status: NetworkStatus): void {
    this.listeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('[NetworkService] Error in listener:', error);
      }
    });
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.listeners.clear();
    console.log('[NetworkService] Cleaned up');
  }
}

export const networkService = new NetworkService();
