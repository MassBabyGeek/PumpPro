import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

type Props = {
  totalReps: number;
  calories: number;
  repsPerMin: number;
};

const WorkoutStatsGrid = ({totalReps, calories, repsPerMin}: Props) => {
  return (
    <View style={styles.statsGrid}>
      <View style={styles.statCard}>
        <LinearGradient
          colors={[`${appColors.primary}15`, `${appColors.accent}15`]}
          style={styles.statCardGradient}>
          <View style={styles.statCardGradientContainer}>
            <Icon name="barbell" size={24} color={appColors.primary} />
            <Text style={styles.statValue}>{totalReps}</Text>
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
  );
};

const styles = StyleSheet.create({
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
});

export default WorkoutStatsGrid;
