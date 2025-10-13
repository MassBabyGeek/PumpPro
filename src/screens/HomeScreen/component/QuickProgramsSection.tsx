import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import ProgramCard from '../../../components/ProgramCard/ProgramCard';
import appColors from '../../../assets/colors';
import {WorkoutProgram} from '../../../types/workout.types';

const quickPrograms: Array<{
  id: number;
  title: string;
  description: string;
  reps: number;
  icon: string;
  color: string;
  type: WorkoutProgram;
}> = [
  {
    id: 1,
    title: 'Quick 20',
    description: '20 pompes rapides',
    reps: 20,
    icon: 'flash',
    color: appColors.warning,
    type: {
      id: 'target-20-reps',
      name: 'Quick 20',
      description: '20 pompes rapides',
      type: 'TARGET_REPS',
      difficulty: 'BEGINNER',
      variant: 'STANDARD',
      targetReps: 20,
      isCustom: false,
    },
  },
  {
    id: 2,
    title: 'Challenge 50',
    description: '50 pompes en série',
    reps: 50,
    icon: 'flame',
    color: appColors.error,
    type: {
      id: 'target-50-reps',
      name: 'Challenge 50',
      description: '50 pompes en série',
      type: 'TARGET_REPS',
      difficulty: 'INTERMEDIATE',
      variant: 'STANDARD',
      targetReps: 50,
      isCustom: false,
    },
  },
  {
    id: 3,
    title: 'Endurance',
    description: '100 pompes (séries)',
    reps: 100,
    icon: 'trophy',
    color: appColors.success,
    type: {
      id: 'target-100-reps',
      name: 'Endurance 100',
      description: '100 pompes en série',
      type: 'TARGET_REPS',
      difficulty: 'ADVANCED',
      variant: 'STANDARD',
      targetReps: 100,
      isCustom: false,
    },
  },
];

type Props = {
  onProgramPress: (program: WorkoutProgram) => void;
};

const QuickProgramsSection = ({onProgramPress}: Props) => {
  return (
    <View style={styles.section}>
      <SectionTitle title="⚡ Démarrage rapide" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.programsScroll}>
        {quickPrograms.map(program => (
          <ProgramCard
            key={program.id}
            title={program.title}
            description={program.description}
            reps={program.reps}
            icon={program.icon}
            color={program.color}
            onPress={() => onProgramPress(program.type)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  programsScroll: {
    gap: 12,
    paddingRight: 20,
  },
});

export default QuickProgramsSection;
