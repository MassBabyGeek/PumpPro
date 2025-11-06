/**
 * Credentials Storage Service
 * Handles secure storage of user credentials for "Remember Me" functionality
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CREDENTIALS_KEY = '@pompeurpro:saved_credentials';
const REMEMBER_ME_KEY = '@pompeurpro:remember_me';

/**
 * SÉCURITÉ: On ne stocke JAMAIS le mot de passe en clair
 * La fonctionnalité "Se souvenir de moi" ne garde que l'email
 */
export interface SavedCredentials {
  email: string;
}

/**
 * Save user email to storage (for "Remember Me" functionality)
 * SÉCURITÉ: Ne sauvegarde que l'email, jamais le mot de passe
 */
export const saveCredentials = async (email: string): Promise<void> => {
  try {
    const credentials: SavedCredentials = {email};
    await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  } catch (error) {
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
    return null;
  }
};

/**
 * Clear saved credentials from storage
 */
export const clearCredentials = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CREDENTIALS_KEY);
  } catch (error) {
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
