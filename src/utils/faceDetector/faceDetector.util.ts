import {Face} from 'react-native-vision-camera-face-detector';
import {MovementState} from '../../types/workout.types';
import {FACE_DETECTION} from '../../constants/workout.constants';

const {MIN_FACE_WIDTH, MAX_FACE_WIDTH, CLOSE_THRESHOLD, FAR_THRESHOLD} =
  FACE_DETECTION;

/**
 * Normalise la distance du visage sur une échelle de 0 à 100
 * 0 = visage le plus loin possible
 * 100 = visage le plus proche possible
 * @param faceWidth Largeur du visage détecté en pixels
 * @returns Distance normalisée entre 0 et 100
 */
export function normalizeDistance(faceWidth: number): number {
  // Plus le visage est large, plus il est proche
  // On inverse la logique: grande largeur = grande distance normalisée
  const normalized =
    ((faceWidth - MIN_FACE_WIDTH) / (MAX_FACE_WIDTH - MIN_FACE_WIDTH)) * 100;

  // Limiter entre 0 et 100
  return Math.max(0, Math.min(100, Math.round(normalized)));
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

    // Distance normalisée de 0 (loin) à 100 (proche)
    const distance = normalizeDistance(width);
    setEstimatedDistance(distance);

    switch (movementState) {
      case 'idle':
        if (distance > CLOSE_THRESHOLD) {
          setMovementState('down_detected');
        }
        break;

      case 'down_detected':
        if (distance < FAR_THRESHOLD) {
          setPushUpCount(prev => prev + 1);
          setMovementState('up_detected');
        }
        break;

      case 'up_detected':
        if (distance > CLOSE_THRESHOLD) {
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
) {
  return (faces: Face[]) => {
    if (!getIsActive()) return;

    if (faces.length === 0) {
      setEstimatedDistance(null);
      return;
    }

    const face = faces[0];
    const width = face.bounds.width;

    // Distance normalisée de 0 (loin) à 100 (proche)
    const distance = normalizeDistance(width);
    setEstimatedDistance(distance);

    const movementState = getMovementState();

    switch (movementState) {
      case 'idle':
        if (distance > CLOSE_THRESHOLD) {
          setMovementState('down_detected');
        }
        break;
      case 'down_detected':
        if (distance < FAR_THRESHOLD) {
          setPushUpCount(prev => prev + 1);
          setMovementState('up_detected');
        }
        break;
      case 'up_detected':
        if (distance > CLOSE_THRESHOLD) {
          setMovementState('down_detected');
        }
        break;
    }
  };
}
