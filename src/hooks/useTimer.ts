import {useState, useEffect, useCallback} from 'react';

export const useTimer = () => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (startTime !== null) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime]);

  const start = useCallback(() => {
    setStartTime(Date.now() - elapsedTime * 1000);
    setIsActive(true);
  }, [elapsedTime]);

  const pause = useCallback(() => {
    setStartTime(null);
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setStartTime(null);
    setElapsedTime(0);
    setIsActive(false);
  }, []);

  const toggle = useCallback(() => {
    if (startTime) {
      pause();
    } else {
      start();
    }
  }, [startTime, pause, start]);

  return {
    elapsedTime,
    isActive,
    start,
    pause,
    reset,
    toggle,
  };
};
