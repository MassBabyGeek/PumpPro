import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import {Platform} from 'react-native';
import {GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID} from '@env';
import {userService} from '../services/api';

const AUTH_TOKEN_KEY = '@pompeurpro:auth_token';

interface AuthContextType {
  token: string | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId:
        GOOGLE_IOS_CLIENT_ID !== 'YOUR_IOS_CLIENT_ID_HERE'
          ? GOOGLE_IOS_CLIENT_ID
          : undefined,
      offlineAccess: true,
    });

    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (storedToken) setToken(storedToken);
    } catch (error) {
      console.error('[AuthProvider] Error loading token', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToken = async (newToken: string) => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const removeToken = async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(undefined);
  };

  const login = async (email: string, password: string) => {
    const response = await userService.login(email, password);
    if (!response?.token) throw new Error('Login failed');
    await saveToken(response.token);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await userService.register(email, password, name);
    if (!response?.token) throw new Error('Registration failed');
    await saveToken(response.token);
  };

  const loginWithGoogle = async () => {
    await GoogleSignin.hasPlayServices();
    const result = await GoogleSignin.signIn();
    if (!result.data?.idToken) throw new Error('No Google token');
    const response = await userService.loginWithGoogle(result.data?.idToken);
    if (!response?.token) throw new Error('Google login failed');
    await saveToken(response.token);
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
    if (!response?.token) throw new Error('Apple login failed');
    await saveToken(response.token);
  };

  const logout = async () => {
    if (token) await userService.logout(token);
    await removeToken();
  };

  const getToken = async () => token;

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        loginWithApple,
        logout,
        getToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
