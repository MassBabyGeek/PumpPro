import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {GradientButton} from '../../components';

interface ChallengeResultsParams {
  pushUpCount: number;
  duration: number;
  goal: number;
}

const ChallengeResultsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {pushUpCount, duration, goal} = route.params as ChallengeResultsParams;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Séquence d'animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleCreateAccount = () => {
    // Navigate to Auth stack, which will show SignUp
    navigation.navigate('Auth', {screen: 'SignUp'});
  };

  const handleLogin = () => {
    // Navigate to Auth stack, which will show Login
    navigation.navigate('Auth', {screen: 'Login'});
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcul des calories brûlées (0.29 cal par pompe)
  const calories = Math.round(pushUpCount * 0.29);

  // Stats comparatives (simulées pour la démo)
  const averageTime = 52; // Moyenne des nouveaux utilisateurs
  const performanceRatio = (averageTime / duration) * 100;
  const isAboveAverage = duration < averageTime;

  const features = [
    {
      icon: 'barbell-outline',
      title: '50+ Programmes',
      description: "Plans d'entraînement personnalisés",
    },
    {
      icon: 'trending-up-outline',
      title: 'Suivi de Progression',
      description: 'Graphiques et statistiques détaillés',
    },
    {
      icon: 'trophy-outline',
      title: 'Défis Communautaires',
      description: 'Compétitions et événements',
    },
    {
      icon: 'podium-outline',
      title: 'Classement Global',
      description: 'Compare-toi aux meilleurs',
    },
  ];

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradientContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* Celebration Header */}
        <Animated.View
          style={[styles.celebrationContainer, {opacity: fadeAnim}]}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationTitle}>Bravo !</Text>
          <Text style={styles.celebrationSubtitle}>
            Tu as complété ton premier défi
          </Text>
        </Animated.View>

        {/* Main Stats Card */}
        <Animated.View
          style={[
            styles.statsCard,
            {
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <LinearGradient
            colors={[appColors.primary, appColors.accent]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.statsGradient}>
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>{pushUpCount}</Text>
              <Text style={styles.mainStatLabel}>pompes</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsRow}>
              <View style={styles.secondaryStat}>
                <Icon name="time-outline" size={24} color="#FFFFFF" />
                <Text style={styles.secondaryStatValue}>
                  {formatTime(duration)}
                </Text>
                <Text style={styles.secondaryStatLabel}>temps</Text>
              </View>
              <View style={styles.secondaryStat}>
                <Icon name="flame-outline" size={24} color="#FFFFFF" />
                <Text style={styles.secondaryStatValue}>{calories}</Text>
                <Text style={styles.secondaryStatLabel}>calories</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Performance Comparison */}
        <Animated.View
          style={[
            styles.comparisonCard,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <View style={styles.comparisonHeader}>
            <Icon
              name={isAboveAverage ? 'trending-up' : 'flash-outline'}
              size={24}
              color={isAboveAverage ? appColors.success : appColors.primary}
            />
            <Text style={styles.comparisonTitle}>
              {isAboveAverage
                ? 'Meilleur que la moyenne !'
                : 'Bon début !'}
            </Text>
          </View>
          <Text style={styles.comparisonText}>
            {isAboveAverage
              ? `Tu es ${Math.round(performanceRatio - 100)}% plus rapide que la moyenne des nouveaux utilisateurs`
              : 'La moyenne des nouveaux est de 52 secondes. Continue pour progresser !'}
          </Text>
        </Animated.View>

        {/* Unlock Features */}
        <Animated.View
          style={[
            styles.unlockSection,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Text style={styles.unlockTitle}>
            Crée ton compte pour débloquer :
          </Text>

          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Icon name={feature.icon} size={28} color={appColors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
              <Icon
                name="lock-closed"
                size={20}
                color={appColors.textSecondary}
              />
            </View>
          ))}
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View
          style={[
            styles.ctaContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <GradientButton
            text="Créer mon compte 🚀"
            onPress={handleCreateAccount}
            paddingHorizontal={40}
            paddingVertical={18}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.7}>
            <Text style={styles.loginButtonText}>J'ai déjà un compte</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Skip for now */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('Welcome')}
          activeOpacity={0.7}>
          <Text style={styles.skipText}>Peut-être plus tard</Text>
        </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  celebrationTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: 18,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
  statsCard: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: appColors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  statsGradient: {
    padding: 30,
    alignItems: 'center',
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainStatValue: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 80,
  },
  mainStatLabel: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.9,
  },
  statsDivider: {
    width: 60,
    height: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
    marginVertical: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 30,
  },
  secondaryStat: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  secondaryStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryStatLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  comparisonCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: appColors.border + '40',
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  comparisonText: {
    fontSize: 15,
    color: appColors.textSecondary,
    lineHeight: 22,
  },
  unlockSection: {
    marginBottom: 30,
  },
  unlockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: appColors.border + '40',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: appColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: appColors.textSecondary,
  },
  ctaContainer: {
    gap: 16,
    marginBottom: 20,
  },
  loginButton: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: appColors.backgroundLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.border + '60',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
});

export default ChallengeResultsScreen;
