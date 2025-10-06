import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  FaceDetectionOptions,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';
import {Worklets} from 'react-native-worklets-core';
import {createOnFacesDetected} from '../../utils/faceDetector/faceDetector.util';

type MovementState = 'idle' | 'down_detected' | 'up_detected';

type PushUpCameraProps = {
  setPushUpCount: Dispatch<SetStateAction<number>>;
  isActive: boolean;
  setDistance?: Dispatch<SetStateAction<number | null>>;
};

const PushUpCamera = ({
  setPushUpCount,
  isActive,
  setDistance,
}: PushUpCameraProps) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(
    null,
  );
  const [movementState, setMovementState] = useState<MovementState>('idle');

  // Mettre à jour la distance dans le parent si fourni
  useEffect(() => {
    if (setDistance) {
      setDistance(estimatedDistance);
    }
  }, [estimatedDistance, setDistance]);

  const device = useCameraDevice('front');

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    autoMode: true,
    performanceMode: 'fast',
  }).current;

  const {detectFaces} = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    (async () => {
      const permission =
        Platform.OS === 'android'
          ? await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
            )
          : await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted' || permission === 'denied');
    })();
  }, []);

  const handleDetectedFaces = Worklets.createRunOnJS(
    createOnFacesDetected(
      setEstimatedDistance,
      setPushUpCount,
      setMovementState,
      () => movementState, // important : fonction, pas la valeur directe
      () => isActive, // ✅ ici
    ),
  );

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const faces = detectFaces(frame);
      handleDetectedFaces(faces);
    },
    [detectFaces, handleDetectedFaces],
  );

  if (!device || !hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>Caméra non disponible ou permission refusée.</Text>
      </View>
    );
  }

  return (
    <Camera
      style={styles.hiddenCamera}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hiddenCamera: {
    width: 0,
    height: 0,
    opacity: 0,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#00000088',
    padding: 10,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PushUpCamera;
