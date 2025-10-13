import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import appColors from '../../../assets/colors';

type WorkoutSet = {
  setNumber: number;
  completedReps: number;
  targetReps?: number;
  duration: number;
};

type SetsDetailSectionProps = {
  sets: WorkoutSet[];
};

const SetsDetailSection = ({sets}: SetsDetailSectionProps) => {
  if (sets.length <= 1) {
    return null;
  }

  return (
    <View style={styles.setsContainer}>
      <Text style={styles.setsTitle}>Détails des séries</Text>
      {sets.map((set, index) => (
        <View key={index} style={styles.setRow}>
          <Text style={styles.setNumber}>Série {set.setNumber}</Text>
          <Text style={styles.setReps}>
            {set.completedReps}
            {set.targetReps && ` / ${set.targetReps}`} reps
          </Text>
          <Text style={styles.setDuration}>{set.duration}s</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  setsContainer: {
    width: '100%',
    backgroundColor: `${appColors.border}30`,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  setsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 12,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: `${appColors.border}50`,
  },
  setNumber: {
    fontSize: 14,
    color: appColors.textSecondary,
    flex: 1,
  },
  setReps: {
    fontSize: 14,
    color: appColors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  setDuration: {
    fontSize: 14,
    color: appColors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
});

export default SetsDetailSection;
