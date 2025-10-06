/**
 * Authentication Context
 *
 * Manages user authentication state across the app
 */

import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types/user.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
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

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(USER_DATA_KEY),
      ]);

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
      // TODO: Remplacer par un vrai appel API
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email === 'test@test.com' && password === 'test') {
        const mockUser: User = {
          id: '1',
          email,
          name: 'Test User',
          joinDate: new Date().toISOString(),
          goal: 'Tester le développement',
          age: 30,
          weight: 70,
          height: 180,
          createdAt: new Date().toISOString(),
        };

        const mockToken = 'mock-jwt-token-' + Date.now();

        await Promise.all([
          AsyncStorage.setItem(AUTH_TOKEN_KEY, mockToken),
          AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUser)),
        ]);

        setUser(mockUser);
      } else {
        throw new Error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // TODO: Remplacer par un vrai appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, mockToken),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUser)),
      ]);

      setUser(mockUser);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
      ]);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedUser = {...user, ...updates};

      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
