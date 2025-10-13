import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import appColors from '../../../assets/colors';
import TaskItem from '../../../components/TaskItem/TaskItem';
import {ChallengeTask} from '../../../types/challenge.types';

type TasksSectionProps = {
  tasks: ChallengeTask[];
  totalDays?: number;
  onTaskPress: (task: ChallengeTask) => void;
  onToggleComplete: (taskId: string) => void;
};

const TasksSection = ({
  tasks,
  totalDays,
  onTaskPress,
  onToggleComplete,
}: TasksSectionProps) => {
  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <View style={styles.tasksSection}>
      {totalDays && (
        <>
          <Text style={styles.sectionTitle}>Programme - {totalDays} jours</Text>
          <Text style={styles.sectionSubtitle}>
            Complétez chaque jour pour débloquer le suivant
          </Text>{' '}
        </>
      )}

      <View style={styles.tasksList}>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onPress={onTaskPress}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tasksSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: appColors.textSecondary,
    marginBottom: 16,
  },
  tasksList: {
    marginTop: 12,
  },
});

export default TasksSection;
