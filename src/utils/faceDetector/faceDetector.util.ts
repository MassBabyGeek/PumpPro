import {Face} from 'react-native-vision-camera-face-detector';
import {MovementState} from '../../types/workout.types';
import {FACE_DETECTION} from '../../constants/workout.constants';

const {MIN_FACE_WIDTH, MAX_FACE_WIDTH, CLOSE_THRESHOLD, FAR_THRESHOLD} =
  FACE_DETECTION;

/**
 * Normalise la distance du visage sur une échelle de 0 à 100
 * 0 = visage le plus proche possible (position basse)
 * 100 = visage le plus loin possible (position haute)
 * @param faceWidth Largeur du visage détecté en pixels
 * @returns Distance normalisée entre 0 et 100
 */
export function normalizeDistance(faceWidth: number): number {
  // Inverser la logique : plus le visage est grand (proche), plus on retourne un nombre PETIT
  const percentage =
    ((faceWidth - MIN_FACE_WIDTH) / (MAX_FACE_WIDTH - MIN_FACE_WIDTH)) * 100;
  const normalized = Math.round(Math.max(0, Math.min(100, percentage)));
  // Inverser : 100 - normalized pour que loin = 100, proche = 0
  return 100 - normalized;
}

export function onFacesDetected(
  faces: Face[],
  setEstimatedDistance: (distance: number | null) => void,
  setPushUpCount: React.Dispatch<React.SetStateAction<number>>,
  setMovementState: (state: MovementState) => void,
  movementState: MovementState,
) {
  if (faces.length > 0) {
    const face = faces[0];
    const width = face.bounds.width;

    // Distance normalisée de 0 (proche - position basse) à 100 (loin - position haute)
    const distance = normalizeDistance(width);
    setEstimatedDistance(distance);

    switch (movementState) {
      case 'idle':
        if (distance < CLOSE_THRESHOLD) {
          setMovementState('down_detected');
        }
        break;

      case 'down_detected':
        if (distance > FAR_THRESHOLD) {
          setPushUpCount(prev => prev + 1);
          setMovementState('up_detected');
        }
        break;

      case 'up_detected':
        if (distance < CLOSE_THRESHOLD) {
          setMovementState('down_detected');
        }
        break;
    }
  } else {
    setEstimatedDistance(null);
  }
}
export function createOnFacesDetected(
  setEstimatedDistance: (v: number | null) => void,
  setPushUpCount: (v: (prev: number) => number) => void,
  setMovementState: (v: MovementState) => void,
  getMovementState: () => MovementState,
  getIsActive: () => boolean,
  customThresholds?: {upper: number; lower: number} | null,
) {
  // Utiliser les seuils personnalisés de calibration si disponibles, sinon les valeurs par défaut
  const UPPER_THRESHOLD = customThresholds?.upper ?? FAR_THRESHOLD;   // Position haute (bras tendus)
  const LOWER_THRESHOLD = customThresholds?.lower ?? CLOSE_THRESHOLD; // Position basse (près du sol)

  return (faces: Face[]) => {
    if (!getIsActive()) return;

    if (faces.length === 0) {
      setEstimatedDistance(null);
      return;
    }

    const face = faces[0];
    const width = face.bounds.width;

    // Distance normalisée de 0 (proche - position basse) à 100 (loin - position haute)
    const distance = normalizeDistance(width);
    setEstimatedDistance(distance);

    const movementState = getMovementState();

    switch (movementState) {
      case 'idle':
        if (distance < LOWER_THRESHOLD) {
          setMovementState('down_detected');
        }
        break;
      case 'down_detected':
        if (distance > UPPER_THRESHOLD) {
          setPushUpCount(prev => prev + 1);
          setMovementState('up_detected');
        }
        break;
      case 'up_detected':
        if (distance < LOWER_THRESHOLD) {
          setMovementState('down_detected');
        }
        break;
    }
  };
}
