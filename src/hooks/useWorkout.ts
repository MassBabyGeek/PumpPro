import {useState, useEffect, useRef} from 'react';
import {WorkoutEngine} from '../services/workoutEngine.service';
import {
  WorkoutProgram,
  WorkoutState,
  WorkoutSession,
} from '../types/workout.types';

export const useWorkout = (program: WorkoutProgram | null) => {
  const engineRef = useRef<WorkoutEngine | null>(null);
  const [workoutState, setWorkoutState] = useState<WorkoutState | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [session, setSession] = useState<WorkoutSession | null>(null);

  // Instanciation du moteur
  useEffect(() => {
    if (!program) {
      return;
    }

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
      setCameraActive(false);
    };
  }, [program]);

  // Gestion automatique de la caméra
  useEffect(() => {
    if (!workoutState) return;

    if (workoutState.isCompleted) {
      setCameraActive(false);
    } else if (workoutState.isPaused || workoutState.isResting) {
      setCameraActive(false);
    } else {
      setCameraActive(true);
    }
  }, [workoutState]);

  // Gestion des répétitions
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

  // Stop workout et sauvegarde session
  const stopWorkout = (): WorkoutSession | null => {
    if (engineRef.current) {
      const currentSession = engineRef.current.getSession();
      engineRef.current.stop();
      setCameraActive(false);
      setSession(currentSession);
      return currentSession;
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

  const getSession = () => session || engineRef.current?.getSession() || null;

  return {
    workoutState,
    distance,
    setDistance,
    cameraActive,
    incrementRep,
    togglePause,
    stopWorkout,
    completeCurrentSet,
    getCurrentSetProgress,
    isCurrentSetComplete,
    getSession,
  };
};
