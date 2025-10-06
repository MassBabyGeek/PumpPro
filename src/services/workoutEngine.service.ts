/**
 * Workout Engine Service
 *
 * This service interprets workout programs received from the backend
 * and manages the state of an active workout session.
 */

import {
  WorkoutProgram,
  WorkoutState,
  SetResult,
  WorkoutSession,
  SetsRepsConfig,
  PyramidConfig,
  TargetRepsConfig,
  MaxTimeConfig,
  EMOMConfig,
  AMRAPConfig,
} from '../types/workout.types';

export class WorkoutEngine {
  private state: WorkoutState;
  private listeners: Set<(state: WorkoutState) => void> = new Set();
  private timerInterval?: NodeJS.Timeout;
  private restTimerInterval?: NodeJS.Timeout;
  private sessionStartTime: Date;
  private sets: SetResult[] = [];

  constructor(program: WorkoutProgram) {
    this.sessionStartTime = new Date();
    this.state = this.initializeState(program);
  }

  /**
   * Initialize workout state based on program type
   */
  private initializeState(program: WorkoutProgram): WorkoutState {
    const totalSets = this.calculateTotalSets(program);
    const targetReps = this.getTargetRepsForSet(program, 1);

    return {
      program,
      currentSet: 1,
      totalSets,
      currentReps: 0,
      targetRepsForCurrentSet: targetReps,
      totalReps: 0,
      elapsedTime: 0,
      isResting: false,
      restTimeRemaining: undefined,
      isCompleted: false,
      isPaused: false,
    };
  }

  /**
   * Calculate total number of sets for the program
   */
  private calculateTotalSets(program: WorkoutProgram): number {
    switch (program.type) {
      case 'FREE_MODE':
      case 'TARGET_REPS':
      case 'MAX_TIME':
      case 'AMRAP':
        return 1;
      case 'SETS_REPS':
        return program.sets;
      case 'PYRAMID':
        return program.repsSequence.length;
      case 'EMOM':
        return program.totalMinutes;
      default:
        return 1;
    }
  }

  /**
   * Get target reps for a specific set number
   */
  private getTargetRepsForSet(
    program: WorkoutProgram,
    setNumber: number,
  ): number | undefined {
    switch (program.type) {
      case 'FREE_MODE':
      case 'MAX_TIME':
      case 'AMRAP':
        return undefined;
      case 'TARGET_REPS':
        return program.targetReps;
      case 'SETS_REPS':
        return program.repsPerSet;
      case 'PYRAMID':
        return program.repsSequence[setNumber - 1];
      case 'EMOM':
        return program.repsPerMinute;
      default:
        return undefined;
    }
  }

  /**
   * Start the workout timer
   */
  start(): void {
    if (this.state.isPaused) {
      this.resume();
      return;
    }

    this.timerInterval = setInterval(() => {
      if (!this.state.isPaused && !this.state.isResting) {
        this.state.elapsedTime += 1;
        this.checkTimeBasedCompletion();
        this.notifyListeners();
      }
    }, 1000);
  }

  /**
   * Pause the workout
   */
  pause(): void {
    this.state.isPaused = true;
    this.notifyListeners();
  }

  /**
   * Resume the workout
   */
  resume(): void {
    this.state.isPaused = false;
    this.notifyListeners();
  }

  /**
   * Stop the workout completely
   */
  stop(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.restTimerInterval) {
      clearInterval(this.restTimerInterval);
    }
  }

  /**
   * Increment rep count (called when push-up is detected)
   */
  incrementRep(): void {
    if (this.state.isCompleted || this.state.isPaused || this.state.isResting) {
      return;
    }

    this.state.currentReps += 1;
    this.state.totalReps += 1;

    this.checkRepBasedCompletion();
    this.notifyListeners();
  }

  /**
   * Complete current set and move to next (or rest period)
   */
  completeCurrentSet(): void {
    if (this.state.isCompleted) {
      return;
    }

    // Record the set result
    const setResult: SetResult = {
      setNumber: this.state.currentSet,
      targetReps: this.state.targetRepsForCurrentSet,
      completedReps: this.state.currentReps,
      duration: this.state.elapsedTime,
      timestamp: new Date(),
    };
    this.sets.push(setResult);

    // Check if we have more sets
    if (this.state.currentSet < this.state.totalSets) {
      this.startRestPeriod();
    } else {
      this.completeWorkout();
    }
  }

  /**
   * Start rest period between sets
   */
  private startRestPeriod(): void {
    const restDuration = this.state.program.restBetweenSets;
    if (!restDuration) {
      // No rest configured, move directly to next set
      this.moveToNextSet();
      return;
    }

    this.state.isResting = true;
    this.state.restTimeRemaining = restDuration;
    this.notifyListeners();

    this.restTimerInterval = setInterval(() => {
      if (this.state.restTimeRemaining! > 0) {
        this.state.restTimeRemaining! -= 1;
        this.notifyListeners();
      } else {
        if (this.restTimerInterval) {
          clearInterval(this.restTimerInterval);
        }
        this.moveToNextSet();
      }
    }, 1000);
  }

  /**
   * Move to the next set
   */
  private moveToNextSet(): void {
    this.state.currentSet += 1;
    this.state.currentReps = 0;
    this.state.isResting = false;
    this.state.restTimeRemaining = undefined;
    this.state.targetRepsForCurrentSet = this.getTargetRepsForSet(
      this.state.program,
      this.state.currentSet,
    );
    this.notifyListeners();
  }

  /**
   * Check if workout is completed based on reps
   */
  private checkRepBasedCompletion(): void {
    const { program, currentReps } = this.state;

    switch (program.type) {
      case 'TARGET_REPS':
        if (currentReps >= program.targetReps) {
          this.completeWorkout();
        }
        break;
      case 'SETS_REPS':
        if (currentReps >= program.repsPerSet) {
          this.completeCurrentSet();
        }
        break;
      case 'PYRAMID':
        const targetForSet = program.repsSequence[this.state.currentSet - 1];
        if (currentReps >= targetForSet) {
          this.completeCurrentSet();
        }
        break;
      case 'EMOM':
        if (currentReps >= program.repsPerMinute) {
          // Wait for minute to complete
        }
        break;
    }
  }

  /**
   * Check if workout is completed based on time
   */
  private checkTimeBasedCompletion(): void {
    const { program, elapsedTime } = this.state;

    switch (program.type) {
      case 'MAX_TIME':
        if (elapsedTime >= program.duration) {
          this.completeWorkout();
        }
        break;
      case 'AMRAP':
        if (elapsedTime >= program.duration) {
          this.completeWorkout();
        }
        break;
      case 'TARGET_REPS':
        if (program.timeLimit && elapsedTime >= program.timeLimit) {
          this.completeWorkout();
        }
        break;
      case 'EMOM':
        const totalDuration = program.totalMinutes * 60;
        if (elapsedTime >= totalDuration) {
          this.completeWorkout();
        } else if (elapsedTime % 60 === 0 && this.state.currentReps > 0) {
          // New minute started
          this.completeCurrentSet();
        }
        break;
    }
  }

  /**
   * Complete the entire workout
   */
  private completeWorkout(): void {
    this.state.isCompleted = true;
    this.stop();
    this.notifyListeners();
  }

  /**
   * Get current workout state
   */
  getState(): WorkoutState {
    return { ...this.state };
  }

  /**
   * Get workout session data (for saving to backend)
   */
  getSession(): WorkoutSession {
    return {
      sessionId: `session-${Date.now()}`,
      program: this.state.program,
      startTime: this.sessionStartTime,
      endTime: this.state.isCompleted ? new Date() : undefined,
      sets: this.sets,
      totalReps: this.state.totalReps,
      totalDuration: this.state.elapsedTime,
      completed: this.state.isCompleted,
    };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: WorkoutState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  /**
   * Check if current set target is met
   */
  isCurrentSetComplete(): boolean {
    if (!this.state.targetRepsForCurrentSet) {
      return false;
    }
    return this.state.currentReps >= this.state.targetRepsForCurrentSet;
  }

  /**
   * Get progress percentage for current set
   */
  getCurrentSetProgress(): number {
    if (!this.state.targetRepsForCurrentSet) {
      return 0;
    }
    return (this.state.currentReps / this.state.targetRepsForCurrentSet) * 100;
  }

  /**
   * Get overall workout progress percentage
   */
  getOverallProgress(): number {
    const { program, totalReps, elapsedTime, currentSet, totalSets } =
      this.state;

    switch (program.type) {
      case 'TARGET_REPS':
        return (totalReps / program.targetReps) * 100;
      case 'MAX_TIME':
      case 'AMRAP':
        return (elapsedTime / program.duration) * 100;
      case 'SETS_REPS':
      case 'PYRAMID':
      case 'EMOM':
        return (currentSet / totalSets) * 100;
      case 'FREE_MODE':
      default:
        return 0;
    }
  }
}

/**
 * Validate a workout program
 */
export function validateWorkoutProgram(
  program: WorkoutProgram,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!program.id || !program.name) {
    errors.push('Programme invalide: ID et nom requis');
  }

  switch (program.type) {
    case 'TARGET_REPS':
      if (program.targetReps <= 0) {
        errors.push('Nombre de répétitions cible invalide');
      }
      break;
    case 'MAX_TIME':
    case 'AMRAP':
      if (program.duration <= 0) {
        errors.push('Durée invalide');
      }
      break;
    case 'SETS_REPS':
      if (program.sets <= 0 || program.repsPerSet <= 0) {
        errors.push('Nombre de séries ou répétitions invalide');
      }
      if (program.restBetweenSets <= 0) {
        errors.push('Temps de repos invalide');
      }
      break;
    case 'PYRAMID':
      if (!program.repsSequence || program.repsSequence.length === 0) {
        errors.push('Séquence de pyramide invalide');
      }
      if (program.restBetweenSets <= 0) {
        errors.push('Temps de repos invalide');
      }
      break;
    case 'EMOM':
      if (program.repsPerMinute <= 0 || program.totalMinutes <= 0) {
        errors.push('Configuration EMOM invalide');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
