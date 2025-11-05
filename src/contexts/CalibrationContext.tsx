import React, {createContext, useContext, ReactNode} from 'react';
import {
  useCalibration,
  CalibrationData,
  PushUpQualityMetrics,
} from '../hooks/useCalibration';

interface CalibrationContextType {
  calibration: CalibrationData;
  qualityMetrics: PushUpQualityMetrics;
  loading: boolean;
  saveCalibration: (
    upperDistance: number,
    lowerDistance: number,
    autoAdjust?: boolean,
  ) => Promise<CalibrationData>;
  resetCalibration: () => Promise<void>;
  updateQualityMetrics: (
    pushUpAmplitudes: number[],
  ) => Promise<PushUpQualityMetrics | undefined>;
  resetQualityMetrics: () => Promise<void>;
  getGlobalPrecision: () => number;
}

const CalibrationContext = createContext<CalibrationContextType | undefined>(
  undefined,
);

export const CalibrationProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const calibrationHook = useCalibration();

  return (
    <CalibrationContext.Provider value={calibrationHook}>
      {children}
    </CalibrationContext.Provider>
  );
};

export const useCalibrationContext = (): CalibrationContextType => {
  const context = useContext(CalibrationContext);
  if (!context) {
    throw new Error(
      'useCalibrationContext must be used within CalibrationProvider',
    );
  }
  return context;
};
