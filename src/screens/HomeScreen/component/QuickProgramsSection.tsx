import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import ProgramCard from '../../../components/ProgramCard/ProgramCard';
import {useWorkoutPrograms} from '../../../hooks';
import appColors from '../../../assets/colors';
import {WorkoutProgram} from '../../../types/workout.types';

type Props = {
  onProgramPress: (program: WorkoutProgram) => void;
};

const QuickProgramsSection = ({onProgramPress}: Props) => {
  const {programs, getProgramIcon} = useWorkoutPrograms();

  // je veux 1 de chaque difficulté
  const quickPrograms = programs.filter(p => p.difficulty);

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
            title={program.name}
            description={program.description}
            difficulty={program.difficulty}
            icon={getProgramIcon(program.type)}
            color={appColors.primary}
            usageCount={program.usageCount}
            onPress={() => onProgramPress(program)}
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
