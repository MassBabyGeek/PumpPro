import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import GradientButton from '../../components/GradientButton/GradientButton';
import appColors from '../../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  PushUpSummaryScreenRouteProp,
  PushUpSummaryScreenNavigationProp,
} from '../../types/navigation.types';
import {formatTime} from '../../utils/workout.utils';
import {TYPE_LABELS, VARIANT_LABELS} from '../../types/workout.types';
import {saveWorkoutSession} from '../../data/workoutPrograms.mock';

type Props = {
  route: PushUpSummaryScreenRouteProp;
  navigation: PushUpSummaryScreenNavigationProp;
};

const PushUpSummaryScreen = ({route, navigation}: Props) => {
  const {session} = route.params;
  const {program, totalReps, totalDuration, completed, sets} = session;
  const calories = Math.round(totalReps * 0.5);

  // Sauvegarder la session au backend
  useEffect(() => {
    const save = async () => {
      try {
        await saveWorkoutSession(session);
      } catch (error) {
        console.error('Error saving session:', error);
      }
    };
    save();
  }, [session]);

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradientContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* 🎉 Animation confettis */}
      {completed && <ConfettiCannon count={2000} origin={{x: 0, y: 0}} fadeOut />}

      {/* ✅ Icône ou logo de succès */}
      <Icon
        name={completed ? 'checkmark-circle' : 'flag'}
        size={100}
        color={completed ? appColors.success : appColors.primary}
      />

      <Text style={styles.title}>
        {completed ? 'Objectif atteint ! 🎯' : 'Session terminée'}
      </Text>

      {/* Info du programme */}
      <View style={styles.programCard}>
        <Text style={styles.programName}>{program.name}</Text>
        <Text style={styles.programType}>
          {TYPE_LABELS[program.type]} • {VARIANT_LABELS[program.variant]}
        </Text>
      </View>

      {/* Stats principales */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="barbell" size={32} color={appColors.primary} />
          <Text style={styles.statValue}>{totalReps}</Text>
          <Text style={styles.statLabel}>Pompes</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="time" size={32} color={appColors.accent} />
          <Text style={styles.statValue}>{formatTime(totalDuration)}</Text>
          <Text style={styles.statLabel}>Durée</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="flame" size={32} color={appColors.error} />
          <Text style={styles.statValue}>{calories}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
      </View>

      {/* Détails des séries */}
      {sets.length > 1 && (
        <View style={styles.setsContainer}>
          <Text style={styles.setsTitle}>Détails des séries</Text>
          {sets.map((set, index) => (
            <View key={index} style={styles.setRow}>
              <Text style={styles.setNumber}>Série {set.setNumber}</Text>
              <Text style={styles.setReps}>
                {set.completedReps}
                {set.targetReps && ` / ${set.targetReps}`} reps
              </Text>
              <Text style={styles.setDuration}>{set.duration}s</Text>
            </View>
          ))}
        </View>
      )}

      {/* Motivation */}
      <View style={styles.motivationCard}>
        <Text style={styles.motivationText}>
          {totalReps >= 100
            ? '🏆 Performance incroyable !'
            : totalReps >= 50
            ? '💪 Excellent travail !'
            : totalReps >= 20
            ? '👍 Bon effort !'
            : '🎯 Continue comme ça !'}
        </Text>
      </View>

      {/* Boutons */}
      <View style={styles.buttonContainer}>
        <GradientButton
          text="Retour"
          icon="arrow-back"
          onPress={() => navigation.navigate('Training')}
        />
      </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: appColors.primary,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
  },
  programCard: {
    backgroundColor: `${appColors.border}30`,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  programName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  programType: {
    fontSize: 14,
    color: appColors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: `${appColors.border}30`,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
  },
  setsContainer: {
    width: '100%',
    backgroundColor: `${appColors.border}30`,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  setsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 12,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: `${appColors.border}50`,
  },
  setNumber: {
    fontSize: 14,
    color: appColors.textSecondary,
    flex: 1,
  },
  setReps: {
    fontSize: 14,
    color: appColors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  setDuration: {
    fontSize: 14,
    color: appColors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  motivationCard: {
    backgroundColor: `${appColors.primary}20`,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  motivationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.primary,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
});

export default PushUpSummaryScreen;
