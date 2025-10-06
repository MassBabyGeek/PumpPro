import React, {useState} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import appColors from '../../assets/colors';
import StatCard from '../../components/StatCard/StatCard';
import AppTitle from '../../components/AppTitle/AppTitle';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import ProgramCard from '../../components/ProgramCard/ProgramCard';
import {useUserStats, useLeaderboard} from '../../hooks';
import {WorkoutProgram} from '../../types/workout.types';
import {
  ALL_PROGRAMS,
  TARGET_100_REPS,
  TARGET_20_REPS,
  TARGET_50_REPS,
} from '../../data/workoutPrograms.mock';

const motivationalQuotes = [
  '💪 Chaque pompe est un pas vers la meilleure version de toi-même',
  '🔥 La discipline bat le talent quand le talent ne travaille pas',
  '⚡ Tu es plus fort que tu ne le penses',
  "🏆 Le seul mauvais entraînement est celui que tu n'as pas fait",
  "💯 Transforme la sueur d'aujourd'hui en force de demain",
  "🚀 Les champions s'entraînent, les légendes ne s'arrêtent jamais",
];

const quickPrograms = [
  {
    id: 1,
    title: 'Quick 20',
    description: '20 pompes rapides',
    reps: 20,
    icon: 'flash',
    color: appColors.warning,
    type: TARGET_20_REPS,
  },
  {
    id: 2,
    title: 'Challenge 50',
    description: '50 pompes en série',
    reps: 50,
    icon: 'flame',
    color: appColors.error,
    type: TARGET_50_REPS,
  },
  {
    id: 3,
    title: 'Endurance',
    description: '100 pompes (séries)',
    reps: 100,
    icon: 'trophy',
    color: appColors.success,
    type: TARGET_100_REPS,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const {stats} = useUserStats();
  const {leaderboard} = useLeaderboard();
  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
  );

  const handleProgramPress = (program: WorkoutProgram) => {
    // Navigue vers l'écran d'entraînement avec le programme par défaut
    // "PushUp" est le nom du Tab qui contient le TrainingStack
    console.log('Pressed program:', program);
    navigation.navigate('PushUp', {
      screen: 'Libre',
      params: {program},
    });
  };

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradientContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Header avec salutation */}
        <View style={styles.header}>
          <AppTitle
            greeting="Salut Champion! 👋"
            subGreeting="Prêt à repousser tes limites?"
          />
        </View>

        {/* Citation motivante */}
        <LinearGradient
          colors={[`${appColors.primary}15`, `${appColors.accent}15`]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.quoteCard}>
          <View style={styles.quoteContent}>
            <Icon
              name="chatbox-ellipses"
              size={24}
              color={appColors.primary}
              style={styles.quoteIcon}
            />
            <Text style={styles.quoteText}>{currentQuote}</Text>
          </View>
        </LinearGradient>

        {/* Stats du jour */}
        <View style={styles.section}>
          <SectionTitle title="📊 Aujourd'hui" />
          <View style={styles.statsGrid}>
            <StatCard
              icon="fitness"
              label="Pompes"
              value={stats.todayPushUps}
              color={appColors.primary}
            />
            <StatCard
              icon="flame"
              label="Série actuelle"
              value={stats.weekStreak}
              unit="jours"
              color={appColors.error}
            />
          </View>
        </View>

        {/* Programmes rapides */}
        <View style={styles.section}>
          <SectionTitle title="⚡ Démarrage rapide" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.programsScroll}>
            {quickPrograms.map(program => (
              <ProgramCard
                key={program.id}
                title={program.title}
                description={program.description}
                reps={program.reps}
                icon={program.icon}
                color={program.color}
                onPress={() => handleProgramPress(program.type)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Stats hebdomadaires */}
        <View style={styles.section}>
          <SectionTitle title="📈 Cette semaine" />
          <View style={styles.statsGrid}>
            <StatCard
              icon="bar-chart"
              label="Total"
              value={stats.weeklyTotal}
              color={appColors.success}
            />
            <StatCard
              icon="trending-up"
              label="Moyenne/jour"
              value={stats.averagePerDay}
              color={appColors.accent}
            />
          </View>
          <View style={[styles.statsGrid, {marginTop: 12}]}>
            <StatCard
              icon="trophy"
              label="Record perso"
              value={stats.personalBest}
              color={appColors.warning}
            />
            <StatCard
              icon="stats-chart"
              label="Total"
              value={stats.totalAllTime}
              color={appColors.primary}
            />
          </View>
        </View>

        {/* Classement */}
        <View style={styles.section}>
          <SectionTitle
            title="🏆 Classement hebdo"
            actionText="Voir tout"
            onActionPress={() => {}}
          />
          <View style={styles.leaderboardCard}>
            {leaderboard.map((user, index) => (
              <View
                key={user.id}
                style={[
                  styles.leaderboardItem,
                  index === leaderboard.length - 1 &&
                    styles.leaderboardItemLast,
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
                  <Text style={styles.leaderboardName}>{user.name}</Text>
                </View>
                <Text style={styles.leaderboardScore}>{user.score} 💪</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>PompeurPro © 2025</Text>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>
            Propulsé par la Vision AI • Made with 💪
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  subGreeting: {
    fontSize: 14,
    color: appColors.textSecondary,
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${appColors.border}50`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  quoteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '100%',
  },
  quoteIcon: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    fontSize: 15,
    lineHeight: 22,
    color: appColors.textPrimary,
    fontWeight: '500',
    width: '85%',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  programsScroll: {
    gap: 12,
    paddingRight: 20,
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
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 40,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: appColors.textSecondary,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default HomeScreen;
