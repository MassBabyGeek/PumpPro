import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import EmptyState from '../../../components/EmptyState';
import appColors from '../../../assets/colors';
import {LeaderboardEntry} from '../../../services/api';

type Props = {
  leaderboard: LeaderboardEntry[];
  onViewAll: () => void;
};

const LeaderboardSection = ({leaderboard, onViewAll}: Props) => {
  return (
    <View style={styles.section}>
      <SectionTitle
        title="🏆 Classement hebdo"
        actionText="Voir tout"
        onActionPress={onViewAll}
      />
      {!leaderboard || leaderboard.length === 0 ? (
        <EmptyState
          icon="trophy-outline"
          title="Aucun classement disponible"
          message="Sois le premier à t'entraîner et grimpe au sommet !"
        />
      ) : (
        <View style={styles.leaderboardCard}>
        {leaderboard.map((user, index) => (
          <View
            key={user.userId}
            style={[
              styles.leaderboardItem,
              index === leaderboard.length - 1 && styles.leaderboardItemLast,
            ]}>
            <View style={styles.leaderboardLeft}>
              <View
                style={[
                  styles.rankBadge,
                  user.rank <= 3 && styles.rankBadgeTop,
                ]}>
                <Text
                  style={[
                    styles.rankText,
                    user.rank <= 3 && styles.rankTextTop,
                  ]}>
                  {user.rank}
                </Text>
              </View>
              <Text style={styles.leaderboardName}>{user.userName}</Text>
            </View>
            <Text style={styles.leaderboardScore}>{user.score} 💪</Text>
          </View>
        ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  leaderboardCard: {
    backgroundColor: `${appColors.border}30`,
    borderRadius: 16,
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: `${appColors.border}50`,
  },
  leaderboardItemLast: {
    borderBottomWidth: 0,
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: appColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeTop: {
    backgroundColor: appColors.warning,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.textSecondary,
  },
  rankTextTop: {
    color: '#fff',
  },
  leaderboardName: {
    fontSize: 16,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
  leaderboardScore: {
    fontSize: 16,
    color: appColors.primary,
    fontWeight: 'bold',
  },
});

export default LeaderboardSection;
