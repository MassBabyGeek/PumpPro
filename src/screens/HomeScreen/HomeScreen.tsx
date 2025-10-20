import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import appColors from '../../assets/colors';
import AppTitle from '../../components/AppTitle/AppTitle';
import Footer from '../../components/Footer';
import {useLeaderboard, useUser, useWorkouts} from '../../hooks';

import {WorkoutProgram} from '../../types/workout.types';
import MotivationalQuoteCard from './component/MotivationalQuoteCard';
import TodayStatsSection from './component/TodayStatsSection';
import QuickProgramsSection from './component/QuickProgramsSection';
import WeeklyStatsSection from './component/WeeklyStatsSection';
import LeaderboardSection from './component/LeaderboardSection';
import RecentWorkoutsSection from './component/RecentWorkoutsSection';
import {Stats} from '../../types/user.types';
import FadeInView from '../../components/FadeInView/FadeInView';
import AppRefreshControl from '../../components/AppRefreshControl/AppRefreshControl';

const motivationalQuotes = [
  '💪 Chaque pompe est un pas vers la meilleure version de toi-même',
  '🔥 La discipline bat le talent quand le talent ne travaille pas',
  '⚡ Tu es plus fort que tu ne le penses',
  "🏆 Le seul mauvais entraînement est celui que tu n'as pas fait",
  "💯 Transforme la sueur d'aujourd'hui en force de demain",
  "🚀 Les champions s'entraînent, les légendes ne s'arrêtent jamais",
];

const HomeScreen = () => {
  const [todayStats, setTodayStats] = useState<Stats | null>(null);
  const [weekStats, setWeekStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation<any>();
  const {getStats, user} = useUser();
  const {leaderboard, refreshLeaderboard} = useLeaderboard();
  const {
    workouts,
    isLoading: workoutsLoading,
    loadWorkouts,
    toggleLike,
  } = useWorkouts();
  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
  );

  useEffect(() => {
    if (user?.id) {
      fetchData(user?.id);
    }
  }, [user]);

  const fetchData = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      try {
        const [week, today] = await Promise.all([
          getStats('week'),
          getStats('today'),
        ]);
        setWeekStats(week);
        setTodayStats(today);

        // Charger les workouts uniquement si userId est dispo
        await loadWorkouts(userId);

        refreshLeaderboard();
      } catch (err) {
        console.error('[HomeScreen] Error fetching data', err);
      } finally {
        setIsLoading(false);
      }
    },
    [getStats, loadWorkouts, refreshLeaderboard],
  );

  const handleProgramPress = (program: WorkoutProgram) => {
    navigation.navigate('PushUp', {
      screen: 'Libre',
      params: {programId: program.id},
    });
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  const handleViewAllLeaderboard = () => {
    navigation.navigate('LeaderboardDetail');
  };

  const handleViewAllWorkouts = () => {
    navigation.navigate('WorkoutSessions');
  };

  const onRefresh = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    await fetchData(user.id);
    setIsLoading(false);
  }, [fetchData, user]);

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradientContainer}>
      <FadeInView>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <AppRefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }>
          <View style={styles.header}>
            <AppTitle
              greeting="Salut Champion! 👋"
              subGreeting="Prêt à repousser tes limites?"
              onIconPress={handleNotificationPress}
            />
          </View>

          <MotivationalQuoteCard quote={currentQuote} />

          <TodayStatsSection stats={todayStats} />

          <QuickProgramsSection onProgramPress={handleProgramPress} />

          <WeeklyStatsSection stats={weekStats} />

          <RecentWorkoutsSection
            sessions={workouts}
            isLoading={workoutsLoading}
            onLike={toggleLike}
            onViewAll={handleViewAllWorkouts}
            classname={styles.workoutsSection}
          />

          <LeaderboardSection
            leaderboard={leaderboard}
            onViewAll={handleViewAllLeaderboard}
          />

          <Footer variant="app" />

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </FadeInView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  bottomSpacing: {
    height: 60,
  },
  workoutsSection: {
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
