/**
 * API Services Index
 * Central export point for all API services
 */

// Configuration
export * from './api.config';

// Services
export { userService } from './user.service';
export { challengeService } from './challenge.service';
export { workoutService } from './workout.service';
export { programService } from './program.service';
export { leaderboardService } from './leaderboard.service';

// Types from services
export type { LeaderboardEntry, UserRank, LeaderboardPeriod, LeaderboardMetric } from './leaderboard.service';

// Re-export commonly used functions for convenience
export {
  // User
  login,
  register,
  getProfile,
  updateProfile,
  uploadAvatar,
  logout,
} from './user.service';

export {
  // Challenge
  getChallenges,
  getChallengeById,
  likeChallenge,
  unlikeChallenge,
  startChallenge,
  completeChallenge,
} from './challenge.service';

export {
  // Workout
  saveWorkoutSession,
  getWorkoutSessions,
  getWorkoutStats,
  deleteWorkoutSession,
} from './workout.service';

export {
  // Program
  getPrograms,
  getProgramById,
  createProgram,
  getRecommendedPrograms,
} from './program.service';

export {
  // Leaderboard
  getLeaderboard,
  getUserRank,
  getTopPerformers,
} from './leaderboard.service';

/**
 * API Service Summary:
 *
 * 1. User Service (user.service.ts)
 *    - Authentication (login, register, logout)
 *    - Profile management (get, update, delete)
 *    - Avatar upload
 *    - Statistics and charts
 *    - Password reset
 *
 * 2. Challenge Service (challenge.service.ts)
 *    - Get challenges (with filters)
 *    - Challenge details
 *    - Like/Unlike challenges
 *    - Start/Complete challenges
 *    - Task completion
 *    - User progress tracking
 *
 * 3. Workout Service (workout.service.ts)
 *    - Save workout sessions
 *    - Get workout history
 *    - Workout statistics
 *    - Personal records
 *    - Delete/Update sessions
 *
 * 4. Program Service (program.service.ts)
 *    - Get workout programs
 *    - Create custom programs
 *    - Update/Delete programs
 *    - Recommended programs
 *    - Featured and popular programs
 *    - Program duplication
 *
 * 5. Leaderboard Service (leaderboard.service.ts)
 *    - Global leaderboard
 *    - User ranking
 *    - Nearby users
 *    - Top performers
 *    - Challenge-specific leaderboard
 *    - Friends leaderboard
 *
 * Usage:
 * ```typescript
 * import { userService, challengeService } from '@/services/api';
 *
 * // Use services
 * const user = await userService.login(email, password);
 * const challenges = await challengeService.getChallenges();
 * ```
 *
 * Mock Mode:
 * All services use mock data when USE_MOCK_DATA is true in api.config.ts
 * This allows the app to function without a backend during development.
 * Set USE_MOCK_DATA to false when the backend is ready.
 */
