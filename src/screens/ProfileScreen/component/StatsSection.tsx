import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import StatCard from '../../../components/StatCard/StatCard';
import appColors from '../../../assets/colors';
import {formatTime} from '../../../utils/workout.utils';
import {useUser} from '../../../hooks';

type StatsSectionProps = {
  selectedPeriod: 'today' | 'week' | 'month' | 'year';
  onPeriodChange: (period: 'today' | 'week' | 'month' | 'year') => void;
};

const StatsSection = ({selectedPeriod, onPeriodChange}: StatsSectionProps) => {
  const {setStatsPeriod, statsByPeriod, isLoading, user} = useUser();

  useEffect(() => {
    setStatsPeriod(selectedPeriod);
  }, [selectedPeriod, user]);

  const currentStats = statsByPeriod || {
    totalPushUps: 0,
    totalWorkouts: 0,
    totalCalories: 0,
    totalTime: 0,
    averagePushUps: 0,
    bestSession: 0,
  };

  return (
    <View style={styles.section}>
      <SectionTitle title="Statistiques" />
      <View style={styles.periodSelector}>
        {(['today', 'week', 'month', 'year'] as const).map(period => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.activePeriod,
            ]}
            onPress={() => onPeriodChange(period)}>
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.activePeriodText,
              ]}>
              {period === 'today'
                ? 'Jour'
                : period === 'week'
                  ? 'Semaine'
                  : period === 'month'
                    ? 'Mois'
                    : 'Année'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsGrid}>
        {isLoading ? (
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Chargement...</Text>
          </View>
        ) : (
          <>
            <StatCard
              icon="fitness"
              label="Total pompes"
              value={currentStats.totalPushUps}
              color={appColors.primary}
            />
            <StatCard
              icon="flame"
              label="Calories"
              value={currentStats.totalCalories.toFixed(0)}
              unit="kcal"
              color={appColors.accent}
            />
            <StatCard
              icon="barbell"
              label="Séances"
              value={currentStats.totalWorkouts}
              color={appColors.success}
            />
            <StatCard
              icon="time"
              label="Temps total"
              value={formatTime(currentStats.totalTime)}
              color={appColors.warning}
            />
            <StatCard
              icon="trophy"
              label="Meilleure session"
              value={currentStats.bestSession}
              unit="pompes"
              color={appColors.primary}
            />
            <StatCard
              icon="stats-chart"
              label="Moyenne"
              value={currentStats.averagePushUps.toFixed(1)}
              unit="pompes"
              color={appColors.accent}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: `${appColors.border}30`,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  section: {
    marginBottom: 40,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: appColors.background,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  activePeriod: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  periodText: {
    fontSize: 12,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  activePeriodText: {
    color: appColors.background,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
});

export default StatsSection;
