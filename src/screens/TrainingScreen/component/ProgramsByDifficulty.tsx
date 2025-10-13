import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from '../../../components/Card/Card';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import appColors from '../../../assets/colors';
import {
  WorkoutProgram,
  TYPE_LABELS,
  DIFFICULTY_LABELS,
  DifficultyLevel,
} from '../../../types/workout.types';

type ProgramsByDifficultyProps = {
  difficulties: DifficultyLevel[];
  programs: WorkoutProgram[];
  onProgramPress: (program: WorkoutProgram) => void;
  getProgramIcon: (type: string) => string;
};

const ProgramsByDifficulty = ({
  difficulties,
  programs,
  onProgramPress,
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
                <Card
                  key={program.id}
                  style={styles.card}
                  color={appColors.primary}
                  paddingHorizontal={20}
                  paddingVertical={25}
                  onPress={() => onProgramPress(program)}>
                  <View style={styles.leftCard}>
                    <Icon
                      name={getProgramIcon(program.type)}
                      size={24}
                      color={appColors.primary}
                    />
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardLabel}>{program.name}</Text>
                      <Text style={styles.cardSubLabel}>
                        {TYPE_LABELS[program.type]}
                        {program.type === 'SETS_REPS' &&
                          ` • ${program.sets}x${program.repsPerSet}`}
                        {program.type === 'TARGET_REPS' &&
                          ` • ${program.targetReps} reps`}
                        {program.type === 'MAX_TIME' &&
                          ` • ${Math.round(program.duration / 60)} min`}
                      </Text>
                    </View>
                  </View>
                  <Icon
                    name="caret-forward-outline"
                    size={24}
                    color={appColors.primary}
                  />
                </Card>
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
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 25,
    alignItems: 'center',
  },
  leftCard: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  cardTextContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  cardSubLabel: {
    fontSize: 13,
    color: appColors.textSecondary,
  },
});

export default ProgramsByDifficulty;
