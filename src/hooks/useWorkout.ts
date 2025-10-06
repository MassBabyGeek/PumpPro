import {useState, useEffect, useRef} from 'react';
import {WorkoutEngine} from '../services/workoutEngine.service';
import {WorkoutProgram, WorkoutState} from '../types/workout.types';

export const useWorkout = (program: WorkoutProgram) => {
  const engineRef = useRef<WorkoutEngine | null>(null);
  const [workoutState, setWorkoutState] = useState<WorkoutState | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    const engine = new WorkoutEngine(program);
    engineRef.current = engine;

    // S'abonner aux changements d'état
    const unsubscribe = engine.subscribe(state => {
      setWorkoutState(state);
    });

    // Démarrer automatiquement
    engine.start();

    // Cleanup
    return () => {
      unsubscribe();
      engine.stop();
    };
  }, [program]);

  const incrementRep = () => {
    if (engineRef.current) {
      engineRef.current.incrementRep();
    }
  };

  const togglePause = () => {
    if (!engineRef.current || !workoutState) return;

    if (workoutState.isPaused) {
      engineRef.current.resume();
    } else {
      engineRef.current.pause();
    }
  };

  const stop = () => {
    if (engineRef.current) {
      const session = engineRef.current.getSession();
      engineRef.current.stop();
      return session;
    }
    return null;
  };

  const completeCurrentSet = () => {
    if (engineRef.current) {
      engineRef.current.completeCurrentSet();
    }
  };

  const getCurrentSetProgress = () => {
    return engineRef.current?.getCurrentSetProgress() || 0;
  };

  const isCurrentSetComplete = () => {
    return engineRef.current?.isCurrentSetComplete() || false;
  };

  const getSession = () => {
    return engineRef.current?.getSession() || null;
  };

  return {
    workoutState,
    distance,
    setDistance,
    incrementRep,
    togglePause,
    stop,
    completeCurrentSet,
    getCurrentSetProgress,
    isCurrentSetComplete,
    getSession,
  };
};
