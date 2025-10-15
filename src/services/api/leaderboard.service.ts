/**
 * Leaderboard Service
 * Handles all leaderboard and ranking-related API operations
 */

import {API_BASE_URL} from './api.config';
import ApiClient from './apiClient';

const client = new ApiClient(API_BASE_URL);

// Types pour le leaderboard
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  rank: number;
  TotalCalories: number;
  TotalSessions: number;
  BestSessionReps: number;
  CurrentStreak: number;
  score: number; // Total push-ups, points, etc.
  change?: number; // Changement de position (positif = montée, négatif = descente)
  badges?: string[];
}

export interface UserRank {
  userId: string;
  rank: number;
  score: number;
  totalUsers: number;
  percentile: number; // Top X%
}

export type LeaderboardPeriod =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'all-time';

export type LeaderboardMetric =
  | 'total-pushups' // Total de pompes
  | 'total-workouts' // Nombre total d'entraînements
  | 'total-calories' // Total de calories brûlées
  | 'max-reps' // Record de répétitions en une session
  | 'max-streak'; // Plus longue série de jours consécutifs

/**
 * Get leaderboard
 * @param period - Time period (daily, weekly, monthly, yearly, all-time)
 * @param metric - Metric to rank by (total-pushups, total-workouts, total-calories, max-reps, max-streak)
 * @param limit - Number of entries to return
 * @param offset - Offset for pagination
 * @param token - Authentication token
 * @returns List of leaderboard entries
 */
export async function getLeaderboard(
  period: LeaderboardPeriod = 'all-time',
  metric: LeaderboardMetric = 'total-pushups',
  limit: number = 50,
  offset: number = 0,
  token?: string,
): Promise<LeaderboardEntry[]> {
  console.log(
    '[LeaderboardService] getLeaderboard:',
    period,
    metric,
    limit,
    offset,
  );
  return client.get('/leaderboard', {period, metric, limit, offset}, token);
}

/**
 * Get user's rank in the leaderboard
 * @param userId - User ID
 * @param period - Time period
 * @param token - Authentication token
 * @returns User rank information
 */
export async function getUserRank(
  userId: string,
  period: LeaderboardPeriod = 'all-time',
  token?: string,
): Promise<UserRank> {
  console.log('[LeaderboardService] getUserRank:', userId, period);
  return client.get(`/leaderboard/users/${userId}`, {period}, token);
}

/**
 * Get users near the specified user in the leaderboard
 * @param userId - User ID
 * @param range - Number of users above and below (default: 5)
 * @param period - Time period
 * @param token - Authentication token
 * @returns List of nearby leaderboard entries
 */
export async function getNearbyUsers(
  userId: string,
  range: number = 5,
  period: LeaderboardPeriod = 'all-time',
  token?: string,
): Promise<LeaderboardEntry[]> {
  console.log('[LeaderboardService] getNearbyUsers:', userId, range, period);
  return client.get(
    `/leaderboard/users/${userId}/nearby`,
    {range, period},
    token,
  );
}

/**
 * Get top performers (top 3 users)
 * @param period - Time period
 * @param token - Authentication token
 * @returns Top 3 leaderboard entries
 */
export async function getTopPerformers(
  period: LeaderboardPeriod = 'all-time',
  token?: string,
): Promise<LeaderboardEntry[]> {
  console.log('[LeaderboardService] getTopPerformers:', period);
  return client.get('/leaderboard/top', {period}, token);
}

/**
 * Get leaderboard by challenge
 * @param challengeId - Challenge ID
 * @param limit - Number of entries to return
 * @param token - Authentication token
 * @returns Challenge-specific leaderboard
 */
export async function getChallengeLeaderboard(
  challengeId: string,
  limit: number = 50,
  token?: string,
): Promise<LeaderboardEntry[]> {
  console.log(
    '[LeaderboardService] getChallengeLeaderboard:',
    challengeId,
    limit,
  );
  return client.get(`/challenges/${challengeId}/leaderboard`, {limit}, token);
}

/**
 * Get friends leaderboard (if social features are implemented)
 * @param userId - User ID
 * @param period - Time period
 * @param token - Authentication token
 * @returns Friends leaderboard
 */
export async function getFriendsLeaderboard(
  userId: string,
  period: LeaderboardPeriod = 'all-time',
  token?: string,
): Promise<LeaderboardEntry[]> {
  console.log('[LeaderboardService] getFriendsLeaderboard:', userId, period);
  return client.get(`/users/${userId}/friends/leaderboard`, {period}, token);
}

export const leaderboardService = {
  getLeaderboard,
  getUserRank,
  getNearbyUsers,
  getTopPerformers,
  getChallengeLeaderboard,
  getFriendsLeaderboard,
};
