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
  const safeStats = stats || {total: 0, completed: 0, totalPoints: 0};

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>🏆 Challenges</Text>
        <Text style={styles.subtitle}>
          {safeStats.total > 0
            ? `${safeStats.total} challenge${safeStats.total > 1 ? 's' : ''} disponible${safeStats.total > 1 ? 's' : ''}`
            : 'Aucun challenge disponible'}
        </Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBadge}>
          <Icon name="checkmark-circle" size={16} color={appColors.success} />
          <Text style={styles.statBadgeText}>{safeStats.completed}</Text>
        </View>
        <View style={styles.statBadge}>
          <Icon name="star" size={16} color={appColors.warning} />
          <Text style={styles.statBadgeText}>{safeStats.totalPoints}</Text>
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
