import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CalibrationData {
  isCalibrated: boolean;
  upperDistance: number; // Distance en position haute (cm)
  lowerDistance: number; // Distance en position basse (cm)
  upperThreshold: number; // Seuil calculé pour position haute
  lowerThreshold: number; // Seuil calculé pour position basse
  lastCalibrationDate: string;
  autoAdjust: boolean;
}

export interface PushUpQualityMetrics {
  totalPushUps: number;
  validPushUps: number;
  averageAmplitude: number;
  precision: number; // Pourcentage
  bestAmplitude: number;
  worstAmplitude: number;
}

const CALIBRATION_STORAGE_KEY = '@pompeurpro:calibration';
const QUALITY_METRICS_STORAGE_KEY = '@pompeurpro:quality_metrics';

const DEFAULT_CALIBRATION: CalibrationData = {
  isCalibrated: false,
  upperDistance: 0,
  lowerDistance: 0,
  upperThreshold: 4000, // Valeurs par défaut de faceDetector.util.ts
  lowerThreshold: 6000,
  lastCalibrationDate: '',
  autoAdjust: true,
};

const DEFAULT_METRICS: PushUpQualityMetrics = {
  totalPushUps: 0,
  validPushUps: 0,
  averageAmplitude: 0,
  precision: 0,
  bestAmplitude: 0,
  worstAmplitude: 0,
};

export const useCalibration = () => {
  const [calibration, setCalibration] =
    useState<CalibrationData>(DEFAULT_CALIBRATION);
  const [qualityMetrics, setQualityMetrics] =
    useState<PushUpQualityMetrics>(DEFAULT_METRICS);
  const [loading, setLoading] = useState(true);

  // Charger la calibration au démarrage
  useEffect(() => {
    loadCalibration();
    loadQualityMetrics();
  }, []);

  const loadCalibration = async () => {
    try {
      const stored = await AsyncStorage.getItem(CALIBRATION_STORAGE_KEY);
      if (stored) {
        setCalibration(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading calibration:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQualityMetrics = async () => {
    try {
      const stored = await AsyncStorage.getItem(QUALITY_METRICS_STORAGE_KEY);
      if (stored) {
        setQualityMetrics(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading quality metrics:', error);
    }
  };

  // Sauvegarder la calibration
  const saveCalibration = useCallback(
    async (
      upperDistance: number,
      lowerDistance: number,
      autoAdjust: boolean = true,
    ) => {
      try {
        // Calculer les seuils avec une marge de 10%
        const upperThreshold = upperDistance * 0.9;
        const lowerThreshold = lowerDistance * 1.1;

        const newCalibration: CalibrationData = {
          isCalibrated: true,
          upperDistance,
          lowerDistance,
          upperThreshold,
          lowerThreshold,
          lastCalibrationDate: new Date().toISOString(),
          autoAdjust,
        };

        await AsyncStorage.setItem(
          CALIBRATION_STORAGE_KEY,
          JSON.stringify(newCalibration),
        );
        setCalibration(newCalibration);

        return newCalibration;
      } catch (error) {
        console.error('Error saving calibration:', error);
        throw error;
      }
    },
    [],
  );

  // Réinitialiser la calibration
  const resetCalibration = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(CALIBRATION_STORAGE_KEY);
      setCalibration(DEFAULT_CALIBRATION);
    } catch (error) {
      console.error('Error resetting calibration:', error);
      throw error;
    }
  }, []);

  // Mettre à jour les métriques de qualité
  const updateQualityMetrics = useCallback(
    async (pushUpAmplitudes: number[]) => {
      try {
        const validAmplitudes = pushUpAmplitudes.filter(amp => amp > 0);
        const totalPushUps = pushUpAmplitudes.length;
        const validPushUps = validAmplitudes.length;

        if (validAmplitudes.length === 0) {
          return;
        }

        const averageAmplitude =
          validAmplitudes.reduce((sum, amp) => sum + amp, 0) /
          validAmplitudes.length;
        const precision = (validPushUps / totalPushUps) * 100;
        const bestAmplitude = Math.max(...validAmplitudes);
        const worstAmplitude = Math.min(...validAmplitudes);

        const newMetrics: PushUpQualityMetrics = {
          totalPushUps:
            qualityMetrics.totalPushUps + totalPushUps,
          validPushUps:
            qualityMetrics.validPushUps + validPushUps,
          averageAmplitude,
          precision,
          bestAmplitude,
          worstAmplitude,
        };

        await AsyncStorage.setItem(
          QUALITY_METRICS_STORAGE_KEY,
          JSON.stringify(newMetrics),
        );
        setQualityMetrics(newMetrics);

        return newMetrics;
      } catch (error) {
        console.error('Error updating quality metrics:', error);
        throw error;
      }
    },
    [qualityMetrics],
  );

  // Réinitialiser les métriques
  const resetQualityMetrics = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(QUALITY_METRICS_STORAGE_KEY);
      setQualityMetrics(DEFAULT_METRICS);
    } catch (error) {
      console.error('Error resetting quality metrics:', error);
      throw error;
    }
  }, []);

  // Calculer la précision globale
  const getGlobalPrecision = useCallback(() => {
    if (qualityMetrics.totalPushUps === 0) {
      return 0;
    }
    return (
      (qualityMetrics.validPushUps / qualityMetrics.totalPushUps) * 100
    );
  }, [qualityMetrics]);

  return {
    calibration,
    qualityMetrics,
    loading,
    saveCalibration,
    resetCalibration,
    updateQualityMetrics,
    resetQualityMetrics,
    getGlobalPrecision,
  };
};
