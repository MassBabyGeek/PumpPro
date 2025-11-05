import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useRoute} from '@react-navigation/native';
import appColors from '../../assets/colors';
import PushUpCamera from '../../components/PushUpCamera/PushUpCamera';
import {useCalibrationContext} from '../../contexts/CalibrationContext';
import PushUpProgressBar from '../PushUpScreen/component/PushUpProgressBar';

type CalibrationStep = 'upper' | 'lower' | 'challenge';

const FirstChallengeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {saveCalibration} = useCalibrationContext();

  // Vérifier si on vient du ProfileScreen pour recalibration
  const isRecalibration = route.params?.isRecalibration === true;

  const [step, setStep] = useState<CalibrationStep>('upper');
  const [pushUpCount, setPushUpCount] = useState(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [upperValue, setUpperValue] = useState<number | null>(null);
  const [lowerValue, setLowerValue] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCaptureUpper = () => {
    if (distance !== null) {
      setUpperValue(distance);
      setStep('lower');
    }
  };

  const handleCaptureLower = () => {
    if (distance !== null && upperValue !== null) {
      setLowerValue(distance);
      saveCalibration(upperValue, distance, true);
      setStep('challenge');
      // Démarrer le chrono quand on commence le challenge
      setStartTime(Date.now());
    }
  };

  const incrementRep = () => {
    setPushUpCount(prev => prev + 1);
  };

  // Attendre 2 secondes après 3 pompes avant d'afficher le succès
  useEffect(() => {
    if (pushUpCount >= 3 && !showSuccess) {
      setTimeout(() => {
        setShowSuccess(true);
      }, 2000);
    }
  }, [pushUpCount, showSuccess]);

  const handleFinish = () => {
    if (isRecalibration) {
      // Retourner au ProfileScreen après recalibration
      navigation.goBack();
    } else {
      // Flow onboarding normal: aller à ChallengeResults
      const duration = startTime
        ? Math.floor((Date.now() - startTime) / 1000)
        : 0;
      navigation.navigate('ChallengeResults', {
        pushUpCount: 3,
        duration,
        goal: 3,
      });
    }
  };

  // Calibration upper
  if (step === 'upper') {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>⬆️</Text>
          <Text style={styles.title}>Position HAUTE</Text>
          <Text style={styles.instruction}>
            Mets-toi en position pompe, bras tendus
          </Text>

          {distance !== null && (
            <View style={styles.distanceBox}>
              <Text style={styles.distanceValue}>{Math.round(distance)}</Text>
              <Text style={styles.distanceLabel}>Distance détectée</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleCaptureUpper}
            disabled={distance === null}>
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </View>

        <PushUpCamera
          isActive={true}
          setPushUpCount={() => {}}
          setDistance={setDistance}
        />
      </LinearGradient>
    );
  }

  // Calibration lower
  if (step === 'lower') {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>⬇️</Text>
          <Text style={styles.title}>Position BASSE</Text>
          <Text style={styles.instruction}>
            Descends au maximum, touche le sol
          </Text>

          {distance !== null && (
            <View style={styles.distanceBox}>
              <Text style={styles.distanceValue}>{Math.round(distance)}</Text>
              <Text style={styles.distanceLabel}>Distance détectée</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleCaptureLower}
            disabled={distance === null}>
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </View>

        <PushUpCamera
          isActive={true}
          setPushUpCount={() => {}}
          setDistance={setDistance}
        />
      </LinearGradient>
    );
  }

  const handleRecalibrate = () => {
    setPushUpCount(0);
    setStep('upper');
    setUpperValue(null);
    setLowerValue(null);
  };

  // Challenge 3 pompes
  const isCompleted = pushUpCount >= 3;

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.container}>
      <View style={styles.content}>
        {!showSuccess ? (
          <>
            <Text style={styles.emoji}>🔥</Text>
            <Text style={styles.title}>Fais 3 pompes !</Text>

            {/* Compteur */}
            <View style={styles.counterContainer}>
              <Text style={styles.counter}>{pushUpCount}</Text>
              <Text style={styles.counterLabel}>/ 3</Text>
            </View>

            {/* Barre de progression */}
            <PushUpProgressBar
              value={distance ?? 0}
              label="Détection du visage"
              height={30}
              labels={[
                '✓ Position OK',
                'Ajustez votre position',
                '⚠ Visage non détecté',
              ]}
            />

            {/* Bouton recalibrer */}
            <TouchableOpacity
              style={styles.recalibrateButton}
              onPress={handleRecalibrate}>
              <Text style={styles.recalibrateText}>🔄 Recalibrer</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successTitle}>Bravo !</Text>
            <Text style={styles.successSubtitle}>
              Tu as réussi les 3 pompes !
            </Text>

            <View style={styles.counterContainer}>
              <Text style={styles.counter}>3</Text>
              <Text style={styles.counterLabel}>pompes</Text>
            </View>

            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
              <Text style={styles.finishButtonText}>
                Voir mes résultats 🚀
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Calibration info */}
        {!showSuccess && upperValue !== null && lowerValue !== null && (
          <View style={styles.calibInfo}>
            <Text style={styles.calibText}>
              Calibré: Haut={Math.round(upperValue)} / Bas=
              {Math.round(lowerValue)}
            </Text>
          </View>
        )}
      </View>

      {/* Caméra cachée - désactivée si complété */}
      <PushUpCamera
        isActive={!isCompleted}
        setPushUpCount={incrementRep}
        setDistance={setDistance}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    color: appColors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  distanceBox: {
    backgroundColor: appColors.border + '30',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginBottom: 40,
    alignItems: 'center',
  },
  distanceValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: appColors.primary,
  },
  distanceLabel: {
    fontSize: 14,
    color: appColors.textSecondary,
    marginTop: 8,
  },
  button: {
    backgroundColor: appColors.primary,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 40,
  },
  counter: {
    fontSize: 100,
    fontWeight: 'bold',
    color: appColors.primary,
  },
  counterLabel: {
    fontSize: 40,
    color: appColors.textSecondary,
    marginLeft: 8,
  },
  calibInfo: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: appColors.border + '20',
    borderRadius: 8,
  },
  calibText: {
    fontSize: 12,
    color: appColors.textSecondary,
  },
  recalibrateButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: appColors.border + '30',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.border + '50',
  },
  recalibrateText: {
    fontSize: 14,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  successEmoji: {
    fontSize: 100,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 18,
    color: appColors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  finishButton: {
    backgroundColor: appColors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default FirstChallengeScreen;
