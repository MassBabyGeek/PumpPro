import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList, RefreshControl, View, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LeaderboardItem from './components/LeaderboardItem';
import {AppTitle, LoadingView} from '../../components';
import appColors from '../../assets/colors';
import FilterSelector from './components/FilterSelector';
import EmptyState from '../../components/EmptyState';
import {useLeaderboardDetail} from '../../hooks';
import LeaderboardHeader from './components/LeaderboardHeader';
import {useNavigation} from '@react-navigation/native';

const PERIOD_OPTIONS = [
  {value: 'daily', label: 'Jour', icon: 'today-outline'},
  {value: 'weekly', label: 'Semaine', icon: 'calendar-outline'},
  {value: 'monthly', label: 'Mois', icon: 'calendar-number-outline'},
  {value: 'yearly', label: 'Année', icon: 'calendar'},
  {value: 'all-time', label: 'Total', icon: 'infinite-outline'},
];

const METRIC_OPTIONS = [
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

export default function LeaderboardDetailScreen() {
  const {
    leaderboard,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    refresh,
    period,
    setPeriod,
    metric,
    setMetric,
  } = useLeaderboardDetail('weekly', 'total-pushups');
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}} edges={['top']}>
        <LeaderboardHeader navigation={navigation} title="Classement" />

        <ScrollView
          style={{flex: 1, paddingHorizontal: 20}}
          showsVerticalScrollIndicator={false}>
          <FilterSelector
            label="Période"
            options={PERIOD_OPTIONS}
            selected={period}
            onSelect={setPeriod}
          />
          <FilterSelector
            label="Métrique"
            options={METRIC_OPTIONS}
            selected={metric}
            onSelect={setMetric}
          />

          <View
            style={{
              flex: 1,
              backgroundColor: `${appColors.border}20`,
              borderRadius: 16,
              overflow: 'hidden',
              marginTop: 16,
            }}>
            <FlatList
              data={leaderboard}
              keyExtractor={(item, index) =>
                `${item.userId}-${item.rank}-${index}`
              }
              renderItem={({item, index}) => (
                <LeaderboardItem
                  key={`${item.userId}-${metric}`}
                  item={item}
                  index={index}
                  metric={metric}
                  metricOptions={METRIC_OPTIONS}
                />
              )}
              ListFooterComponent={isLoadingMore ? <LoadingView /> : null}
              ListEmptyComponent={isLoading ? <LoadingView /> : <EmptyState />}
              onEndReached={() => {
                if (hasMore && !isLoadingMore && leaderboard.length > 0) {
                  loadMore();
                }
              }}
              onEndReachedThreshold={0.1}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={refresh}
                  tintColor={appColors.primary}
                  colors={[appColors.primary]}
                />
              }
              contentContainerStyle={{
                flexGrow: leaderboard.length === 0 ? 1 : undefined,
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
