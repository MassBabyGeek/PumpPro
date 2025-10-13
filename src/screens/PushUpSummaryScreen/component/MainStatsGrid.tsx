import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import {formatTime} from '../../../utils/workout.utils';

type MainStatsGridProps = {
  totalReps: number;
  totalDuration: number;
  calories: number;
};

const MainStatsGrid = ({totalReps, totalDuration, calories}: MainStatsGridProps) => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Icon name="barbell" size={32} color={appColors.primary} />
        <Text style={styles.statValue}>{totalReps}</Text>
        <Text style={styles.statLabel}>Pompes</Text>
      </View>

      <View style={styles.statCard}>
        <Icon name="time" size={32} color={appColors.accent} />
        <Text style={styles.statValue}>{formatTime(totalDuration)}</Text>
        <Text style={styles.statLabel}>Durée</Text>
      </View>

      <View style={styles.statCard}>
        <Icon name="flame" size={32} color={appColors.error} />
        <Text style={styles.statValue}>{calories}</Text>
        <Text style={styles.statLabel}>Calories</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: `${appColors.border}30`,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
  },
});

export default MainStatsGrid;
