import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, RefreshControl} from 'react-native';
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
import FadeInView from '../../components/FadeInView/FadeInView';

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
  const {leaderboard} = useLeaderboard();
  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
  );
  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]); // ne s'exécute que quand user est défini

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const [week, today] = await Promise.all([
        getStats('week'),
        getStats('today'),
      ]);
      setWeekStats(week);
      setTodayStats(today);
    } catch (err) {
      console.error('[HomeScreen] Error fetching stats', err);
    } finally {
      setIsLoading(false);
    }
  }, [getStats]);

  const handleProgramPress = (program: WorkoutProgram) => {
    // Navigue vers l'écran d'entraînement avec le programme par défaut
    // "PushUp" est le nom du Tab qui contient le TrainingStack
    navigation.navigate('PushUp', {
      screen: 'Libre',
      params: {programId: program.id},
    });
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  const onRefresh = useCallback(async () => {
    setIsLoading(true);
    await fetchStats();
    setIsLoading(false);
  }, [fetchStats]);

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
            <RefreshControl
              refreshing={isLoading}
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
});

export default HomeScreen;
