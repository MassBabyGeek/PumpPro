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
 * @returns List of workout programs
 */
export async function getPrograms(
  filters?: ProgramFilters,
): Promise<WorkoutProgram[]> {
  return client.get('/programs', filters as any);
}

/**
 * Get program by ID
 * @param programId - Program ID
 * @returns Workout program
 */
export async function getProgramById(
  programId: string,
): Promise<WorkoutProgram | null> {
  return client.get(`/programs/${programId}`);
}

/**
 * Create a custom program
 * @param program - Program data
 * @returns Created program
 */
export async function createProgram(
  program: Omit<WorkoutProgram, 'id'>,
): Promise<WorkoutProgram> {
  return client.post('/programs', program);
}

/**
 * Update a program
 * @param programId - Program ID
 * @param data - Partial program data to update
 * @returns Updated program
 */
export async function updateProgram(
  programId: string,
  data: Partial<WorkoutProgram>,
): Promise<WorkoutProgram> {
  return client.patch(`/programs/${programId}`, data);
}

/**
 * Delete a program
 * @param programId - Program ID
 * @returns Success status
 */
export async function deleteProgram(
  programId: string,
): Promise<{success: boolean}> {
  return client.delete(`/programs/${programId}`);
}

/**
 * Get recommended programs for a user based on their level and goals
 * @param userId - User ID
 * @returns List of recommended programs
 */
export async function getRecommendedPrograms(
  userId: string,
): Promise<WorkoutProgram[]> {
  return client.get(`/users/${userId}/programs/recommended`);
}

/**
 * Get programs by difficulty level
 * @param difficulty - Difficulty level
 * @returns List of programs
 */
export async function getProgramsByDifficulty(
  difficulty: DifficultyLevel,
): Promise<WorkoutProgram[]> {
  return client.get('/programs', {difficulty});
}

/**
 * Get user's custom programs
 * @param userId - User ID
 * @returns List of custom programs
 */
export async function getUserCustomPrograms(
  userId: string,
): Promise<WorkoutProgram[]> {
  return client.get(`/users/${userId}/programs`);
}

/**
 * Duplicate a program (copy an existing program to create a custom one)
 * @param programId - Program ID to duplicate
 * @param userId - User ID
 * @returns Duplicated program
 */
export async function duplicateProgram(
  programId: string,
  userId: string,
): Promise<WorkoutProgram> {
  return client.post(`/programs/${programId}/duplicate`, {userId});
}

/**
 * Get featured programs (curated by the platform)
 * @returns List of featured programs
 */
export async function getFeaturedPrograms(): Promise<WorkoutProgram[]> {
  return client.get('/programs/featured');
}

/**
 * Get popular programs (most used by community)
 * @param limit - Number of programs to return
 * @returns List of popular programs
 */
export async function getPopularPrograms(
  limit: number = 10,
): Promise<WorkoutProgram[]> {
  return client.get('/programs/popular', {limit});
}

/**
 * Like a program
 * @param programId - Program ID
 * @returns Updated program
 */
export async function likeProgram(programId: string): Promise<WorkoutProgram> {
  return client.post(`/programs/${programId}/like`, {});
}

/**
 * Unlike a program
 * @param programId - Program ID
 * @returns Updated program
 */
export async function unlikeProgram(programId: string): Promise<WorkoutProgram> {
  return client.delete(`/programs/${programId}/like`);
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
  likeProgram,
  unlikeProgram,
};
