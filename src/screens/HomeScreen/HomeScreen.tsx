import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import appColors from '../../assets/colors';
import AppTitle from '../../components/AppTitle/AppTitle';
import Footer from '../../components/Footer';
import {useLeaderboard, useUser} from '../../hooks';

import {WorkoutProgram} from '../../types/workout.types';
import MotivationalQuoteCard from './component/MotivationalQuoteCard';
import TodayStatsSection from './component/TodayStatsSection';
import QuickProgramsSection from './component/QuickProgramsSection';
import WeeklyStatsSection from './component/WeeklyStatsSection';
import LeaderboardSection from './component/LeaderboardSection';
import {Stats} from '../../types/user.types';

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
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<any>();
  const {getStats} = useUser();
  const {leaderboard} = useLeaderboard();
  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
  );

  useEffect(() => {
    getStats('week')
      .then(setWeekStats)
      .finally(() => setIsLoading(false));
    getStats('today')
      .then(setTodayStats)
      .finally(() => setIsLoading(false));
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const [week, today] = await Promise.all([
        getStats('week'),
        getStats('today'),
      ]);
      setWeekStats(week);
      setTodayStats(today);
    } catch (err) {
      console.error('Error fetching stats', err);
    }
  }, [getStats]);

  const handleProgramPress = (program: WorkoutProgram) => {
    // Navigue vers l'écran d'entraînement avec le programme par défaut
    // "PushUp" est le nom du Tab qui contient le TrainingStack
    navigation.navigate('PushUp', {
      screen: 'Libre',
      params: {program},
    });
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, [fetchStats]);

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradientContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appColors.primary]}
            progressBackgroundColor={'black'}
          />
        }>
        {/* Header avec salutation */}
        <View style={styles.header}>
          <AppTitle
            greeting="Salut Champion! 👋"
            subGreeting="Prêt à repousser tes limites?"
            onIconPress={handleNotificationPress}
          />
        </View>

        {/* Citation motivante */}
        <MotivationalQuoteCard quote={currentQuote} />

        {/* Stats du jour */}
        <TodayStatsSection stats={todayStats} />

        {/* Programmes rapides */}
        <QuickProgramsSection onProgramPress={handleProgramPress} />

        {/* Stats hebdomadaires */}
        <WeeklyStatsSection stats={weekStats} />

        {/* Classement */}
        <LeaderboardSection leaderboard={leaderboard} onViewAll={() => {}} />

        {/* Footer info */}
        <Footer variant="app" />

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    height: 100,
  },
});

export default HomeScreen;
