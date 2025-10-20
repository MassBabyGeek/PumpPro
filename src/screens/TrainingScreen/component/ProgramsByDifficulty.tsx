import React from 'react';
import {View, StyleSheet} from 'react-native';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import ProgramListCard from '../../../components/ProgramListCard';
import {
  WorkoutProgram,
  DIFFICULTY_LABELS,
  DifficultyLevel,
} from '../../../types/workout.types';

type ProgramsByDifficultyProps = {
  difficulties: DifficultyLevel[];
  programs: WorkoutProgram[];
  onProgramPress: (program: WorkoutProgram) => void;
  onProgramLike?: (programId: string) => void;
  getProgramIcon: (type: string) => string;
};

const ProgramsByDifficulty = ({
  difficulties,
  programs,
  onProgramPress,
  onProgramLike,
  getProgramIcon,
}: ProgramsByDifficultyProps) => {
  return (
    <>
      {difficulties.map(level => {
        const filteredPrograms = programs.filter(p => p.difficulty === level);

        if (!filteredPrograms.length) return null;

        return (
          <View style={styles.section} key={level}>
            <SectionTitle title={DIFFICULTY_LABELS[level]} />

            <View style={styles.cards}>
              {filteredPrograms.map(program => (
                <ProgramListCard
                  key={program.id}
                  program={program}
                  onPress={() => onProgramPress(program)}
                  onLike={
                    onProgramLike
                      ? () => onProgramLike(program.id)
                      : undefined
                  }
                  getProgramIcon={getProgramIcon}
                />
              ))}
            </View>
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  cards: {
    gap: 16,
  },
});

export default ProgramsByDifficulty;
