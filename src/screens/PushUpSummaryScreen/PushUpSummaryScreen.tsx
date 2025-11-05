import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import GradientButton from '../../components/GradientButton/GradientButton';
import appColors from '../../assets/colors';
import {
  PushUpSummaryScreenRouteProp,
  PushUpSummaryScreenNavigationProp,
} from '../../types/navigation.types';
import {workoutService} from '../../services/api';
import {useChallenges} from '../../hooks';

type Props = {
  route: PushUpSummaryScreenRouteProp;
  navigation: PushUpSummaryScreenNavigationProp;
};

const PushUpSummaryScreen = ({route, navigation}: Props) => {
  const {session, challengeId, taskId} = route.params;
  const {programId, totalReps, totalDuration, completed, sets} = session;
  const calories = Math.round(totalReps * 0.29);
  const [notes, setNotes] = useState('');

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

  // Only use challenge hooks if there's a challengeId
  const challengeHooks = useChallenges(challengeId);
  const {
    completeTask,
    isChallengeCompleted,
    getChallengeById,
    completeChallenge,
  } = challengeHooks || {};

  const handleDone = async () => {
    // Sauvegarder la session workout (même pour les challenges)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {programId: _pid, ...sessionWithoutProgramId} = session;

      const sessionToSave = challengeId
        ? {
            endTime: new Date(),
            ...sessionWithoutProgramId,
            programId: undefined as any,
            notes,
          }
        : {
            endTime: new Date(),
            ...session,
            notes,
          };

      await workoutService.saveWorkoutSession(sessionToSave as any);
      console.log('[PushUpSummary] ✅ Session saved successfully');
    } catch (error) {
      console.error('[PushUpSummary] ❌ Error saving session:', error);
    }

    if (challengeId) {
      if (!completed) {
        console.log(
          '[PushUpSummary] ❌ Objectif non atteint, retour sans validation',
        );
        navigation.navigate('Training');
        return;
      }

      if (taskId) {
        console.log(
          '[PushUpSummary] ✅ Objectif atteint! Completing task:',
          taskId,
        );
        completeTask(challengeId, taskId, session.totalReps);

        const isFullyCompleted = isChallengeCompleted(challengeId);
        console.log(
          '[PushUpSummary] Is challenge fully completed?',
          isFullyCompleted,
        );

        if (isFullyCompleted) {
          const challenge = await getChallengeById(challengeId);
          console.log(
            '[PushUpSummary] 🎉 All tasks completed! Navigating to ChallengeCompletion',
          );

          navigation.navigate('ChallengeCompletion', {
            challengeId,
            totalReps: session.totalReps,
            totalDuration: session.totalDuration,
            earnedPoints: challenge?.points || 0,
          });
        } else {
          console.log(
            '[PushUpSummary] Task completed, returning to ChallengeDetail',
          );
          navigation.navigate('Training');
        }
      } else {
        console.log(
          '[PushUpSummary] ✅ Simple challenge completed, marking as completed',
        );
        completeChallenge(challengeId);

        const challenge = await getChallengeById(challengeId);
        console.log('[PushUpSummary] 🎉 Navigating to ChallengeCompletion');

        navigation.navigate('ChallengeCompletion', {
          challengeId,
          totalReps: session.totalReps,
          totalDuration: session.totalDuration,
          earnedPoints: challenge?.points || 0,
        });
      }
    } else {
      console.log('[PushUpSummary] Normal mode, navigating to Training');
      navigation.navigate('Training');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcul de la cadence (pompes/min)
  const repsPerMin =
    totalDuration > 0
      ? Math.round((totalReps / (totalDuration / 60)) * 10) / 10
      : 0;

  // Stats comparatives simulées
  const averageRepsPerMin = 15; // Moyenne des utilisateurs
  const performanceRatio = (repsPerMin / averageRepsPerMin) * 100;
  const isAboveAverage = repsPerMin > averageRepsPerMin;

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradientContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled">
        {/* Celebration Header */}
        <Animated.View
          style={[styles.celebrationContainer, {opacity: fadeAnim}]}>
          <Text style={styles.celebrationEmoji}>
            {completed ? '🎉' : '💪'}
          </Text>
          <Text style={styles.celebrationTitle}>
            {completed ? 'Bravo !' : 'Bon effort !'}
          </Text>
          <Text style={styles.celebrationSubtitle}>
            {completed
              ? 'Tu as complété ta session !'
              : 'Continue comme ça !'}
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
              <Text style={styles.mainStatValue}>{totalReps}</Text>
              <Text style={styles.mainStatLabel}>pompes</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsRow}>
              <View style={styles.secondaryStat}>
                <Icon name="time-outline" size={24} color="#FFFFFF" />
                <Text style={styles.secondaryStatValue}>
                  {formatTime(totalDuration)}
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
                ? 'Performance exceptionnelle !'
                : 'Bonne performance !'}
            </Text>
          </View>
          <Text style={styles.comparisonText}>
            {isAboveAverage
              ? `Tu es ${Math.round(performanceRatio - 100)}% plus rapide que la moyenne des utilisateurs (${averageRepsPerMin} pompes/min)`
              : `La moyenne est de ${averageRepsPerMin} pompes/min. Tu fais ${repsPerMin} pompes/min. Continue pour progresser !`}
          </Text>
        </Animated.View>

        {/* Sets Detail */}
        <Animated.View
          style={[
            styles.setsSection,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Text style={styles.setsTitle}>Détails de la session</Text>
          {sets.map((set: any, index: number) => (
            <View key={index} style={styles.setCard}>
              <View style={styles.setHeader}>
                <Text style={styles.setNumber}>Série {index + 1}</Text>
                <Icon
                  name="checkmark-circle"
                  size={20}
                  color={appColors.success}
                />
              </View>
              <View style={styles.setStats}>
                <View style={styles.setStatItem}>
                  <Text style={styles.setStatValue}>{set.reps}</Text>
                  <Text style={styles.setStatLabel}>pompes</Text>
                </View>
                <View style={styles.setStatDivider} />
                <View style={styles.setStatItem}>
                  <Text style={styles.setStatValue}>
                    {formatTime(set.duration)}
                  </Text>
                  <Text style={styles.setStatLabel}>durée</Text>
                </View>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Insights */}
        <Animated.View
          style={[
            styles.insightsSection,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Text style={styles.insightsTitle}>Insights de ta session</Text>

          <View style={styles.insightItem}>
            <View style={styles.insightIconContainer}>
              <Icon name="speedometer-outline" size={28} color={appColors.primary} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightValue}>{repsPerMin} pompes/min</Text>
              <Text style={styles.insightDescription}>Cadence moyenne</Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightIconContainer}>
              <Icon name="barbell-outline" size={28} color={appColors.primary} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightValue}>
                {sets.length} série{sets.length > 1 ? 's' : ''}
              </Text>
              <Text style={styles.insightDescription}>
                Moyenne de {Math.round(totalReps / sets.length)} pompes/série
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightIconContainer}>
              <Icon name="trophy-outline" size={28} color={appColors.primary} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightValue}>
                {completed ? 'Objectif atteint !' : 'Continue !'}
              </Text>
              <Text style={styles.insightDescription}>
                {completed
                  ? 'Tu as terminé toutes les séries'
                  : 'Complète les séries pour valider'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Notes section */}
        <Animated.View
          style={[
            styles.notesContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Text style={styles.notesLabel}>Notes sur la session</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Comment t'es-tu senti ? Ajoute une note... (optionnel)"
            placeholderTextColor={`${appColors.textSecondary}80`}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </Animated.View>

        {/* Boutons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <GradientButton
            text={challengeId ? 'Continuer' : 'Retour'}
            icon={challengeId ? 'arrow-forward' : 'arrow-back'}
            onPress={handleDone}
            paddingHorizontal={40}
            paddingVertical={18}
          />
        </Animated.View>
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
    paddingBottom: 120, // Extra space for tab bar (88) + margin
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
  setsSection: {
    marginBottom: 30,
  },
  setsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 16,
  },
  setCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: appColors.border + '40',
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  setStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  setStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.primary,
    marginBottom: 4,
  },
  setStatLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
  },
  setStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: appColors.border + '40',
  },
  insightsSection: {
    marginBottom: 30,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: appColors.border + '40',
  },
  insightIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: appColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 13,
    color: appColors.textSecondary,
  },
  notesContainer: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: appColors.border + '40',
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: appColors.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: appColors.textPrimary,
    minHeight: 100,
    borderWidth: 1,
    borderColor: appColors.border + '50',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
});

export default PushUpSummaryScreen;
