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

const WorkoutCounter = ({
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
          color={
            isTimeBasedProgram && timeRemaining !== null && timeRemaining < 30
              ? appColors.error
              : appColors.primary
          }
          style={styles.timerIcon}
        />
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
};

const styles = StyleSheet.create({
  mainContent: {
    alignItems: 'center',
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
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  timerIcon: {},
  timerContent: {
    alignItems: 'center',
  },
  timer: {
    fontSize: 50,
    color: appColors.primary,
  },
  timerUrgent: {
    color: appColors.error,
  },
  timerLabel: {
    fontSize: 14,
    color: appColors.textSecondary,
    marginTop: 4,
  },
});

export default WorkoutCounter;
