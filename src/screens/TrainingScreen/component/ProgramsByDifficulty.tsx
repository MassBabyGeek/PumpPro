import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import ProgramListCard from '../../../components/ProgramListCard';
import appColors from '../../../assets/colors';
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

const getDifficultyIcon = (level: DifficultyLevel): string => {
  switch (level) {
    case 'BEGINNER':
      return 'leaf-outline';
    case 'INTERMEDIATE':
      return 'flame-outline';
    case 'ADVANCED':
      return 'rocket-outline';
    default:
      return 'fitness-outline';
  }
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
            <View style={styles.difficultyHeader}>
              <View style={styles.headerContent}>
                <LinearGradient
                  colors={[appColors.primary, appColors.accent]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.iconContainer}>
                  <Icon
                    name={getDifficultyIcon(level)}
                    size={20}
                    color="#FFFFFF"
                  />
                </LinearGradient>
                <Text style={styles.difficultyTitle}>
                  {DIFFICULTY_LABELS[level]}
                </Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{filteredPrograms.length}</Text>
              </View>
            </View>

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
    marginBottom: 32,
  },
  difficultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: appColors.primary,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  difficultyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: appColors.primary + '30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.primary + '40',
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  cards: {
    gap: 16,
  },
});

export default ProgramsByDifficulty;
