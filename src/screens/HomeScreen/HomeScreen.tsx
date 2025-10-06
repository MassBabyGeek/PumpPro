import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import appColors from '../../assets/colors';
import StatCard from '../../components/StatCard/StatCard';

const {width} = Dimensions.get('window');

// Mock data - À remplacer par de vraies données utilisateur
const userStats = {
  todayPushUps: 45,
  weeklyTotal: 287,
  personalBest: 62,
  weekStreak: 12,
  averagePerDay: 41,
  totalAllTime: 3420,
};

const leaderboard = [
  {id: 1, name: 'Alex M.', score: 892, rank: 1},
  {id: 2, name: 'Sarah K.', score: 854, rank: 2},
  {id: 3, name: 'Mike R.', score: 831, rank: 3},
  {id: 4, name: 'Emma L.', score: 789, rank: 4},
  {id: 5, name: 'Tom W.', score: 756, rank: 5},
];

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
  },
  {
    id: 2,
    title: 'Challenge 50',
    description: '50 pompes en série',
    reps: 50,
    icon: 'flame',
    color: appColors.error,
  },
  {
    id: 3,
    title: 'Endurance',
    description: '100 pompes (séries)',
    reps: 100,
    icon: 'trophy',
    color: appColors.success,
  },
];

const HomeScreen = () => {
  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header avec salutation */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Salut Champion! 👋</Text>
          <Text style={styles.subGreeting}>Prêt à repousser tes limites?</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="notifications-outline" size={24} color={appColors.icon} />
        </TouchableOpacity>
      </View>

      {/* Citation motivante */}
      <LinearGradient
        colors={[`${appColors.primary}15`, `${appColors.accent}15`]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.quoteCard}>
        <Icon
          name="chatbox-ellipses"
          size={24}
          color={appColors.primary}
          style={styles.quoteIcon}
        />
        <Text style={styles.quoteText}>{currentQuote}</Text>
      </LinearGradient>

      {/* Stats du jour */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Aujourd'hui</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="fitness"
            label="Pompes"
            value={userStats.todayPushUps}
            color={appColors.primary}
          />
          <StatCard
            icon="flame"
            label="Série actuelle"
            value={userStats.weekStreak}
            unit="jours"
            color={appColors.error}
          />
        </View>
      </View>

      {/* Programmes rapides */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Démarrage rapide</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.programsScroll}>
          {quickPrograms.map(program => (
            <TouchableOpacity key={program.id} activeOpacity={0.8}>
              <LinearGradient
                colors={[`${program.color}20`, `${program.color}30`]}
                style={styles.programCard}>
                <Icon
                  name={program.icon}
                  size={32}
                  color={program.color}
                  style={styles.programIcon}
                />
                <Text style={styles.programTitle}>{program.title}</Text>
                <Text style={styles.programDescription}>
                  {program.description}
                </Text>
                <View style={styles.programBadge}>
                  <Text style={[styles.programReps, {color: program.color}]}>
                    {program.reps} reps
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats hebdomadaires */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Cette semaine</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="bar-chart"
            label="Total"
            value={userStats.weeklyTotal}
            color={appColors.success}
          />
          <StatCard
            icon="trending-up"
            label="Moyenne/jour"
            value={userStats.averagePerDay}
            color={appColors.accent}
          />
        </View>
        <View style={[styles.statsGrid, {marginTop: 12}]}>
          <StatCard
            icon="trophy"
            label="Record perso"
            value={userStats.personalBest}
            color={appColors.warning}
          />
          <StatCard
            icon="stats-chart"
            label="Total"
            value={userStats.totalAllTime}
            color={appColors.primary}
          />
        </View>
      </View>

      {/* Classement */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏆 Classement hebdo</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.leaderboardCard}>
          {leaderboard.map((user, index) => (
            <View
              key={user.id}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  quoteIcon: {
    marginRight: 12,
    width: 24,
    height: 24,
  },
  quoteText: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    fontSize: 15,
    lineHeight: 22,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: appColors.primary,
    fontWeight: '600',
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
  programCard: {
    width: width * 0.4,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
  },
  programIcon: {
    marginBottom: 8,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  programDescription: {
    fontSize: 12,
    color: appColors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  programBadge: {
    backgroundColor: `${appColors.background}80`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  programReps: {
    fontSize: 13,
    fontWeight: 'bold',
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
