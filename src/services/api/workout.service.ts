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
 * @param token - Authentication token
 * @returns Saved workout session with ID
 */
export async function saveWorkoutSession(
  session: Omit<WorkoutSession, 'sessionId'>,
  token?: string,
): Promise<WorkoutSession> {
  console.log('[WorkoutService] saveWorkoutSession:', session);
  return client.post('/workouts', session, token);
}

/**
 * Get workout sessions for a user
 * @param userId - User ID
 * @param filters - Optional filters (date range, program type, pagination)
 * @param token - Authentication token
 * @returns List of workout sessions
 */
export async function getWorkoutSessions(
  userId: string,
  filters?: WorkoutFilters,
  token?: string,
): Promise<WorkoutSession[]> {
  console.log('[WorkoutService] getWorkoutSessions:', userId, filters);
  return client.get(`/users/${userId}/workouts`, filters as any, token);
}

/**
 * Get workout statistics for a user
 * @param userId - User ID
 * @param period - Time period (today, week, month, year)
 * @param token - Authentication token
 * @returns Workout statistics
 */
export async function getWorkoutStats(
  userId: string,
  period: 'today' | 'week' | 'month' | 'year',
  token?: string,
): Promise<DayStats> {
  console.log('[WorkoutService] getWorkoutStats:', userId, period);
  return client.get(`/users/${userId}/workouts/stats`, {period}, token);
}

/**
 * Delete a workout session
 * @param sessionId - Session ID
 * @param token - Authentication token
 * @returns Success status
 */
export async function deleteWorkoutSession(
  sessionId: string,
  token?: string,
): Promise<{success: boolean}> {
  console.log('[WorkoutService] deleteWorkoutSession:', sessionId);
  return client.delete(`/workouts/${sessionId}`, token);
}

/**
 * Get a single workout session by ID
 * @param sessionId - Session ID
 * @param token - Authentication token
 * @returns Workout session
 */
export async function getWorkoutSession(
  sessionId: string,
  token?: string,
): Promise<WorkoutSession | null> {
  console.log('[WorkoutService] getWorkoutSession:', sessionId);
  return client.get(`/workouts/${sessionId}`, undefined, token);
}

/**
 * Update a workout session
 * @param sessionId - Session ID
 * @param data - Partial session data to update
 * @param token - Authentication token
 * @returns Updated workout session
 */
export async function updateWorkoutSession(
  sessionId: string,
  data: Partial<WorkoutSession>,
  token?: string,
): Promise<WorkoutSession> {
  console.log('[WorkoutService] updateWorkoutSession:', sessionId, data);
  return client.patch(`/workouts/${sessionId}`, data, token);
}

/**
 * Get workout summary for a date range
 * @param userId - User ID
 * @param startDate - Start date (ISO string)
 * @param endDate - End date (ISO string)
 * @param token - Authentication token
 * @returns Workout summary
 */
export async function getWorkoutSummary(
  userId: string,
  startDate: string,
  endDate: string,
  token?: string,
): Promise<WorkoutStatsResponse> {
  console.log(
    '[WorkoutService] getWorkoutSummary:',
    userId,
    startDate,
    endDate,
  );
  return client.get(
    `/users/${userId}/workouts/summary`,
    {startDate, endDate},
    token,
  );
}

/**
 * Get personal records
 * @param userId - User ID
 * @param token - Authentication token
 * @returns Personal records
 */
export async function getPersonalRecords(
  userId: string,
  token?: string,
): Promise<{
  maxRepsInSession: number;
  maxRepsInSet: number;
  longestSession: number;
  totalLifetimeReps: number;
}> {
  console.log('[WorkoutService] getPersonalRecords:', userId);
  return client.get(`/users/${userId}/workouts/records`, undefined, token);
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
};
