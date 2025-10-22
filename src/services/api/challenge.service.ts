/**
 * Challenge Service
 * Handles all challenge-related API operations
 */

import {API_BASE_URL} from './api.config';
import ApiClient from './apiClient';
import {
  Challenge,
  ChallengeFilters,
  UserChallengeProgress,
  ChallengeTask,
} from '../../types/challenge.types';

const client = new ApiClient(API_BASE_URL);

/**
 * Get all challenges with optional filters
 * @param filters - Challenge filters (category, difficulty, status, etc.)
 * @returns List of challenges
 */
export async function getChallenges(
  filters?: Partial<ChallengeFilters>,
): Promise<Challenge[]> {
  return client.get('/challenges', filters as any);
}

/**
 * Get challenge by ID
 * @param challengeId - Challenge ID
 * @returns Challenge details
 */
export async function getChallengeById(
  challengeId: string,
): Promise<Challenge | null> {
  return client.get(`/challenges/${challengeId}`);
}

/**
 * Like a challenge
 * @param challengeId - Challenge ID
 * @returns Updated challenge
 */
export async function likeChallenge(challengeId: string): Promise<Challenge> {
  return client.post(`/challenges/${challengeId}/like`, {});
}

/**
 * Unlike a challenge
 * @param challengeId - Challenge ID
 * @returns Updated challenge
 */
export async function unlikeChallenge(challengeId: string): Promise<Challenge> {
  return client.delete(`/challenges/${challengeId}/like`);
}

/**
 * Start a challenge
 * @param challengeId - Challenge ID
 * @returns User challenge progress
 */
export async function startChallenge(
  challengeId: string,
): Promise<UserChallengeProgress> {
  return client.post(`/challenges/${challengeId}/start`, {});
}

/**
 * Complete a task in a challenge
 * @param challengeId - Challenge ID
 * @param taskId - Task ID
 * @param score - Score achieved (reps completed, time, etc.)
 * @returns Updated task
 */
export async function completeTask(
  challengeId: string,
  taskId: string,
  score: number,
): Promise<ChallengeTask> {
  return client.post(`/challenges/${challengeId}/tasks/${taskId}`, {score});
}

/**
 * Complete a challenge
 * @param challengeId - Challenge ID
 * @returns Updated challenge progress
 */
export async function completeChallenge(
  challengeId: string,
): Promise<UserChallengeProgress> {
  return client.post(`/challenges/${challengeId}/complete`, {});
}

/**
 * Get user's progress for a challenge
 * @param challengeId - Challenge ID
 * @returns User challenge progress
 */
export async function getUserChallengeProgress(
  challengeId: string,
): Promise<UserChallengeProgress | null> {
  return client.get(`/challenges/${challengeId}/progress`);
}

/**
 * Get all user's active challenges
 * @param userId - User ID
 * @returns List of active challenges
 */
export async function getUserActiveChallenges(
  userId: string,
): Promise<Challenge[]> {
  return client.get(`/users/${userId}/challenges/active`);
}

/**
 * Get all user's completed challenges
 * @param userId - User ID
 * @returns List of completed challenges
 */
export async function getUserCompletedChallenges(
  userId: string,
): Promise<Challenge[]> {
  return client.get(`/users/${userId}/challenges/completed`);
}

export const challengeService = {
  getChallenges,
  getChallengeById,
  likeChallenge,
  unlikeChallenge,
  startChallenge,
  completeTask,
  completeChallenge,
  getUserChallengeProgress,
  getUserActiveChallenges,
  getUserCompletedChallenges,
};
