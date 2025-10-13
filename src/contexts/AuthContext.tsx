/**
 * Authentication Context
 *
 * Manages user authentication state across the app
 */

import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import {Platform} from 'react-native';
import {GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID} from '@env';
import {User} from '../types/user.types';
import {userService} from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const AUTH_TOKEN_KEY = '@pompeurpro:auth_token';
const USER_DATA_KEY = '@pompeurpro:user_data';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId:
        GOOGLE_IOS_CLIENT_ID &&
        GOOGLE_IOS_CLIENT_ID !== 'YOUR_IOS_CLIENT_ID_HERE'
          ? GOOGLE_IOS_CLIENT_ID
          : undefined,
      offlineAccess: true,
    });
  }, []);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    loadUser();
  }, []);

  const getToken = () => AsyncStorage.getItem(AUTH_TOKEN_KEY);

  const loadUser = async () => {
    try {
      const [token, userData] = await Promise.all([
        getToken(),
        AsyncStorage.getItem(USER_DATA_KEY),
      ]);

      console.log('[AuthContext] userData:', userData);

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Logging in with email:', email);

      // Utiliser le service API
      const response = await userService.login(email, password);

      // Vérifier que les données sont valides avant de les stocker
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from login API');
      }

      // Stocker le token et les données utilisateur
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user)),
      ]);

      setUser(response.user);
      console.log('[AuthContext] Login successful');
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log('[AuthContext] Registering user:', email);

      // Utiliser le service API
      const response = await userService.register(email, password, name);

      // Vérifier que les données sont valides avant de les stocker
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from registration API');
      }

      // Stocker le token et les données utilisateur
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user)),
      ]);

      setUser(response.user);
      console.log('[AuthContext] Registration successful');
    } catch (error) {
      console.error('[AuthContext] Register error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('[AuthContext] Logging in with Google');

      // Check if device supports Google Play services
      await GoogleSignin.hasPlayServices();

      // Get user info from Google
      const signInResult = await GoogleSignin.signIn();

      if (signInResult.type !== 'success') {
        throw new Error('Google Sign-In was cancelled');
      }

      const {data} = signInResult;
      const googleToken = data.idToken;

      if (!googleToken) {
        throw new Error('No Google ID token received');
      }

      // Send Google token to backend API
      const response = await userService.loginWithGoogle(googleToken);

      // Vérifier que les données sont valides
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from Google login API');
      }

      // Store token and user data
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user)),
      ]);

      setUser(response.user);
      console.log('[AuthContext] Google login successful');
    } catch (error) {
      console.error('[AuthContext] Google login error:', error);
      throw error;
    }
  };

  const loginWithApple = async () => {
    try {
      console.log('[AuthContext] Logging in with Apple');

      // Apple Sign-In is only available on iOS 13+
      if (Platform.OS !== 'ios') {
        throw new Error('Apple Sign-In is only available on iOS');
      }

      // Perform Apple Sign-In request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Get credential state
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState !== appleAuth.State.AUTHORIZED) {
        throw new Error('Apple Sign-In not authorized');
      }

      // Send Apple token to backend API
      const fullName = appleAuthRequestResponse.fullName
        ? {
            givenName: appleAuthRequestResponse.fullName.givenName || undefined,
            familyName:
              appleAuthRequestResponse.fullName.familyName || undefined,
          }
        : undefined;

      const response = await userService.loginWithApple(
        appleAuthRequestResponse.identityToken!,
        appleAuthRequestResponse.user,
        appleAuthRequestResponse.email || undefined,
        fullName,
      );

      // Vérifier que les données sont valides
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from Apple login API');
      }

      // Store token and user data
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user)),
      ]);

      setUser(response.user);
      console.log('[AuthContext] Apple login successful');
    } catch (error) {
      console.error('[AuthContext] Apple login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('[AuthContext] Logging out');

      // Appeler le service API (qui peut invalider le token côté serveur)
      const token = await getToken();
      console.log('[AuthContext] Token:', token);
      const response = await userService.logout(token || undefined);
      console.log('[AuthContext] Logout response:', response);

      if (!response || !response.success) {
        throw new Error('Invalid response from logout API');
      }

      // Supprimer les données locales
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
      ]);

      setUser(null);
      console.log('[AuthContext] Logout successful');
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      console.log('[AuthContext] Deleting account:', user.id);

      // Utiliser le service API
      const token = await getToken();
      console.log('[AuthContext] Token:', token);
      await userService.deleteAccount(user.id, token || undefined);
      setUser(null);
      console.log('[AuthContext] Account deleted successfully');
    } catch (error) {
      console.error('[AuthContext] Delete account error:', error);
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      console.log('[AuthContext] Updating user:', user.id, updates);

      const token = await getToken();
      const updatedUser = await userService.updateProfile(
        user.id,
        updates,
        token || undefined,
      );

      // Mettre à jour le stockage local
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log('[AuthContext] User updated successfully');
    } catch (error) {
      console.error('[AuthContext] Update user error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    loginWithGoogle,
    loginWithApple,
    logout,
    updateUser,
    deleteAccount,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
