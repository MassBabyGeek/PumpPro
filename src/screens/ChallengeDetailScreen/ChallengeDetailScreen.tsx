import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute, useNavigation} from '@react-navigation/native';
import appColors from '../../assets/colors';
import {useChallenges} from '../../hooks';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import {GradientButton} from '../../components';
import {ChallengeTask} from '../../types/challenge.types';
import {WorkoutProgram} from '../../types/workout.types';
import ChallengeInfoSection from './component/ChallengeInfoSection';
import StatsGrid from './component/StatsGrid';
import TasksSection from './component/TasksSection';
import LoaderScreen from '../LoaderScreen/LoaderScreen';

const ChallengeDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {challengeId} = route.params;

  const {
    isLoading,
    selectedChallenge,
    refreshChallengesById,
    getChallengeProgress,
    convertTaskToProgram,
    convertChallengeToProgram,
  } = useChallenges(challengeId);

  useEffect(() => {
    console.log('[ChallengeDetail] selectedChallenge:', selectedChallenge);
  }, [selectedChallenge]);

  const progress = getChallengeProgress(challengeId);

  if (isLoading) {
    return <LoaderScreen />;
  }

  if (!selectedChallenge) {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => refreshChallengesById(challengeId)}
              tintColor={appColors.primary}
            />
          }>
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={64} color={appColors.error} />
            <Text style={styles.errorText}>Challenge non trouvé</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  const completedTasks =
    selectedChallenge.challengeTasks?.filter(t => t.userProgress?.completed).length || 0;
  const totalTasks = selectedChallenge.challengeTasks?.length || 0;

  const handleTaskPress = (task: ChallengeTask | null) => {
    if (task && (task.userProgress?.completed || task.isLocked)) {
      return;
    }

    let program: WorkoutProgram | null = null;
    let currentTaskId: string | undefined;

    if (task) {
      // Challenge avec tasks: convertir la tâche en programme
      program = convertTaskToProgram(task, selectedChallenge.difficulty);
      currentTaskId = task.id;
      console.log(
        '[ChallengeDetail] Starting task:',
        task.title,
        'with program:',
        program,
      );
    } else {
      // Challenge sans tasks: convertir le challenge directement
      program = convertChallengeToProgram(selectedChallenge);
      console.log(
        '[ChallengeDetail] Starting simple challenge:',
        selectedChallenge.title,
        'with program:',
        program,
      );
    }

    // Naviguer vers PushUpScreen avec les params challenge
    navigation.navigate('PushUp', {
      screen: 'Libre',
      params: {
        program,
        challengeId: selectedChallenge.id,
        taskId: currentTaskId,
      },
    });
  };

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradient}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => refreshChallengesById(challengeId)}
            tintColor={appColors.primary}
          />
        }>
        {/* Header */}
        <View style={styles.header}>
          <Icon
            name="arrow-back"
            size={28}
            color={appColors.textPrimary}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>

        {/* Challenge Info */}
        <ChallengeInfoSection
          iconName={selectedChallenge.iconName}
          iconColor={selectedChallenge.iconColor}
          title={selectedChallenge.title}
          description={selectedChallenge.description}
          difficulty={selectedChallenge.difficulty}
          points={selectedChallenge.points}
          isOfficial={selectedChallenge.isOfficial}
          creator={selectedChallenge.creator}
        />

        {/* Progress Section */}
        {selectedChallenge.challengeTasks &&
          selectedChallenge.challengeTasks.length > 0 && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.sectionTitle}>Progression</Text>
                <Text style={styles.progressText}>
                  {completedTasks}/{totalTasks} jours
                </Text>
              </View>
              <ProgressBar
                current={completedTasks}
                total={totalTasks}
                showLabel={false}
                height={12}
                color={selectedChallenge.iconColor}
              />
              <Text style={styles.progressPercentage}>
                {progress}% complété
              </Text>
            </View>
          )}

        {/* Stats Grid */}
        <StatsGrid
          participants={selectedChallenge.participants}
          completions={selectedChallenge.completions}
          likes={selectedChallenge.likes}
        />

        {/* Tasks List */}
        <TasksSection
          tasks={selectedChallenge.challengeTasks || []}
          totalDays={selectedChallenge.totalDays}
          onTaskPress={handleTaskPress}
          onToggleComplete={() => {}}
        />

        {/* Action Button */}
        {selectedChallenge.userCompleted !== true && (
          <View style={styles.actionSection}>
            <GradientButton
              text={
                completedTasks === 0
                  ? 'Commencer le challenge'
                  : 'Continuer le challenge'
              }
              icon={completedTasks === 0 ? 'play' : 'arrow-forward'}
              onPress={() => handleTaskPress(null)}
            />
          </View>
        )}

        {/* Completed Banner */}
        {selectedChallenge.userCompleted === true && (
          <View style={styles.completedBanner}>
            <Icon name="trophy" size={48} color={appColors.warning} />
            <Text style={styles.completedTitle}>Challenge Complété!</Text>
            <Text style={styles.completedText}>
              Vous avez gagné {selectedChallenge.points} points
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  challengeInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: appColors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${appColors.warning}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    color: appColors.warning,
    fontWeight: 'bold',
  },
  officialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${appColors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  officialText: {
    fontSize: 12,
    color: appColors.primary,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: `${appColors.textSecondary}10`,
    borderRadius: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  progressPercentage: {
    fontSize: 13,
    color: appColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statGradientContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statGradient: {
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  tasksSection: {
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: appColors.textSecondary,
    marginBottom: 16,
  },
  tasksList: {
    marginTop: 12,
  },
  actionSection: {
    marginBottom: 24,
  },
  completedBanner: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: `${appColors.warning}20`,
    borderRadius: 16,
    marginBottom: 24,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.warning,
    marginTop: 12,
  },
  completedText: {
    fontSize: 16,
    color: appColors.textSecondary,
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    color: appColors.error,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ChallengeDetailScreen;
