import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useLeaderboardDetail} from '../../hooks';
import {LeaderboardPeriod, LeaderboardMetric} from '../../services/api';
import appColors from '../../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  navigation: any;
};

const PERIOD_OPTIONS: {
  value: LeaderboardPeriod;
  label: string;
  icon: string;
}[] = [
  {value: 'daily', label: 'Jour', icon: 'today-outline'},
  {value: 'weekly', label: 'Semaine', icon: 'calendar-outline'},
  {value: 'monthly', label: 'Mois', icon: 'calendar-number-outline'},
  {value: 'yearly', label: 'Année', icon: 'calendar'},
  {value: 'all-time', label: 'Total', icon: 'infinite-outline'},
];

const METRIC_OPTIONS: {
  value: LeaderboardMetric;
  label: string;
  icon: string;
  suffix: string;
}[] = [
  {
    value: 'total-pushups',
    label: 'Pompes totales',
    icon: 'fitness-outline',
    suffix: '💪',
  },
  {
    value: 'total-workouts',
    label: 'Entraînements',
    icon: 'barbell-outline',
    suffix: '🏋️',
  },
  {
    value: 'total-calories',
    label: 'Calories',
    icon: 'flame-outline',
    suffix: '🔥',
  },
  {
    value: 'max-reps',
    label: 'Record de reps',
    icon: 'trophy-outline',
    suffix: '⭐',
  },
  {
    value: 'max-streak',
    label: 'Série de jours',
    icon: 'timer-outline',
    suffix: '⚡',
  },
];

const LeaderboardDetailScreen = ({navigation}: Props) => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<LeaderboardPeriod>('weekly');
  const [selectedMetric, setSelectedMetric] =
    useState<LeaderboardMetric>('total-pushups');

  const {
    leaderboard,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    refreshLeaderboard,
  } = useLeaderboardDetail(selectedPeriod, selectedMetric);

  const currentMetric = METRIC_OPTIONS.find(m => m.value === selectedMetric);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={appColors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Classement</Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderPeriodSelector = () => (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>Période</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}>
        {PERIOD_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterChip,
              selectedPeriod === option.value && styles.filterChipActive,
            ]}
            onPress={() => setSelectedPeriod(option.value)}>
            <Icon
              name={option.icon}
              size={16}
              color={
                selectedPeriod === option.value
                  ? '#fff'
                  : appColors.textSecondary
              }
            />
            <Text
              style={[
                styles.filterChipText,
                selectedPeriod === option.value && styles.filterChipTextActive,
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMetricSelector = () => (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>Métrique</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}>
        {METRIC_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterChip,
              selectedMetric === option.value && styles.filterChipActive,
            ]}
            onPress={() => setSelectedMetric(option.value)}>
            <Icon
              name={option.icon}
              size={16}
              color={
                selectedMetric === option.value
                  ? '#fff'
                  : appColors.textSecondary
              }
            />
            <Text
              style={[
                styles.filterChipText,
                selectedMetric === option.value && styles.filterChipTextActive,
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderLeaderboardItem = ({item, index}: {item: any; index: number}) => {
    const isTop3 = item.rank <= 3;
    const isEven = index % 2 === 0;
    let itemValue = item.score;

    switch (currentMetric?.label) {
      case 'total-pushups':
        itemValue = item.score;
        break;
      case 'total-workouts':
        itemValue = item.TotalSessions;
        break;
      case 'total-calories':
        itemValue = item.TotalCalories;
        break;
      case 'max-reps':
        itemValue = item.BestSessionReps;
        break;
      case 'max-streak':
        itemValue = item.CurrentStreak;
        break;
    }

    const getRankBadgeTopStyle = (rank: number) => ({
      backgroundColor:
        rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32',
    });

    return (
      <View
        style={[
          styles.leaderboardItem,
          isEven && styles.leaderboardItemEven,
          isTop3 && styles.leaderboardItemTop,
        ]}>
        <View style={styles.leaderboardLeft}>
          <View
            style={[
              styles.rankBadge,
              isTop3 && getRankBadgeTopStyle(item.rank),
            ]}>
            {isTop3 ? (
              <Text style={styles.rankEmoji}>
                {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
              </Text>
            ) : (
              <Text style={styles.rankText}>{item.rank}</Text>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.userName}
            </Text>
            {item.change !== undefined && item.change !== 0 && (
              <View style={styles.changeContainer}>
                <Icon
                  name={
                    item.change > 0 ? 'arrow-up-outline' : 'arrow-down-outline'
                  }
                  size={12}
                  color={item.change > 0 ? appColors.success : appColors.error}
                />
                <Text
                  style={[
                    styles.changeText,
                    {
                      color:
                        item.change > 0 ? appColors.success : appColors.error,
                    },
                  ]}>
                  {Math.abs(item.change)}
                </Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.scoreText}>
          {itemValue.toLocaleString()} {currentMetric?.suffix}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={appColors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Icon name="trophy-outline" size={64} color={appColors.border} />
        <Text style={styles.emptyTitle}>Aucune donnée</Text>
        <Text style={styles.emptyMessage}>
          Aucun classement disponible pour cette période
        </Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradientContainer}>
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader()}

        <View style={styles.content}>
          {renderPeriodSelector()}
          {renderMetricSelector()}

          <View style={styles.leaderboardCard}>
            <FlatList
              data={leaderboard}
              keyExtractor={(item, index) =>
                `${item.userId}-${item.rank}-${index}`
              }
              renderItem={renderLeaderboardItem}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={renderEmpty}
              onEndReached={() => {
                if (hasMore && !isLoadingMore) {
                  loadMore();
                }
              }}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={refreshLeaderboard}
                  tintColor={appColors.primary}
                  colors={[appColors.primary]}
                />
              }
              contentContainerStyle={
                leaderboard.length === 0 ? styles.emptyList : styles.listContent
              }
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textSecondary,
    marginBottom: 8,
  },
  filterScroll: {
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: `${appColors.border}30`,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  filterChipActive: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  leaderboardCard: {
    flex: 1,
    backgroundColor: `${appColors.border}20`,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${appColors.border}20`,
  },
  leaderboardItemEven: {
    backgroundColor: `${appColors.border}10`,
  },
  leaderboardItemTop: {
    backgroundColor: `${appColors.warning}10`,
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: appColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.textSecondary,
  },
  rankEmoji: {
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    color: appColors.textPrimary,
    fontWeight: '600',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 18,
    color: appColors.primary,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginTop: 16,
  },
  emptyMessage: {
    fontSize: 14,
    color: appColors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default LeaderboardDetailScreen;
