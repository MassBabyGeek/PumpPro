import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../components/GradientButton/GradientButton';
import appColors from '../../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useChallenges} from '../../hooks';
import {formatTime} from '../../utils/workout.utils';
import {getValidIconName} from '../../utils/iconMapper';
import {RouteProp} from '@react-navigation/native';
import {
  ChallengeScreenNavigationProp,
  TrainingStackParamList,
} from '../../types/navigation.types';

type ChallengeCompletionScreenRouteProp = RouteProp<
  TrainingStackParamList,
  'ChallengeCompletion'
>;

const ChallengeCompletionScreen = () => {
  const route = useRoute<ChallengeCompletionScreenRouteProp>();
  const navigation = useNavigation<ChallengeScreenNavigationProp>();
  const {challengeId, totalReps, totalDuration} = route.params;

  const {selectedChallenge} = useChallenges(challengeId);
  const challenge = selectedChallenge;

  const HandleDone = () => {
    console.log(
      '[ChallengeCompletion] Navigating back to ChallengeDetail:',
      challengeId,
    );
    // Retourner vers le tab Challenges puis vers ChallengeDetail
    // On doit remonter au parent (TabNavigator) puis naviguer vers Challenges
    const parentNav = navigation.getParent();
    if (parentNav) {
      console.log(
        '[ChallengeCompletion] Using parent navigator to go to Challenges tab',
      );
      parentNav.navigate('Challenges', {
        screen: 'ChallengeDetail',
        params: {challengeId},
      } as never);
    } else {
      console.error(
        '[ChallengeCompletion] Parent navigator not found, navigating to Training',
      );
      navigation.navigate('Training' as never);
    }
  };

  if (!challenge) {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.gradient}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color={appColors.error} />
          <Text style={styles.errorText}>Challenge non trouvé</Text>
          <GradientButton
            text="Retour"
            icon="arrow-back"
            onPress={() => navigation.navigate('Training' as never)}
          />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradient}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Icon du challenge avec animation */}

        <LinearGradient
          colors={[challenge.iconColor, `${challenge.iconColor}AA`]}
          style={styles.iconGradient}>
          <Icon
            name={getValidIconName(challenge.iconName)}
            size={80}
            color={appColors.textPrimary}
          />
        </LinearGradient>

        {/* Titre de félicitations */}
        <Text style={styles.congratsText}>Bravo ! Challenge terminé !</Text>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>

        {/* Points gagnés */}
        <View style={styles.pointsContainer}>
          <Icon name="trophy" size={48} color={appColors.warning} />
          <View style={styles.pointsTextContainer}>
            <Text style={styles.pointsLabel}>points gagnés</Text>
          </View>
        </View>

        {/* Récapitulatif */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Récapitulatif</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="fitness" size={32} color={appColors.primary} />
              <Text style={styles.statValue}>{totalReps}</Text>
              <Text style={styles.statLabel}>Pompes totales</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="time" size={32} color={appColors.accent} />
              <Text style={styles.statValue}>{formatTime(totalDuration)}</Text>
              <Text style={styles.statLabel}>Temps total</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="flame" size={32} color={appColors.error} />
              <Text style={styles.statValue}>
                {Math.round(totalReps * 0.5)}
              </Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>

            <View style={styles.statCard}>
              <Icon
                name="checkmark-circle"
                size={32}
                color={appColors.success}
              />
              <Text style={styles.statValue}>
                {challenge.challengeTasks?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Étapes</Text>
            </View>
          </View>
        </View>

        {/* Message de motivation */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            Félicitations pour votre persévérance ! Vous avez complété toutes
            les étapes du challenge. Continuez comme ça !
          </Text>
        </View>

        {/* Bouton retour */}
        <View style={styles.buttonContainer}>
          <GradientButton
            text="Retour aux challenges"
            icon="trophy"
            onPress={HandleDone}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  congratsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: appColors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: appColors.textPrimary,
    textAlign: 'center',
    marginBottom: 32,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${appColors.warning}20`,
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    gap: 16,
  },
  pointsTextContainer: {
    alignItems: 'flex-start',
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: appColors.warning,
  },
  pointsLabel: {
    fontSize: 14,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  summaryContainer: {
    width: '100%',
    backgroundColor: `${appColors.border}20`,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: `${appColors.border}30`,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
  motivationCard: {
    backgroundColor: `${appColors.primary}15`,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    borderWidth: 1,
    borderColor: `${appColors.primary}30`,
  },
  motivationText: {
    fontSize: 16,
    color: appColors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: appColors.error,
    fontWeight: '600',
  },
});

export default ChallengeCompletionScreen;
