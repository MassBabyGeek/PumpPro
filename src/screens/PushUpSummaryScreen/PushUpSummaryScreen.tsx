import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../components/GradientButton/GradientButton';
import appColors from '../../assets/colors';
import {
  PushUpSummaryScreenRouteProp,
  PushUpSummaryScreenNavigationProp,
} from '../../types/navigation.types';
import {workoutService} from '../../services/api';
import SuccessHeader from './component/SuccessHeader';
import MainStatsGrid from './component/MainStatsGrid';
import SetsDetailSection from './component/SetsDetailSection';
import MotivationCard from './component/MotivationCard';
import {useAuth, useChallenges} from '../../hooks';
import useWorkoutSession from '../../hooks/useWorkoutSession';

type Props = {
  route: PushUpSummaryScreenRouteProp;
  navigation: PushUpSummaryScreenNavigationProp;
};

const PushUpSummaryScreen = ({route, navigation}: Props) => {
  const {getToken} = useAuth();
  const {session, challengeId, taskId} = route.params;
  const {programId, totalReps, totalDuration, completed, sets} = session;
  const calories = Math.round(totalReps * 0.5);
  const [notes, setNotes] = useState('');

  // Only use challenge hooks if there's a challengeId
  const challengeHooks = useChallenges(challengeId);
  const {
    completeTask,
    isChallengeCompleted,
    getChallengeById,
    completeChallenge,
  } = challengeHooks || {};

  const {saveWorkoutSession} = useWorkoutSession();

  const handleDone = async () => {
    const token = await getToken();
    if (challengeId) {
      // ⚠️ Vérifier si l'objectif a été atteint
      if (!completed) {
        console.log(
          '[PushUpSummary] ❌ Objectif non atteint, retour sans validation',
        );
        navigation.navigate('Training');
        return;
      }

      if (taskId) {
        // Challenge avec tasks: marquer la tâche comme complétée
        console.log(
          '[PushUpSummary] ✅ Objectif atteint! Completing task:',
          taskId,
        );
        completeTask(challengeId, taskId, session.totalReps);

        // Vérifier si le challenge est complètement terminé
        const isFullyCompleted = isChallengeCompleted(challengeId);
        console.log(
          '[PushUpSummary] Is challenge fully completed?',
          isFullyCompleted,
        );

        if (isFullyCompleted) {
          // Challenge terminé: naviguer vers l'écran de félicitations
          const challenge = getChallengeById(challengeId);
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
          // Il reste des tâches: retour au détail du challenge
          console.log(
            '[PushUpSummary] Task completed, returning to ChallengeDetail',
          );
          navigation.navigate('Training');
        }
      } else {
        // Challenge sans tasks (simple challenge): marquer comme complété et aller aux félicitations
        console.log(
          '[PushUpSummary] ✅ Simple challenge completed, marking as completed',
        );
        completeChallenge(challengeId);

        const challenge = getChallengeById(challengeId);
        console.log('[PushUpSummary] 🎉 Navigating to ChallengeCompletion');

        navigation.navigate('ChallengeCompletion', {
          challengeId,
          totalReps: session.totalReps,
          totalDuration: session.totalDuration,
          earnedPoints: challenge?.points || 0,
        });
      }
    } else {
      // Mode normal (pas de challenge): retour au training
      console.log('[PushUpSummary] Normal mode, navigating to Training');
      await workoutService.saveWorkoutSession(
        {
          endTime: new Date(),
          ...session,
          notes,
        },
        token || undefined,
      );
      navigation.navigate('Training');
    }
  };

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradientContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* ✅ Icône ou logo de succès */}
        <SuccessHeader completed={completed} programId={programId} />

        {/* Stats principales */}
        <MainStatsGrid
          totalReps={totalReps}
          totalDuration={totalDuration}
          calories={calories}
        />

        {/* Détails des séries */}
        <SetsDetailSection sets={sets} />

        {/* Motivation */}
        <MotivationCard totalReps={totalReps} />

        {/* Notes section */}
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes sur la session</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Ajoutez une note sur votre session... (optionnel)"
            placeholderTextColor={`${appColors.textSecondary}80`}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        {/* Boutons */}
        <View style={styles.buttonContainer}>
          <GradientButton
            text="Retour"
            icon="arrow-back"
            onPress={handleDone}
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
  notesContainer: {
    width: '100%',
    backgroundColor: `${appColors.border}30`,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: `${appColors.background}80`,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: appColors.textPrimary,
    minHeight: 100,
    borderWidth: 1,
    borderColor: `${appColors.border}50`,
  },
});

export default PushUpSummaryScreen;
