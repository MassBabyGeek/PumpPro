import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import {WorkoutProgram} from '../../../types/workout.types';
import {TYPE_LABELS, VARIANT_LABELS} from '../../../types/workout.types';

type Props = {
  program: WorkoutProgram;
  currentSet: number;
  totalSets: number;
};

const WorkoutHeader = React.memo(({program, currentSet, totalSets}: Props) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerBadges}>
        <LinearGradient
          colors={[appColors.primary + '25', appColors.accent + '25']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.typeBadge}>
          <Icon name="flame" size={16} color={appColors.primary} />
          <Text style={styles.typeBadgeText}>{TYPE_LABELS[program.type]}</Text>
        </LinearGradient>
        {totalSets > 1 && (
          <LinearGradient
            colors={[appColors.accent + '25', appColors.primary + '25']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.setBadge}>
            <Icon name="layers" size={14} color={appColors.accent} />
            <Text style={styles.setBadgeText}>
              {currentSet}/{totalSets}
            </Text>
          </LinearGradient>
        )}
      </View>
      <Text style={styles.programTitle}>{program.name}</Text>
      <Text style={styles.programSubtitle}>
        {VARIANT_LABELS[program.variant]}
      </Text>
    </View>
  );
});

WorkoutHeader.displayName = 'WorkoutHeader';

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: appColors.primary + '30',
  },
  typeBadgeText: {
    fontSize: 12,
    color: appColors.primary,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  setBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: appColors.accent + '30',
  },
  setBadgeText: {
    fontSize: 12,
    color: appColors.accent,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  programTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  programSubtitle: {
    fontSize: 14,
    color: appColors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default WorkoutHeader;
