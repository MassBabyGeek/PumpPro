import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../components/GradientButton/GradientButton';
import appColors from '../../assets/colors';
import PushUpCamera from '../../components/PushUpCamera/PushUpCamera';
import {useNavigation, useRoute} from '@react-navigation/native';
import {formatTime} from '../../utils/workout.utils';
import {
  LibreScreenNavigationProp,
  LibreScreenRouteProp,
} from '../../types/navigation.types';
import {TYPE_LABELS, VARIANT_LABELS} from '../../types/workout.types';
import {FREE_MODE_STANDARD} from '../../data/workoutPrograms.mock';
import {ScrollView} from 'react-native-gesture-handler';
import {useWorkout} from '../../hooks';
import Icon from 'react-native-vector-icons/Ionicons';
import PushUpProgressBar from './component/PushUpProgressBar';

const PushUpScreen = () => {
  const navigation = useNavigation<LibreScreenNavigationProp>();
  const route = useRoute<LibreScreenRouteProp>();
  const program = route.params?.program || FREE_MODE_STANDARD;

  const {
    workoutState,
    distance,
    setDistance,
    cameraActive,
    incrementRep,
    togglePause,
    stopWorkout,
    getCurrentSetProgress,
  } = useWorkout(program);

  const handleStop = () => {
    const session = stopWorkout();
    if (session) {
      navigation.navigate('PushUpSummary', {session});
    }
  };

  if (!workoutState) {
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

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradientContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBadges}>
            <View style={styles.typeBadge}>
              <Icon name="flame" size={14} color={appColors.primary} />
              <Text style={styles.typeBadgeText}>
                {TYPE_LABELS[program.type]}
              </Text>
            </View>
            {workoutState.totalSets > 1 && (
              <View style={styles.setBadge}>
                <Text style={styles.setBadgeText}>
                  Série {workoutState.currentSet}/{workoutState.totalSets}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.programTitle}>{program.name}</Text>
          <Text style={styles.programSubtitle}>
            {VARIANT_LABELS[program.variant]}
          </Text>
        </View>

        {/* Caméra cachée */}
        <PushUpCamera
          isActive={cameraActive}
          setPushUpCount={incrementRep}
          setDistance={setDistance}
        />

        {/* Zone principale */}
        {isResting ? (
          <View style={styles.mainContent}>
            <View style={styles.restContainer}>
              <Icon
                name="pause-circle"
                size={70}
                color={appColors.warning}
                style={styles.restIcon}
              />
              <Text style={styles.restLabel}>TEMPS DE REPOS</Text>
              <Text style={styles.restTimer}>
                {workoutState.restTimeRemaining || 0}s
              </Text>
              <Text style={styles.restSubtext}>Respirez profondément 💨</Text>
            </View>
          </View>
        ) : (
          <View style={styles.mainContent}>
            {/* Compteur principal circulaire */}
            <View style={styles.counterContainer}>
              <LinearGradient
                colors={[`${appColors.primary}15`, `${appColors.accent}15`]}
                style={styles.counterGradient}>
                <View style={styles.counterGradientContainer}>
                  <View style={styles.counterCircle}>
                    <Text style={styles.counterLabel}>POMPES</Text>
                    <Text style={styles.counterText}>
                      {workoutState.currentReps}
                    </Text>
                    {workoutState.targetRepsForCurrentSet && (
                      <Text style={styles.targetText}>
                        / {workoutState.targetRepsForCurrentSet}
                      </Text>
                    )}
                    {workoutState.targetRepsForCurrentSet && (
                      <View style={styles.progressIndicator}>
                        <View
                          style={[styles.progressFill, {width: `${progress}%`}]}
                        />
                      </View>
                    )}
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
              <Icon
                name="time-outline"
                size={32}
                color={appColors.primary}
                style={styles.timerIcon}
              />
              <Text style={styles.timer}>
                {formatTime(workoutState.elapsedTime)}
              </Text>
            </View>
          </View>
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
        />

        {/* Statistiques en grille */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[`${appColors.primary}15`, `${appColors.accent}15`]}
              style={styles.statCardGradient}>
              <View style={styles.statCardGradientContainer}>
                <Icon name="barbell" size={24} color={appColors.primary} />
                <Text style={styles.statValue}>{workoutState.totalReps}</Text>
                <Text style={styles.statLabelText}>Total</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[`${appColors.error}15`, `${appColors.warning}15`]}
              style={styles.statCardGradient}>
              <View style={styles.statCardGradientContainer}>
                <Icon name="flame" size={24} color={appColors.error} />
                <Text style={styles.statValue}>{calories}</Text>
                <Text style={styles.statLabelText}>Calories</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[`${appColors.success}15`, `${appColors.accent}15`]}
              style={styles.statCardGradient}>
              <View style={styles.statCardGradientContainer}>
                <Icon name="speedometer" size={24} color={appColors.success} />
                <Text style={styles.statValue}>{repsPerMin}</Text>
                <Text style={styles.statLabelText}>Reps/min</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

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

          <GradientButton
            text="Terminer l'entraînement"
            icon="checkmark-circle"
            fontSize={15}
            paddingHorizontal={30}
            paddingVertical={16}
            onPress={handleStop}
            style={styles.stopButton}
          />
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
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${appColors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    color: appColors.primary,
    fontWeight: '600',
  },
  setBadge: {
    backgroundColor: `${appColors.accent}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  setBadgeText: {
    fontSize: 12,
    color: appColors.accent,
    fontWeight: '600',
  },
  programTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  programSubtitle: {
    fontSize: 14,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
  mainContent: {
    alignItems: 'center',
  },
  timer: {
    fontSize: 50,
    color: appColors.primary,
    alignContent: 'center',
    alignItems: 'center',
  },
  restContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  restIcon: {
    marginBottom: 16,
  },
  restLabel: {
    fontSize: 24,
    color: appColors.warning,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 2,
  },
  restTimer: {
    fontSize: 64,
    color: appColors.warning,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  restSubtext: {
    fontSize: 16,
    color: appColors.textSecondary,
    fontStyle: 'italic',
  },
  counterContainer: {
    marginVertical: 10,
    width: '100%',
    borderColor: appColors.primary,
    borderWidth: 1,
    borderRadius: 30,
  },
  counterGradientContainer: {
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  counterGradient: {
    alignItems: 'center',
    borderRadius: 30,
  },
  counterLabel: {
    fontSize: 14,
    color: appColors.textSecondary,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  counterCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 50,
    color: appColors.primary,
  },
  targetText: {
    fontSize: 28,
    color: appColors.textSecondary,
    marginTop: 4,
  },
  progressIndicator: {
    width: 200,
    height: 6,
    backgroundColor: `${appColors.textSecondary}30`,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: appColors.success,
    borderRadius: 3,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center', // centre verticalement icône et texte
    gap: 8,
    marginTop: 12,
  },
  timerIcon: {},
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 10,
    flexWrap: 'wrap',
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  statText: {
    fontSize: 16,
    color: appColors.textSecondary,
  },
  distanceSection: {
    width: '100%',
    marginVertical: 16,
  },
  distanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  distanceContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  distanceLabel: {
    fontSize: 16,
    color: appColors.primary,
    fontWeight: '600',
  },
  distanceBar: {
    width: '100%',
    height: 40,
    backgroundColor: appColors.textSecondary + '30',
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  distanceFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: appColors.primary,
    borderRadius: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 10,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
  },
  statCardGradient: {
    borderRadius: 16,
    gap: 8,
  },
  statCardGradientContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  statLabelText: {
    fontSize: 12,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  stopButton: {
    marginTop: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default PushUpScreen;
