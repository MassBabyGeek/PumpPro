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

const WorkoutStatsGrid = React.memo(({totalReps, calories, repsPerMin}: Props) => {
  return (
    <View style={styles.statsGrid}>
      <View style={styles.statCard}>
        <LinearGradient
          colors={[`${appColors.primary}15`, `${appColors.accent}15`]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.statCardGradient}>
          <View style={styles.statIconContainer}>
            <Icon name="barbell" size={26} color={appColors.primary} />
          </View>
          <Text style={styles.statValue}>{totalReps}</Text>
          <Text style={styles.statLabelText}>Total</Text>
        </LinearGradient>
      </View>

      <View style={styles.statCard}>
        <LinearGradient
          colors={[`${appColors.error}15`, `${appColors.warning}15`]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.statCardGradient}>
          <View style={styles.statIconContainer}>
            <Icon name="flame" size={26} color={appColors.error} />
          </View>
          <Text style={styles.statValue}>{calories}</Text>
          <Text style={styles.statLabelText}>Calories</Text>
        </LinearGradient>
      </View>

      <View style={styles.statCard}>
        <LinearGradient
          colors={[`${appColors.success}15`, `${appColors.accent}15`]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.statCardGradient}>
          <View style={styles.statIconContainer}>
            <Icon name="speedometer" size={26} color={appColors.success} />
          </View>
          <Text style={styles.statValue}>{repsPerMin}</Text>
          <Text style={styles.statLabelText}>Reps/min</Text>
        </LinearGradient>
      </View>
    </View>
  );
});

WorkoutStatsGrid.displayName = 'WorkoutStatsGrid';

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: appColors.border + '30',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statCardGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: appColors.background + '40',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  statLabelText: {
    fontSize: 11,
    color: appColors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default WorkoutStatsGrid;
