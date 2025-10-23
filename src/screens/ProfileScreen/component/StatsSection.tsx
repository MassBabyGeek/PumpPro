import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import StatCard from '../../../components/StatCard/StatCard';
import LoadingView from '../../../components/LoadingView/LoadingView';
import appColors from '../../../assets/colors';
import {formatTime} from '../../../utils/workout.utils';
import {useUser, useUserProfile} from '../../../hooks';

type StatsSectionProps = {
  selectedPeriod: 'today' | 'week' | 'month' | 'year';
  onPeriodChange: (period: 'today' | 'week' | 'month' | 'year') => void;
  userId?: string; // Si fourni, charge les stats de cet utilisateur au lieu de l'utilisateur connecté
};

const StatsSection = ({selectedPeriod, onPeriodChange, userId}: StatsSectionProps) => {
  // Si userId est fourni, utilise useUserProfile, sinon utilise useUser
  const currentUserData = useUser();
  const specificUserData = useUserProfile(userId || '');

  // Sélectionner les bonnes données selon si on regarde un profil spécifique ou le sien
  const {setStatsPeriod, statsByPeriod, isLoading, user} = userId
    ? specificUserData
    : currentUserData;

  useEffect(() => {
    if (user || userId) {
      setStatsPeriod(selectedPeriod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, user, userId]);

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

      {isLoading ? (
        <LoadingView height={200} />
      ) : (
        <View style={styles.statsGrid}>
          <StatCard
            icon="fitness"
            label="Total pompes"
            value={Number(currentStats.totalPushUps).toFixed(0)}
            color={appColors.primary}
          />
          <StatCard
            icon="flame"
            label="Calories"
            value={Number(currentStats.totalCalories).toFixed(1)}
            unit="kcal"
            color={appColors.accent}
          />
          <StatCard
            icon="barbell"
            label="Séances"
            value={Number(currentStats.totalWorkouts).toFixed(0)}
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
            value={Number(currentStats.bestSession).toFixed(0)}
            unit="pompes"
            color={appColors.primary}
          />
          <StatCard
            icon="stats-chart"
            label="Moyenne"
            value={Number(currentStats.averagePushUps).toFixed(1)}
            unit="pompes"
            color={appColors.accent}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
