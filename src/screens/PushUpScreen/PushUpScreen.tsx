import React, {useEffect} from 'react';
import {Text, View, StyleSheet, Alert, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../components/GradientButton/GradientButton';
import appColors from '../../assets/colors';
import PushUpCamera from '../../components/PushUpCamera/PushUpCamera';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  LibreScreenNavigationProp,
  LibreScreenRouteProp,
} from '../../types/navigation.types';
import {useProgram, useWorkout} from '../../hooks';
import Icon from 'react-native-vector-icons/Ionicons';
import PushUpProgressBar from './component/PushUpProgressBar';
import WorkoutHeader from './component/WorkoutHeader';
import WorkoutCounter from './component/WorkoutCounter';
import RestingView from './component/RestingView';
import WorkoutStatsGrid from './component/WorkoutStatsGrid';

const PushUpScreen = () => {
  const navigation = useNavigation<LibreScreenNavigationProp>();
  const route = useRoute<LibreScreenRouteProp>();

  // Support both direct program object and programId
  const programFromParams = route.params?.program;
  const {program: programFromId} = useProgram(route.params?.programId);
  const program = programFromParams || programFromId;

  const challengeId = route.params?.challengeId;
  const taskId = route.params?.taskId;

  const {
    workoutState,
    distance,
    setDistance,
    cameraActive,
    incrementRep,
    togglePause,
    stopWorkout,
    getCurrentSetProgress,
    isCurrentSetComplete,
    completeCurrentSet,
  } = useWorkout(program);

  useEffect(() => {
    console.log('program', program);
    console.log('workoutState', workoutState);
  }, [program, workoutState]);

  const handleStop = () => {
    const session = stopWorkout();
    if (!session) {
      console.error('[PushUpScreen] No session to save');
      return;
    }
    navigation.navigate('PushUpSummary', {session, challengeId, taskId});
  };

  const handleCancel = () => {
    Alert.alert(
      "Annuler l'entraînement",
      'Êtes-vous sûr de vouloir annuler cet entraînement ? Votre progression ne sera pas sauvegardée.',
      [
        {
          text: 'Continuer',
          style: 'cancel',
        },
        {
          text: 'Annuler',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (!workoutState || !program || workoutState === null) {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.gradientContainer}>
        <View style={styles.loadingContainer}>
          <Icon name="fitness" size={60} color={appColors.primary} />
          <Text style={styles.loadingText}>Préparation...</Text>
        </View>
      </LinearGradient>
    );
  }

  const isResting = workoutState.isResting;
  const progress = getCurrentSetProgress();
  const calories = Math.round(workoutState.totalReps * 0.5);
  const repsPerMin =
    workoutState.totalReps > 0
      ? Math.round(
          (workoutState.totalReps / (workoutState.elapsedTime / 60)) * 10,
        ) / 10
      : 0;

  // La barre est à 0 si la session est en pause ou en repos
  const shouldResetProgressBar = workoutState.isPaused || isResting;

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradientContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <WorkoutHeader
          program={program}
          currentSet={workoutState.currentSet}
          totalSets={workoutState.totalSets}
        />

        {/* Caméra cachée */}
        <PushUpCamera
          isActive={cameraActive}
          setPushUpCount={incrementRep}
          setDistance={setDistance}
        />

        {/* Zone principale */}
        {isResting ? (
          <RestingView
            restTimeRemaining={workoutState.restTimeRemaining || 0}
          />
        ) : (
          <WorkoutCounter
            currentReps={workoutState.currentReps}
            targetReps={workoutState.targetRepsForCurrentSet}
            progress={progress}
            elapsedTime={workoutState.elapsedTime}
            timeLimit={program.duration} // Durée limite pour MAX_TIME, AMRAP, etc.
          />
        )}

        {/* Indicateur de distance */}
        <PushUpProgressBar
          value={distance ?? 0}
          label="Détection du visage"
          height={30}
          labels={[
            '✓ Position OK',
            'Ajustez votre position',
            '⚠ Visage non détecté',
          ]}
          shouldReset={shouldResetProgressBar}
        />

        {/* Statistiques en grille */}
        <WorkoutStatsGrid
          totalReps={workoutState.totalReps}
          calories={calories}
          repsPerMin={repsPerMin}
        />

        {/* Boutons d'action */}
        <View style={styles.actionsContainer}>
          {!isResting && (
            <View style={styles.buttonsRow}>
              <GradientButton
                text={workoutState.isPaused ? 'Reprendre' : 'Pause'}
                icon={workoutState.isPaused ? 'play' : 'pause'}
                fontSize={15}
                outlined={true}
                paddingHorizontal={30}
                paddingVertical={16}
                onPress={togglePause}
                style={styles.actionButton}
              />

              {workoutState.totalSets > 1 && isCurrentSetComplete() && (
                <GradientButton
                  text="Série suivante"
                  icon="arrow-forward"
                  fontSize={15}
                  paddingHorizontal={30}
                  paddingVertical={16}
                  onPress={completeCurrentSet}
                  style={styles.actionButton}
                />
              )}
            </View>
          )}

          <View style={styles.finalButtonsRow}>
            <GradientButton
              text="Annuler"
              icon="close-circle"
              fontSize={15}
              outlined={true}
              paddingHorizontal={30}
              paddingVertical={16}
              onPress={handleCancel}
              style={styles.cancelButton}
            />
            <GradientButton
              text="Terminer"
              icon="checkmark-circle"
              fontSize={15}
              paddingHorizontal={30}
              paddingVertical={16}
              onPress={handleStop}
              style={styles.stopButton}
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    fontSize: 18,
    color: appColors.textPrimary,
    marginTop: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  finalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
  },
  stopButton: {
    flex: 1,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default PushUpScreen;
