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
 * @returns User profile and authentication token
 */
export async function login(
  email: string,
  password: string,
): Promise<{user: UserProfile; token: string}> {
  console.log('[UserService] login:', email);
  return client.post('/auth/login', {email, password});
}

/**
 * Register new user
 * @param email - User email
 * @param password - User password
 * @param name - User name
 * @returns User profile and authentication token
 */
export async function register(
  email: string,
  password: string,
  name: string,
): Promise<{user: UserProfile; token: string}> {
  console.log('[UserService] register:', email, name);
  return client.post('/auth/signup', {email, password, name});
}

/**
 * Get user profile
 * @param userId - User ID
 * @param token - Authentication token
 * @returns User profile
 */
export async function getProfile(
  userId: string,
  token?: string,
): Promise<UserProfile> {
  console.log('[UserService] getProfile:', userId);
  return client.get(`/users/${userId}`, undefined, token);
}

/**
 * Update user profile
 * @param userId - User ID
 * @param data - Partial user data to update
 * @param token - Authentication token
 * @returns Updated user profile
 */
export async function updateProfile(
  userId: string,
  data: Partial<UserProfile>,
  token?: string,
): Promise<UserProfile> {
  console.log('[UserService] updateProfile:', userId, data);
  return client.put(`/users/${userId}`, data, token);
}

/**
 * Upload user avatar
 * @param userId - User ID
 * @param imageUri - Local image URI
 * @param token - Authentication token
 * @returns Updated user profile with avatar URL
 */
export async function uploadAvatar(
  userId: string,
  imageUri: string,
  token?: string,
): Promise<UserProfile> {
  console.log('[UserService] uploadAvatar:', userId, imageUri);

  const formData = new FormData();
  formData.append('avatar', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'avatar.jpg',
  } as any);

  return client.post(`/users/${userId}/avatar`, formData, token);
}

/**
 * Delete user account
 * @param userId - User ID
 * @param token - Authentication token
 */
export async function deleteAccount(
  userId: string,
  token?: string,
): Promise<{success: boolean}> {
  console.log('[UserService] deleteAccount token:', token);
  return client.delete(`/users/${userId}`, token);
}

/**
 * Logout user
 * @param token - Authentication token
 */
export async function logout(token?: string): Promise<{success: boolean}> {
  console.log('[UserService] logout');
  return client.post('/auth/logout', {}, token);
}

/**
 * Get user statistics
 * @param userId - User ID
 * @param token - Authentication token
 * @returns User workout statistics
 */
export async function getStats(
  userId: string,
  selectedPeriod: string,
  token?: string,
): Promise<Stats> {
  console.log('[UserService] getStats on:', selectedPeriod);
  return client.get(
    `/users/${userId}/stats/${selectedPeriod}`,
    undefined,
    token,
  );
}

/**
 * Get chart data for user
 * @param userId - User ID
 * @param period - Chart period (week, month, year)
 * @param token - Authentication token
 * @returns Chart data
 */
export async function getChartData(
  userId: string,
  period: 'week' | 'month' | 'year',
  token?: string,
): Promise<RawChartItem[]> {
  console.log('[UserService] getChartData:', userId, period);
  return client.get(`/users/${userId}/charts/${period}`, undefined, token);
}

/**
 * Reset user password
 * @param email - User email
 */
export async function resetPassword(
  email: string,
): Promise<{success: boolean}> {
  console.log('[UserService] resetPassword:', email);
  return client.post('/auth/reset-password', {email});
}

/**
 * Verify email
 * @param token - Verification token
 */
export async function verifyEmail(token: string): Promise<{success: boolean}> {
  console.log('[UserService] verifyEmail');
  return client.post('/auth/verify-email', {token});
}

/**
 * Login with Google
 * @param idToken - Google ID token
 * @returns User profile and authentication token
 */
export async function loginWithGoogle(
  idToken: string,
): Promise<{user: UserProfile; token: string}> {
  console.log('[UserService] loginWithGoogle');
  return client.post('/auth/google', {idToken});
}

export async function getAllStats(
  userId: string,
  token?: string,
): Promise<AllStats> {
  console.log('[UserService] getAllStats:', userId);
  return client.get(`/users/${userId}/stats`, undefined, token);
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
): Promise<{user: UserProfile; token: string}> {
  console.log('[UserService] loginWithApple');
  return client.post('/auth/apple', {
    identityToken,
    user,
    email,
    fullName,
  });
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
};
