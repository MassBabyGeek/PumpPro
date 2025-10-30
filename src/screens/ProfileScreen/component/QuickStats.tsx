import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import appColors from '../../../assets/colors';
import {UserProfile} from '../../../types/user.types';

type QuickStatsProps = {
  user: UserProfile;
};

const QuickStats = ({user}: QuickStatsProps) => {
  const stats = [
    {
      value: user.stats?.today?.count?.toLocaleString() || '0',
      label: "Aujourd'hui",
    },
    {
      value: user.stats?.week?.count?.toLocaleString() || '0',
      label: 'Cette semaine',
    },
    {
      value: user.score?.toLocaleString() || '0',
      label: 'Points',
    },
  ];

  return (
    <View style={styles.quickStats}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statItem}>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: appColors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default QuickStats;
