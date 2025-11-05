import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import {formatTime} from '../../../utils/workout.utils';

type Props = {
  currentReps: number;
  targetReps?: number;
  progress: number;
  elapsedTime: number;
  timeLimit?: number; // Durée limite en secondes (pour MAX_TIME, AMRAP, etc.)
};

const WorkoutCounter = React.memo(({
  currentReps,
  targetReps,
  progress,
  elapsedTime,
  timeLimit,
}: Props) => {
  // Si on a une limite de temps, afficher le compte à rebours
  const timeRemaining = timeLimit ? timeLimit - elapsedTime : null;
  const isTimeBasedProgram = timeLimit !== undefined;

  return (
    <View style={styles.mainContent}>
      {/* Compteur principal circulaire */}
      <View style={styles.counterContainer}>
        <LinearGradient
          colors={[`${appColors.primary}15`, `${appColors.accent}15`]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.counterGradient}>
          <View style={styles.counterGradientContainer}>
            <View style={styles.counterCircle}>
              <Text style={styles.counterLabel}>POMPES</Text>
              <Text style={styles.counterText}>{currentReps}</Text>
              {targetReps && (
                <Text style={styles.targetText}>/ {targetReps}</Text>
              )}
              {targetReps && (
                <View style={styles.progressIndicator}>
                  <LinearGradient
                    colors={[appColors.success, appColors.primary]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
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
        <View style={[
          styles.timerIconContainer,
          isTimeBasedProgram && timeRemaining !== null && timeRemaining < 30 && styles.timerIconUrgent
        ]}>
          <Icon
            name="time-outline"
            size={28}
            color={
              isTimeBasedProgram && timeRemaining !== null && timeRemaining < 30
                ? appColors.error
                : appColors.primary
            }
          />
        </View>
        {isTimeBasedProgram && timeRemaining !== null ? (
          <View style={styles.timerContent}>
            <Text
              style={[
                styles.timer,
                timeRemaining < 30 && styles.timerUrgent,
              ]}>
              {formatTime(Math.max(0, timeRemaining))}
            </Text>
            <Text style={styles.timerLabel}>restant</Text>
          </View>
        ) : (
          <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
        )}
      </View>
    </View>
  );
});

WorkoutCounter.displayName = 'WorkoutCounter';

const styles = StyleSheet.create({
  mainContent: {
    alignItems: 'center',
  },
  counterContainer: {
    marginVertical: 12,
    width: '100%',
    borderColor: appColors.primary + '40',
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: appColors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  counterGradientContainer: {
    paddingVertical: 32,
    paddingHorizontal: 40,
  },
  counterGradient: {
    alignItems: 'center',
  },
  counterLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  counterCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: appColors.primary,
  },
  targetText: {
    fontSize: 26,
    color: appColors.textSecondary,
    marginTop: 6,
    fontWeight: '600',
  },
  progressIndicator: {
    width: 200,
    height: 8,
    backgroundColor: `${appColors.textSecondary}20`,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  timerIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: appColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerIconUrgent: {
    backgroundColor: appColors.error + '20',
  },
  timerContent: {
    alignItems: 'flex-start',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: appColors.primary,
  },
  timerUrgent: {
    color: appColors.error,
  },
  timerLabel: {
    fontSize: 13,
    color: appColors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
});

export default WorkoutCounter;
