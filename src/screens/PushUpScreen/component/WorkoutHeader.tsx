import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import {WorkoutProgram} from '../../../types/workout.types';
import {TYPE_LABELS, VARIANT_LABELS} from '../../../types/workout.types';

type Props = {
  program: WorkoutProgram;
  currentSet: number;
  totalSets: number;
};

const WorkoutHeader = ({program, currentSet, totalSets}: Props) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerBadges}>
        <View style={styles.typeBadge}>
          <Icon name="flame" size={14} color={appColors.primary} />
          <Text style={styles.typeBadgeText}>{TYPE_LABELS[program.type]}</Text>
        </View>
        {totalSets > 1 && (
          <View style={styles.setBadge}>
            <Text style={styles.setBadgeText}>
              Série {currentSet}/{totalSets}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.programTitle}>{program.name}</Text>
      <Text style={styles.programSubtitle}>
        {VARIANT_LABELS[program.variant]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${appColors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    color: appColors.primary,
    fontWeight: '600',
  },
  setBadge: {
    backgroundColor: `${appColors.accent}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  setBadgeText: {
    fontSize: 12,
    color: appColors.accent,
    fontWeight: '600',
  },
  programTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  programSubtitle: {
    fontSize: 14,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
});

export default WorkoutHeader;
