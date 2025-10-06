import {useState, useCallback} from 'react';
import {CALORIES_PER_PUSHUP} from '../constants/workout.constants';

export const useWorkoutStats = () => {
  const [pushUpCount, setPushUpCount] = useState(0);
  const [lastPushUpTime, setLastPushUpTime] = useState<number | null>(null);
  const [recordPushUp, setRecordPushUp] = useState(0);

  const incrementPushUp = useCallback(() => {
    setPushUpCount(prev => {
      const newCount = prev + 1;
      if (newCount > recordPushUp) {
        setRecordPushUp(newCount);
      }
      return newCount;
    });
    setLastPushUpTime(Date.now());
  }, [recordPushUp]);

  const resetStats = useCallback(() => {
    setPushUpCount(0);
    setLastPushUpTime(null);
  }, []);

  const calculateCalories = useCallback((count: number) => {
    return (count * CALORIES_PER_PUSHUP).toFixed(2);
  }, []);

  const calculateSpeed = useCallback(
    (startTime: number | null) => {
      if (!lastPushUpTime || !startTime) return '-';
      return ((Date.now() - lastPushUpTime) / 1000).toFixed(2) + 's';
    },
    [lastPushUpTime],
  );

  return {
    pushUpCount,
    setPushUpCount,
    lastPushUpTime,
    recordPushUp,
    incrementPushUp,
    resetStats,
    calculateCalories,
    calculateSpeed,
  };
};
