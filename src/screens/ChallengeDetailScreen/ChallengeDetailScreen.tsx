import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute, useNavigation} from '@react-navigation/native';
import appColors from '../../assets/colors';
import {useChallenges} from '../../hooks';
import TaskItem from '../../components/TaskItem/TaskItem';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import {GradientButton} from '../../components';
import {ChallengeTask} from '../../types/challenge.types';
import {DIFFICULTY_LABELS, VARIANT_LABELS} from '../../types/workout.types';

const ChallengeDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {challengeId} = route.params;

  const {getChallengeById, toggleTaskCompletion, getChallengeProgress} =
    useChallenges();

  const challenge = getChallengeById(challengeId);
  const progress = getChallengeProgress(challengeId);

  if (!challenge) {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.gradient}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color={appColors.error} />
          <Text style={styles.errorText}>Challenge non trouvé</Text>
        </View>
      </LinearGradient>
    );
  }

  const completedTasks = challenge.tasks?.filter(t => t.completed).length || 0;
  const totalTasks = challenge.tasks?.length || 0;

  const handleTaskPress = (task: ChallengeTask) => {
    if (task.completed || task.isLocked) return;
    // TODO: Navigate to workout screen with this task
    console.log('Start task:', task.title);
  };

  const handleToggleComplete = (taskId: string) => {
    toggleTaskCompletion(challengeId, taskId);
  };

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradient}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
        <View style={styles.challengeInfo}>
          <View style={styles.iconContainer}>
            <Icon
              name={challenge.iconName}
              size={48}
              color={challenge.iconColor}
            />
          </View>

          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.description}>{challenge.description}</Text>

          {/* Badges */}
          <View style={styles.badges}>
            <View
              style={[
                styles.difficultyBadge,
                {backgroundColor: `${challenge.iconColor}20`},
              ]}>
              <Text style={[styles.badgeText, {color: challenge.iconColor}]}>
                {DIFFICULTY_LABELS[challenge.difficulty]}
              </Text>
            </View>
            <View style={styles.pointsBadge}>
              <Icon name="star" size={14} color={appColors.warning} />
              <Text style={styles.pointsText}>{challenge.points} pts</Text>
            </View>
            {challenge.isOfficial && (
              <View style={styles.officialBadge}>
                <Icon
                  name="checkmark-circle"
                  size={14}
                  color={appColors.primary}
                />
                <Text style={styles.officialText}>Officiel</Text>
              </View>
            )}
          </View>
        </View>

        {/* Progress Section */}
        {challenge.tasks && challenge.tasks.length > 0 && (
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
              color={challenge.iconColor}
            />
            <Text style={styles.progressPercentage}>{progress}% complété</Text>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[`${appColors.primary}15`, `${appColors.accent}10`]}
              style={styles.statGradient}>
              <View style={styles.statGradientContainer}>
                <Icon name="people" size={24} color={appColors.primary} />
                <Text style={styles.statValue}>
                  {challenge.participants.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Participants</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[`${appColors.success}15`, `${appColors.success}10`]}
              style={styles.statGradient}>
              <View style={styles.statGradientContainer}>
                <Icon
                  name="checkmark-done"
                  size={24}
                  color={appColors.success}
                />
                <Text style={styles.statValue}>
                  {challenge.completions.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Complétés</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[`${appColors.error}15`, `${appColors.error}10`]}
              style={styles.statGradient}>
              <View style={styles.statGradientContainer}>
                <Icon name="heart" size={24} color={appColors.error} />
                <Text style={styles.statValue}>
                  {challenge.likes.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Tasks List */}
        {challenge.tasks && challenge.tasks.length > 0 && (
          <View style={styles.tasksSection}>
            <Text style={styles.sectionTitle}>
              Programme - {challenge.totalDays} jours
            </Text>
            <Text style={styles.sectionSubtitle}>
              Complétez chaque jour pour débloquer le suivant
            </Text>

            <View style={styles.tasksList}>
              {challenge.tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onPress={handleTaskPress}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </View>
          </View>
        )}

        {/* Action Button */}
        {!challenge.userCompleted && (
          <View style={styles.actionSection}>
            <GradientButton
              text={
                completedTasks === 0
                  ? 'Commencer le challenge'
                  : 'Continuer le challenge'
              }
              icon={completedTasks === 0 ? 'play' : 'arrow-forward'}
              onPress={() => {
                const nextTask = challenge.tasks?.find(
                  t => !t.completed && !t.isLocked,
                );
                if (nextTask) {
                  handleTaskPress(nextTask);
                }
              }}
            />
          </View>
        )}

        {/* Completed Banner */}
        {challenge.userCompleted && (
          <View style={styles.completedBanner}>
            <Icon name="trophy" size={48} color={appColors.warning} />
            <Text style={styles.completedTitle}>Challenge Complété!</Text>
            <Text style={styles.completedText}>
              Vous avez gagné {challenge.points} points
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
