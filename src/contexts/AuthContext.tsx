import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import {Platform} from 'react-native';
import {GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID} from '@env';
import {userService} from '../services/api';
import {
  setGetTokenCallback,
  setTokenRefreshCallback,
  setForceLogoutCallback,
} from '../services/api/apiClient';

const AUTH_TOKEN_KEY = '@pompeurpro:auth_token';
const REFRESH_TOKEN_KEY = '@pompeurpro:refresh_token';
const USER_DATA_KEY = '@pompeurpro:user_data';

interface AuthContextType {
  token: string | undefined;
  refreshToken: string | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
  getRefreshToken: () => Promise<string | undefined>;
  refreshAccessToken: () => Promise<string | undefined>;
  forceLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<string | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadTokens = async () => {
    try {
      const [storedToken, storedRefreshToken] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
      ]);
      if (storedToken) setToken(storedToken);
      if (storedRefreshToken) setRefreshToken(storedRefreshToken);
    } catch (error) {
      console.error('[AuthProvider] Error loading tokens', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTokens = async (newToken: string, newRefreshToken: string) => {
    await Promise.all([
      AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken),
      AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken),
    ]);
    setToken(newToken);
    setRefreshToken(newRefreshToken);
  };

  const removeTokens = async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
    ]);
    setToken(undefined);
    setRefreshToken(undefined);
  };

  const login = async (email: string, password: string) => {
    const response = await userService.login(email, password);
    if (!response?.token || !response?.refreshToken) {
      throw new Error('Login failed - missing tokens');
    }
    await saveTokens(response.token, response.refreshToken);
    // Save user data
    if (response.user) {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await userService.register(email, password, name);
    if (!response?.token || !response?.refreshToken) {
      throw new Error('Registration failed - missing tokens');
    }
    await saveTokens(response.token, response.refreshToken);
    // Save user data
    if (response.user) {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
    }
  };

  const loginWithGoogle = async () => {
    await GoogleSignin.hasPlayServices();
    const result = await GoogleSignin.signIn();

    console.log('[AuthContext] Google Sign-In result:', {
      hasIdToken: !!result.data?.idToken,
      hasUser: !!result.data?.user,
      userEmail: result.data?.user?.email,
      userName: result.data?.user?.name,
    });

    if (!result.data?.idToken) throw new Error('No Google token');
    const response = await userService.loginWithGoogle(
      result.data?.idToken,
      result.data?.user?.email,
      result.data?.user?.name || undefined,
    );
    if (!response?.token || !response?.refreshToken) {
      throw new Error('Google login failed - missing tokens');
    }
    await saveTokens(response.token, response.refreshToken);
    // Save user data
    if (response.user) {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
    }
  };

  const loginWithApple = async () => {
    if (Platform.OS !== 'ios') throw new Error('Apple Sign-In only on iOS');
    const res = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    const response = await userService.loginWithApple(
      res.identityToken!,
      res.user,
      res.email || undefined,
      {
        givenName: res.fullName?.givenName || undefined,
        familyName: res.fullName?.familyName || undefined,
      },
    );
    if (!response?.token || !response?.refreshToken) {
      throw new Error('Apple login failed - missing tokens');
    }
    await saveTokens(response.token, response.refreshToken);
    // Save user data
    if (response.user) {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
    }
  };

  // Refresh access token using refresh token
  const refreshAccessToken = async (): Promise<string | undefined> => {
    console.log('[AuthProvider] Attempting to refresh access token...');

    if (!refreshToken) {
      console.warn(
        '[AuthProvider] No refresh token available - forcing logout',
      );
      await forceLogout();
      return undefined;
    }

    try {
      const response = await userService.refreshToken(refreshToken);

      if (!response?.token || !response?.refreshToken) {
        throw new Error('Refresh failed - missing tokens');
      }

      await saveTokens(response.token, response.refreshToken);
      console.log('[AuthProvider] Token refreshed successfully');
      return response.token;
    } catch (error) {
      console.error('[AuthProvider] Token refresh failed:', error);
      // Token refresh failed - force logout
      await forceLogout();
      return undefined;
    }
  };

  const logout = async () => {
    if (token) await userService.logout();
    await removeTokens();
    // Clear user data
    await AsyncStorage.removeItem(USER_DATA_KEY);
  };

  // Force logout without calling API (used when tokens are invalid)
  const forceLogout = async () => {
    console.log('[AuthProvider] Force logout - clearing all data');
    await removeTokens();
    await AsyncStorage.removeItem(USER_DATA_KEY);
  };

  const getToken = async () => token;
  const getRefreshToken = async () => refreshToken;

  // Initialize Google Sign-In and load tokens on mount
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId:
        GOOGLE_IOS_CLIENT_ID !== 'YOUR_IOS_CLIENT_ID_HERE'
          ? GOOGLE_IOS_CLIENT_ID
          : undefined,
      offlineAccess: true,
    });

    loadTokens();
  }, []);

  // Set ApiClient callbacks for automatic token management
  useEffect(() => {
    // ✨ Configure le callback pour récupérer le token actuel
    setGetTokenCallback(async () => token || null);
    // ✨ Configure le callback pour rafraîchir le token
    setTokenRefreshCallback(refreshAccessToken);
    // ✨ Configure le callback pour forcer la déconnexion
    setForceLogoutCallback(forceLogout);
  }, [token, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        loginWithApple,
        logout,
        getToken,
        getRefreshToken,
        refreshAccessToken,
        forceLogout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
