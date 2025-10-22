/**
 * User Service
 * Handles all user-related API operations
 */

import {API_BASE_URL} from './api.config';
import ApiClient from './apiClient';
import {
  UserProfile,
  ChartData,
  Stats,
  AllStats,
  RawChartItem,
} from '../../types/user.types';

const client = new ApiClient(API_BASE_URL);

/**
 * Login user
 * @param email - User email
 * @param password - User password
 * @returns User profile and authentication tokens
 */
export async function login(
  email: string,
  password: string,
): Promise<{user: UserProfile; token: string; refreshToken: string}> {
  return client.post('/auth/login', {email, password}, true); // skipAuth
}

/**
 * Register new user
 * @param email - User email
 * @param password - User password
 * @param name - User name
 * @returns User profile and authentication tokens
 */
export async function register(
  email: string,
  password: string,
  name: string,
): Promise<{user: UserProfile; token: string; refreshToken: string}> {
  return client.post('/auth/signup', {email, password, name}, true); // skipAuth
}

/**
 * Get user profile
 * @param userId - User ID
 * @returns User profile
 */
export async function getProfile(userId: string): Promise<UserProfile> {
  return client.get(`/users/${userId}`);
}

/**
 * Update user profile
 * @param userId - User ID
 * @param data - Partial user data to update
 * @returns Updated user profile
 */
export async function updateProfile(
  userId: string,
  data: Partial<UserProfile>,
): Promise<UserProfile> {
  return client.put(`/users/${userId}`, data);
}

/**
 * Upload user avatar
 * @param userId - User ID
 * @param imageUri - Local image URI
 * @returns Updated user profile with avatar URL
 */
export async function uploadAvatar(
  userId: string,
  imageUri: string,
): Promise<UserProfile> {
  const formData = new FormData();
  formData.append('avatar', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'avatar.jpg',
  } as any);

  return client.post(`/users/${userId}/avatar`, formData);
}

/**
 * Delete user account
 * @param userId - User ID
 */
export async function deleteAccount(
  userId: string,
): Promise<{success: boolean}> {
  return client.delete(`/users/${userId}`);
}

/**
 * Logout user
 */
export async function logout(): Promise<{success: boolean}> {
  return client.post('/auth/logout', {});
}

/**
 * Get user statistics
 * @param userId - User ID
 * @returns User workout statistics
 */
export async function getStats(
  userId: string,
  selectedPeriod: string,
): Promise<Stats> {
  return client.get(`/users/${userId}/stats/${selectedPeriod}`);
}

/**
 * Get chart data for user
 * @param userId - User ID
 * @param period - Chart period (week, month, year)
 * @returns Chart data
 */
export async function getChartData(
  userId: string,
  period: 'week' | 'month' | 'year',
): Promise<RawChartItem[]> {
  return client.get(`/users/${userId}/charts/${period}`);
}

/**
 * Reset user password
 * @param email - User email
 */
export async function resetPassword(
  email: string,
): Promise<{success: boolean}> {
  return client.post('/auth/reset-password', {email}, true); // skipAuth
}

/**
 * Verify email
 * @param token - Verification token
 */
export async function verifyEmail(token: string): Promise<{success: boolean}> {
  return client.post('/auth/verify-email', {token}, true); // skipAuth
}

/**
 * Login with Google
 * @param idToken - Google ID token
 * @param email - User email (optional, extracted from token if not provided)
 * @param name - User name (optional, extracted from token if not provided)
 * @returns User profile and authentication tokens
 */
export async function loginWithGoogle(
  idToken: string,
  email?: string,
  name?: string,
): Promise<{user: UserProfile; token: string; refreshToken: string}> {
  return client.post('/auth/google', {idToken, email, name}, true); // skipAuth
}

export async function getAllStats(userId: string): Promise<AllStats> {
  return client.get(`/users/${userId}/stats`);
}

/**
 * Login with Apple
 * @param identityToken - Apple identity token
 * @param user - Apple user identifier
 * @param email - User email (optional, only provided on first sign-in)
 * @param fullName - User full name (optional, only provided on first sign-in)
 * @returns User profile and authentication token
 */
export async function loginWithApple(
  identityToken: string,
  user: string,
  email?: string,
  fullName?: {givenName?: string; familyName?: string},
): Promise<{user: UserProfile; token: string; refreshToken: string}> {
  return client.post(
    '/auth/apple',
    {identityToken, user, email, fullName},
    true, // skipAuth
  );
}

/**
 * Refresh access token using refresh token
 * @param refreshToken - Refresh token
 * @returns New access token and refresh token
 */
export async function refreshToken(
  refreshToken: string,
): Promise<{token: string; refreshToken: string}> {
  return client.post('/auth/refresh', {refreshToken}, true); // skipAuth
}

export const userService = {
  login,
  register,
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAccount,
  logout,
  getStats,
  getChartData,
  resetPassword,
  verifyEmail,
  loginWithGoogle,
  loginWithApple,
  getAllStats,
  refreshToken,
};
