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

const TodayStatsSection = ({stats}: Props) => {
  return (
    <View style={styles.section}>
      <SectionTitle title="📊 Aujourd'hui" />
      {stats ? (
        <>
          <View style={styles.statsGrid}>
            <StatCard
              icon="fitness"
              label="Pompes"
              value={stats?.totalPushUps}
              color={appColors.primary}
            />
            <StatCard
              icon="flame"
              label="Série actuelle"
              value={stats?.totalWorkouts}
              unit="jours"
              color={appColors.error}
            />
          </View>
        </>
      ) : (
        <EmptyState
          icon="calendar-outline"
          title="Aucune activité aujourd'hui"
          message="Lance ton premier entraînement pour voir tes stats ici !"
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

export default TodayStatsSection;
