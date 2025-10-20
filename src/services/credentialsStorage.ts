/**
 * Credentials Storage Service
 * Handles secure storage of user credentials for "Remember Me" functionality
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CREDENTIALS_KEY = '@pompeurpro:saved_credentials';
const REMEMBER_ME_KEY = '@pompeurpro:remember_me';

export interface SavedCredentials {
  email: string;
  password: string;
}

/**
 * Save user credentials to storage
 */
export const saveCredentials = async (
  email: string,
  password: string,
): Promise<void> => {
  try {
    const credentials: SavedCredentials = {email, password};
    await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
    console.log('[CredentialsStorage] Credentials saved');
  } catch (error) {
    console.error('[CredentialsStorage] Error saving credentials:', error);
    throw error;
  }
};

/**
 * Get saved credentials from storage
 */
export const getSavedCredentials = async (): Promise<SavedCredentials | null> => {
  try {
    const credentials = await AsyncStorage.getItem(CREDENTIALS_KEY);
    if (credentials) {
      return JSON.parse(credentials);
    }
    return null;
  } catch (error) {
    console.error('[CredentialsStorage] Error getting credentials:', error);
    return null;
  }
};

/**
 * Clear saved credentials from storage
 */
export const clearCredentials = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CREDENTIALS_KEY);
    console.log('[CredentialsStorage] Credentials cleared');
  } catch (error) {
    console.error('[CredentialsStorage] Error clearing credentials:', error);
    throw error;
  }
};

/**
 * Save "Remember Me" preference
 */
export const setRememberMe = async (remember: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(remember));
  } catch (error) {
    console.error('[CredentialsStorage] Error saving remember me:', error);
    throw error;
  }
};

/**
 * Get "Remember Me" preference
 */
export const getRememberMe = async (): Promise<boolean> => {
  try {
    const remember = await AsyncStorage.getItem(REMEMBER_ME_KEY);
    return remember ? JSON.parse(remember) : false;
  } catch (error) {
    console.error('[CredentialsStorage] Error getting remember me:', error);
    return false;
  }
};

export const credentialsStorage = {
  saveCredentials,
  getSavedCredentials,
  clearCredentials,
  setRememberMe,
  getRememberMe,
};
