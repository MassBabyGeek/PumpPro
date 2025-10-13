/**
 * Program Service
 * Handles all workout program-related API operations
 */

import { API_BASE_URL } from './api.config';
import ApiClient from './apiClient';
import {
  WorkoutProgram,
  DifficultyLevel,
  WorkoutProgramType,
  PushUpVariant,
} from '../../types/workout.types';

const client = new ApiClient(API_BASE_URL);

interface ProgramFilters {
  difficulty?: DifficultyLevel;
  type?: WorkoutProgramType;
  variant?: PushUpVariant;
  isCustom?: boolean;
  searchQuery?: string;
}

/**
 * Get all programs with optional filters
 * @param filters - Program filters (difficulty, type, variant, etc.)
 * @param token - Authentication token
 * @returns List of workout programs
 */
export async function getPrograms(
  filters?: ProgramFilters,
  token?: string
): Promise<WorkoutProgram[]> {
  console.log('[ProgramService] getPrograms:', filters);
  return client.get('/programs', filters as any, token);
}

/**
 * Get program by ID
 * @param programId - Program ID
 * @param token - Authentication token
 * @returns Workout program
 */
export async function getProgramById(
  programId: string,
  token?: string
): Promise<WorkoutProgram | null> {
  console.log('[ProgramService] getProgramById:', programId);
  return client.get(`/programs/${programId}`, undefined, token);
}

/**
 * Create a custom program
 * @param program - Program data
 * @param token - Authentication token
 * @returns Created program
 */
export async function createProgram(
  program: Omit<WorkoutProgram, 'id'>,
  token?: string
): Promise<WorkoutProgram> {
  console.log('[ProgramService] createProgram:', program);
  return client.post('/programs', program, token);
}

/**
 * Update a program
 * @param programId - Program ID
 * @param data - Partial program data to update
 * @param token - Authentication token
 * @returns Updated program
 */
export async function updateProgram(
  programId: string,
  data: Partial<WorkoutProgram>,
  token?: string
): Promise<WorkoutProgram> {
  console.log('[ProgramService] updateProgram:', programId, data);
  return client.patch(`/programs/${programId}`, data, token);
}

/**
 * Delete a program
 * @param programId - Program ID
 * @param token - Authentication token
 * @returns Success status
 */
export async function deleteProgram(
  programId: string,
  token?: string
): Promise<{ success: boolean }> {
  console.log('[ProgramService] deleteProgram:', programId);
  return client.delete(`/programs/${programId}`, token);
}

/**
 * Get recommended programs for a user based on their level and goals
 * @param userId - User ID
 * @param token - Authentication token
 * @returns List of recommended programs
 */
export async function getRecommendedPrograms(
  userId: string,
  token?: string
): Promise<WorkoutProgram[]> {
  console.log('[ProgramService] getRecommendedPrograms:', userId);
  return client.get(`/users/${userId}/programs/recommended`, undefined, token);
}

/**
 * Get programs by difficulty level
 * @param difficulty - Difficulty level
 * @param token - Authentication token
 * @returns List of programs
 */
export async function getProgramsByDifficulty(
  difficulty: DifficultyLevel,
  token?: string
): Promise<WorkoutProgram[]> {
  console.log('[ProgramService] getProgramsByDifficulty:', difficulty);
  return client.get('/programs', { difficulty }, token);
}

/**
 * Get user's custom programs
 * @param userId - User ID
 * @param token - Authentication token
 * @returns List of custom programs
 */
export async function getUserCustomPrograms(
  userId: string,
  token?: string
): Promise<WorkoutProgram[]> {
  console.log('[ProgramService] getUserCustomPrograms:', userId);
  return client.get(`/users/${userId}/programs`, undefined, token);
}

/**
 * Duplicate a program (copy an existing program to create a custom one)
 * @param programId - Program ID to duplicate
 * @param userId - User ID
 * @param token - Authentication token
 * @returns Duplicated program
 */
export async function duplicateProgram(
  programId: string,
  userId: string,
  token?: string
): Promise<WorkoutProgram> {
  console.log('[ProgramService] duplicateProgram:', programId);
  return client.post(`/programs/${programId}/duplicate`, { userId }, token);
}

/**
 * Get featured programs (curated by the platform)
 * @param token - Authentication token
 * @returns List of featured programs
 */
export async function getFeaturedPrograms(token?: string): Promise<WorkoutProgram[]> {
  console.log('[ProgramService] getFeaturedPrograms');
  return client.get('/programs/featured', undefined, token);
}

/**
 * Get popular programs (most used by community)
 * @param limit - Number of programs to return
 * @param token - Authentication token
 * @returns List of popular programs
 */
export async function getPopularPrograms(
  limit: number = 10,
  token?: string
): Promise<WorkoutProgram[]> {
  console.log('[ProgramService] getPopularPrograms:', limit);
  return client.get('/programs/popular', { limit }, token);
}

export const programService = {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  getRecommendedPrograms,
  getProgramsByDifficulty,
  getUserCustomPrograms,
  duplicateProgram,
  getFeaturedPrograms,
  getPopularPrograms,
};
