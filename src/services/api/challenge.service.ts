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
 * @param token - Authentication token
 * @returns List of challenges
 */
export async function getChallenges(
  filters?: Partial<ChallengeFilters>,
  token?: string,
): Promise<Challenge[]> {
  console.log('[ChallengeService] getChallenges:', filters);
  return client.get('/challenges', filters as any, token);
}

/**
 * Get challenge by ID
 * @param challengeId - Challenge ID
 * @param token - Authentication token
 * @returns Challenge details
 */
export async function getChallengeById(
  challengeId: string,
  token?: string,
): Promise<Challenge | null> {
  console.log('[ChallengeService] getChallengeById:', challengeId);
  return client.get(`/challenges/${challengeId}`, undefined, token);
}

/**
 * Like a challenge
 * @param challengeId - Challenge ID
 * @param token - Authentication token
 * @returns Updated challenge
 */
export async function likeChallenge(
  challengeId: string,
  token?: string,
): Promise<Challenge> {
  console.log('[ChallengeService] likeChallenge:', challengeId);
  return client.post(`/challenges/${challengeId}/like`, {}, token);
}

/**
 * Unlike a challenge
 * @param challengeId - Challenge ID
 * @param token - Authentication token
 * @returns Updated challenge
 */
export async function unlikeChallenge(
  challengeId: string,
  token?: string,
): Promise<Challenge> {
  console.log('[ChallengeService] unlikeChallenge:', challengeId);
  return client.delete(`/challenges/${challengeId}/like`, token);
}

/**
 * Start a challenge
 * @param challengeId - Challenge ID
 * @param token - Authentication token
 * @returns User challenge progress
 */
export async function startChallenge(
  challengeId: string,
  token?: string,
): Promise<UserChallengeProgress> {
  console.log('[ChallengeService] startChallenge:', challengeId);
  return client.post(`/challenges/${challengeId}/start`, {}, token);
}

/**
 * Complete a task in a challenge
 * @param challengeId - Challenge ID
 * @param taskId - Task ID
 * @param score - Score achieved (reps completed, time, etc.)
 * @param token - Authentication token
 * @returns Updated task
 */
export async function completeTask(
  challengeId: string,
  taskId: string,
  score: number,
  token?: string,
): Promise<ChallengeTask> {
  console.log('[ChallengeService] completeTask:', challengeId, taskId, score);
  return client.post(
    `/challenges/${challengeId}/tasks/${taskId}`,
    {score},
    token,
  );
}

/**
 * Complete a challenge
 * @param challengeId - Challenge ID
 * @param token - Authentication token
 * @returns Updated challenge progress
 */
export async function completeChallenge(
  challengeId: string,
  token?: string,
): Promise<UserChallengeProgress> {
  console.log('[ChallengeService] completeChallenge:', challengeId);
  return client.post(`/challenges/${challengeId}/complete`, {}, token);
}

/**
 * Get user's progress for a challenge
 * @param challengeId - Challenge ID
 * @param token - Authentication token
 * @returns User challenge progress
 */
export async function getUserChallengeProgress(
  challengeId: string,
  token?: string,
): Promise<UserChallengeProgress | null> {
  console.log('[ChallengeService] getUserChallengeProgress:', challengeId);
  return client.get(`/challenges/${challengeId}/progress`, undefined, token);
}

/**
 * Get all user's active challenges
 * @param userId - User ID
 * @param token - Authentication token
 * @returns List of active challenges
 */
export async function getUserActiveChallenges(
  userId: string,
  token?: string,
): Promise<Challenge[]> {
  console.log('[ChallengeService] getUserActiveChallenges:', userId);
  return client.get(`/users/${userId}/challenges/active`, undefined, token);
}

/**
 * Get all user's completed challenges
 * @param userId - User ID
 * @param token - Authentication token
 * @returns List of completed challenges
 */
export async function getUserCompletedChallenges(
  userId: string,
  token?: string,
): Promise<Challenge[]> {
  console.log('[ChallengeService] getUserCompletedChallenges:', userId);
  return client.get(`/users/${userId}/challenges/completed`, undefined, token);
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
