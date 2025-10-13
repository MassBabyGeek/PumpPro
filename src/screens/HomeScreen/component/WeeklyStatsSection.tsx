import React from 'react';
import {View, StyleSheet} from 'react-native';
import StatCard from '../../../components/StatCard/StatCard';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import EmptyState from '../../../components/EmptyState';
import appColors from '../../../assets/colors';
import {Stats} from '../../../types/user.types';

type Props = {
  stats: Stats | null;
};

const WeeklyStatsSection = ({stats}: Props) => {
  return (
    <View style={styles.section}>
      <SectionTitle title="📈 Cette semaine" />
      {stats ? (
        <>
          <View style={styles.statsGrid}>
            <StatCard
              icon="bar-chart"
              label="Total"
              value={stats.totalWorkouts}
              color={appColors.success}
            />
            <StatCard
              icon="trending-up"
              label="Moyenne/jour"
              value={stats.averagePushUps}
              color={appColors.accent}
            />
          </View>
          <View style={[styles.statsGrid, {marginTop: 12}]}>
            <StatCard
              icon="trophy"
              label="Record perso"
              value={stats.bestSession}
              color={appColors.warning}
            />
            <StatCard
              icon="stats-chart"
              label="Total"
              value={stats?.totalPushUps}
              color={appColors.primary}
            />
          </View>
        </>
      ) : (
        <EmptyState
          icon="bar-chart-outline"
          title="Aucune donnée cette semaine"
          message="Commence à t'entraîner pour voir tes progrès hebdomadaires !"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});

export default WeeklyStatsSection;
