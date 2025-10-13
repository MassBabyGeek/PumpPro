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
};

const WorkoutCounter = ({currentReps, targetReps, progress, elapsedTime}: Props) => {
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
          color={appColors.primary}
          style={styles.timerIcon}
        />
        <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
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
  timer: {
    fontSize: 50,
    color: appColors.primary,
  },
});

export default WorkoutCounter;
