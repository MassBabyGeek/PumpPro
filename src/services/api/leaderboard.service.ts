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
  totalCalories: number;
  totalSessions: number;
  bestSessionReps: number;
  currentStreak: number;
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
 * @returns List of leaderboard entries
 */
export async function getLeaderboard(
  period: LeaderboardPeriod = 'all-time',
  metric: LeaderboardMetric = 'total-pushups',
  limit: number = 50,
  offset: number = 0,
): Promise<LeaderboardEntry[]> {
  return client.get('/leaderboard', {period, metric, limit, offset});
}

/**
 * Get user's rank in the leaderboard
 * @param userId - User ID
 * @param period - Time period
 * @returns User rank information
 */
export async function getUserRank(
  userId: string,
  period: LeaderboardPeriod = 'all-time',
): Promise<UserRank> {
  return client.get(`/leaderboard/users/${userId}`, {period});
}

/**
 * Get users near the specified user in the leaderboard
 * @param userId - User ID
 * @param range - Number of users above and below (default: 5)
 * @param period - Time period
 * @returns List of nearby leaderboard entries
 */
export async function getNearbyUsers(
  userId: string,
  range: number = 5,
  period: LeaderboardPeriod = 'all-time',
): Promise<LeaderboardEntry[]> {
  return client.get(`/leaderboard/users/${userId}/nearby`, {range, period});
}

/**
 * Get top performers (top 3 users)
 * @param period - Time period
 * @returns Top 3 leaderboard entries
 */
export async function getTopPerformers(
  period: LeaderboardPeriod = 'all-time',
): Promise<LeaderboardEntry[]> {
  return client.get('/leaderboard/top', {period});
}

/**
 * Get leaderboard by challenge
 * @param challengeId - Challenge ID
 * @param limit - Number of entries to return
 * @returns Challenge-specific leaderboard
 */
export async function getChallengeLeaderboard(
  challengeId: string,
  limit: number = 50,
): Promise<LeaderboardEntry[]> {
  return client.get(`/challenges/${challengeId}/leaderboard`, {limit});
}

/**
 * Get friends leaderboard (if social features are implemented)
 * @param userId - User ID
 * @param period - Time period
 * @returns Friends leaderboard
 */
export async function getFriendsLeaderboard(
  userId: string,
  period: LeaderboardPeriod = 'all-time',
): Promise<LeaderboardEntry[]> {
  return client.get(`/users/${userId}/friends/leaderboard`, {period});
}

export const leaderboardService = {
  getLeaderboard,
  getUserRank,
  getNearbyUsers,
  getTopPerformers,
  getChallengeLeaderboard,
  getFriendsLeaderboard,
};
