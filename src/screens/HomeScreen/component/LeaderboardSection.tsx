import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import EmptyState from '../../../components/EmptyState';
import appColors from '../../../assets/colors';
import {LeaderboardEntry} from '../../../services/api';

type Props = {
  leaderboard: LeaderboardEntry[];
  onViewAll: () => void;
};

const LeaderboardSection = ({leaderboard, onViewAll}: Props) => {
  const navigation = useNavigation<any>();

  const handleUserPress = (userId: string, userName: string) => {
    navigation.navigate('UserProfile', {
      userId,
      userName,
    });
  };

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return {backgroundColor: '#FFD700'}; // Or
    if (rank === 2) return {backgroundColor: '#C0C0C0'}; // Argent
    if (rank === 3) return {backgroundColor: '#CD7F32'}; // Bronze
    return {backgroundColor: appColors.border};
  };

  // Ensure leaderboard is an array
  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];

  return (
    <View style={styles.section}>
      <SectionTitle
        title="🏆 Classement hebdo"
        actionText="Voir tout"
        onActionPress={onViewAll}
      />
      {safeLeaderboard.length === 0 ? (
        <EmptyState
          icon="trophy-outline"
          title="Aucun classement disponible"
          message="Sois le premier à t'entraîner et grimpe au sommet !"
        />
      ) : (
        <View style={styles.leaderboardCard}>
        {safeLeaderboard.map((user, index) => (
          <TouchableOpacity
            key={user.userId}
            onPress={() => handleUserPress(user.userId, user.userName)}
            activeOpacity={0.7}
            style={[
              styles.leaderboardItem,
              index === safeLeaderboard.length - 1 && styles.leaderboardItemLast,
            ]}>
            <View style={styles.leaderboardLeft}>
              <View
                style={[
                  styles.rankBadge,
                  getRankBadgeStyle(user.rank),
                ]}>
                {user.rank <= 3 ? (
                  <Text style={styles.rankEmoji}>
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                  </Text>
                ) : (
                  <Text style={styles.rankText}>{user.rank}</Text>
                )}
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.leaderboardName}>{user.userName}</Text>
                {user.change !== 0 && user.change !== undefined && (
                  <View style={styles.changeIndicator}>
                    <Icon
                      name={user.change > 0 ? 'arrow-up-outline' : 'arrow-down-outline'}
                      size={10}
                      color={user.change > 0 ? appColors.success : appColors.error}
                    />
                    <Text
                      style={[
                        styles.changeText,
                        {color: user.change > 0 ? appColors.success : appColors.error},
                      ]}>
                      {Math.abs(user.change)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.leaderboardScore}>{user.score} 💪</Text>
              <Icon name="chevron-forward" size={18} color={appColors.textSecondary} />
            </View>
          </TouchableOpacity>
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
    flex: 1,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankEmoji: {
    fontSize: 18,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.textSecondary,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  leaderboardName: {
    fontSize: 16,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  leaderboardScore: {
    fontSize: 16,
    color: appColors.primary,
    fontWeight: 'bold',
  },
});

export default LeaderboardSection;
