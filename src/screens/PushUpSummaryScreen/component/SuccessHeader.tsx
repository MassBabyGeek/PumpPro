import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import {TYPE_LABELS, VARIANT_LABELS} from '../../../types/workout.types';
import {useProgram} from '../../../hooks';

type SuccessHeaderProps = {
  completed: boolean;
  programId: string;
};

const SuccessHeader = ({completed, programId}: SuccessHeaderProps) => {
  const {program} = useProgram(programId);
  if (!program) {
    return null;
  }

  return (
    <>
      <Icon
        name={completed ? 'checkmark-circle' : 'flag'}
        size={100}
        color={completed ? appColors.success : appColors.primary}
      />

      <Text style={styles.title}>
        {completed ? 'Objectif atteint ! 🎯' : 'Session terminée'}
      </Text>

      <View style={styles.programCard}>
        <Text style={styles.programName}>{program.name}</Text>
        <Text style={styles.programType}>
          {TYPE_LABELS[program.type]} • {VARIANT_LABELS[program.variant]}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default SuccessHeader;
