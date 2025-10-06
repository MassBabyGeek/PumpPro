import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {ChallengeTask} from '../../types/challenge.types';
import {VARIANT_LABELS} from '../../types/workout.types';

interface TaskItemProps {
  task: ChallengeTask;
  onPress: (task: ChallengeTask) => void;
  onToggleComplete?: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onPress,
  onToggleComplete,
}) => {
  const getTaskTargetText = (): string => {
    if (task.targetReps) {
      return `${task.targetReps} pompes`;
    }
    if (task.duration) {
      const minutes = Math.floor(task.duration / 60);
      const seconds = task.duration % 60;
      if (minutes > 0) {
        return `${minutes}min${seconds > 0 ? ` ${seconds}s` : ''}`;
      }
      return `${seconds}s`;
    }
    if (task.sets && task.repsPerSet) {
      return `${task.sets} x ${task.repsPerSet}`;
    }
    return '';
  };

  const isLocked = task.isLocked && !task.completed;
  const gradientColors = task.completed
    ? [`${appColors.success}20`, `${appColors.success}10`]
    : isLocked
      ? [`${appColors.textSecondary}15`, `${appColors.textSecondary}05`]
      : [`${appColors.primary}15`, `${appColors.accent}10`];

  return (
    <TouchableOpacity
      style={[styles.container, isLocked && styles.locked]}
      onPress={() => !isLocked && onPress(task)}
      activeOpacity={isLocked ? 1 : 0.7}
      disabled={isLocked}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <View style={styles.gradienContainer}>
          <View style={styles.content}>
            {/* Left: Day badge and info */}
            <View style={styles.leftSection}>
              <View
                style={[
                  styles.dayBadge,
                  task.completed && styles.dayBadgeCompleted,
                  isLocked && styles.dayBadgeLocked,
                ]}>
                <Text
                  style={[
                    styles.dayText,
                    task.completed && styles.dayTextCompleted,
                    isLocked && styles.dayTextLocked,
                  ]}>
                  J{task.day}
                </Text>
              </View>

              <View style={styles.info}>
                <Text
                  style={[
                    styles.title,
                    task.completed && styles.titleCompleted,
                    isLocked && styles.titleLocked,
                  ]}>
                  {task.title}
                </Text>
                <Text
                  style={[
                    styles.description,
                    isLocked && styles.descriptionLocked,
                  ]}>
                  {task.description}
                </Text>
                <View style={styles.details}>
                  <View style={styles.detailItem}>
                    <Icon
                      name="barbell"
                      size={12}
                      color={
                        isLocked ? appColors.disabled : appColors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.detailText,
                        isLocked && styles.detailTextLocked,
                      ]}>
                      {VARIANT_LABELS[task.variant]}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon
                      name="target"
                      size={12}
                      color={
                        isLocked ? appColors.disabled : appColors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.detailText,
                        isLocked && styles.detailTextLocked,
                      ]}>
                      {getTaskTargetText()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right: Status */}
            <View style={styles.rightSection}>
              {task.completed ? (
                <View style={styles.completedBadge}>
                  <Icon
                    name="checkmark-circle"
                    size={32}
                    color={appColors.success}
                  />
                  {task.score && (
                    <Text style={styles.scoreText}>{task.score}</Text>
                  )}
                </View>
              ) : isLocked ? (
                <Icon name="lock-closed" size={28} color={appColors.disabled} />
              ) : (
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => onToggleComplete?.(task.id)}>
                  <Icon
                    name="ellipse-outline"
                    size={28}
                    color={appColors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Scheduled date if exists */}
          {task.scheduledDate && (
            <View style={styles.footer}>
              <Icon
                name="calendar-outline"
                size={14}
                color={appColors.textSecondary}
              />
              <Text style={styles.scheduledText}>
                {new Date(task.scheduledDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                })}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  locked: {
    opacity: 0.6,
  },
  gradient: {
    borderWidth: 1,
    borderColor: `${appColors.textSecondary}20`,
    borderRadius: 12,
  },
  gradienContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  dayBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBadgeCompleted: {
    backgroundColor: appColors.success,
  },
  dayBadgeLocked: {
    backgroundColor: appColors.disabled,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.background,
  },
  dayTextCompleted: {
    color: appColors.background,
  },
  dayTextLocked: {
    color: appColors.textSecondary,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: appColors.textSecondary,
  },
  titleLocked: {
    color: appColors.disabled,
  },
  description: {
    fontSize: 13,
    color: appColors.textSecondary,
  },
  descriptionLocked: {
    color: appColors.disabled,
  },
  details: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 11,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
  detailTextLocked: {
    color: appColors.disabled,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: appColors.success,
  },
  checkbox: {
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: `${appColors.textSecondary}20`,
  },
  scheduledText: {
    fontSize: 12,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
});

export default TaskItem;
