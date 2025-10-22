/**
 * Workout Service
 * Handles all workout session-related API operations
 */

import {API_BASE_URL} from './api.config';
import ApiClient from './apiClient';
import {WorkoutSession} from '../../types/workout.types';
import {DayStats} from '../../types/user.types';

const client = new ApiClient(API_BASE_URL);

interface WorkoutFilters {
  startDate?: string;
  endDate?: string;
  programType?: string;
  limit?: number;
  offset?: number;
}

interface WorkoutStatsResponse {
  totalSessions: number;
  totalReps: number;
  totalDuration: number;
  averageReps: number;
  bestSession: number;
  totalCalories: number;
}

/**
 * Save a workout session
 * @param session - Workout session data
 * @returns Saved workout session with ID
 */
export async function saveWorkoutSession(
  session: Omit<WorkoutSession, 'sessionId'>,
): Promise<WorkoutSession> {
  return client.post('/workouts', session);
}

/**
 * Get workout sessions for a user
 * @param userId - User ID
 * @param filters - Optional filters (date range, program type, pagination)
 * @returns List of workout sessions
 */
export async function getWorkoutSessions(
  userId: string,
  filters?: WorkoutFilters,
): Promise<WorkoutSession[]> {
  return client.get(`/users/${userId}/workouts`, filters as any);
}

/**
 * Get workout statistics for a user
 * @param userId - User ID
 * @param period - Time period (today, week, month, year)
 * @returns Workout statistics
 */
export async function getWorkoutStats(
  userId: string,
  period: 'today' | 'week' | 'month' | 'year',
): Promise<DayStats> {
  return client.get(`/users/${userId}/workouts/stats`, {period});
}

/**
 * Delete a workout session
 * @param sessionId - Session ID
 * @returns Success status
 */
export async function deleteWorkoutSession(
  sessionId: string,
): Promise<{success: boolean}> {
  return client.delete(`/workouts/${sessionId}`);
}

/**
 * Get a single workout session by ID
 * @param sessionId - Session ID
 * @returns Workout session
 */
export async function getWorkoutSession(
  sessionId: string,
): Promise<WorkoutSession | null> {
  return client.get(`/workouts/${sessionId}`);
}

/**
 * Update a workout session
 * @param sessionId - Session ID
 * @param data - Partial session data to update
 * @returns Updated workout session
 */
export async function updateWorkoutSession(
  sessionId: string,
  data: Partial<WorkoutSession>,
): Promise<WorkoutSession> {
  return client.patch(`/workouts/${sessionId}`, data);
}

/**
 * Get workout summary for a date range
 * @param userId - User ID
 * @param startDate - Start date (ISO string)
 * @param endDate - End date (ISO string)
 * @returns Workout summary
 */
export async function getWorkoutSummary(
  userId: string,
  startDate: string,
  endDate: string,
): Promise<WorkoutStatsResponse> {
  return client.get(`/users/${userId}/workouts/summary`, {startDate, endDate});
}

/**
 * Get personal records
 * @param userId - User ID
 * @returns Personal records
 */
export async function getPersonalRecords(userId: string): Promise<{
  maxRepsInSession: number;
  maxRepsInSet: number;
  longestSession: number;
  totalLifetimeReps: number;
}> {
  return client.get(`/users/${userId}/workouts/records`);
}

/**
 * Like a workout session
 * @param workoutId - Workout session ID
 * @returns Updated workout session
 */
export async function likeWorkout(workoutId: string): Promise<WorkoutSession> {
  return client.post(`/workouts/${workoutId}/like`, {});
}

/**
 * Unlike a workout session
 * @param workoutId - Workout session ID
 * @returns Updated workout session
 */
export async function unlikeWorkout(
  workoutId: string,
): Promise<WorkoutSession> {
  return client.delete(`/workouts/${workoutId}/like`);
}

export const workoutService = {
  saveWorkoutSession,
  getWorkoutSessions,
  getWorkoutStats,
  deleteWorkoutSession,
  getWorkoutSession,
  updateWorkoutSession,
  getWorkoutSummary,
  getPersonalRecords,
  likeWorkout,
  unlikeWorkout,
};
