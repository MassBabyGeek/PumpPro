import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

type ChallengeStats = {
  total: number;
  completed: number;
  totalPoints: number;
};

type ChallengeHeaderProps = {
  stats: ChallengeStats;
};

const ChallengeHeader = ({stats}: ChallengeHeaderProps) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>🏆 Challenges</Text>
        <Text style={styles.subtitle}>
          {stats?.total
            ? `${stats.total} challenge${stats.total > 1 ? 's' : ''} disponible${stats.total > 1 ? 's' : ''}`
            : null}
        </Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBadge}>
          <Icon name="checkmark-circle" size={16} color={appColors.success} />
          <Text style={styles.statBadgeText}>{stats.completed}</Text>
        </View>
        <View style={styles.statBadge}>
          <Icon name="star" size={16} color={appColors.warning} />
          <Text style={styles.statBadgeText}>{stats.totalPoints}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: appColors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${appColors.textSecondary}20`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
});

export default ChallengeHeader;
