import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from '../Card/Card';
import LikeButton from '../LikeButton';
import appColors from '../../assets/colors';
import {WorkoutProgram, TYPE_LABELS} from '../../types/workout.types';

type ProgramListCardProps = {
  program: WorkoutProgram;
  onPress: () => void;
  onLike?: () => void;
  getProgramIcon: (type: string) => string;
};

const ProgramListCard = ({
  program,
  onPress,
  onLike,
  getProgramIcon,
}: ProgramListCardProps) => {
  const getSubLabel = (): string => {
    let label = TYPE_LABELS[program.type];

    if (program.type === 'SETS_REPS' && program.sets && program.repsPerSet) {
      label += ` • ${program.sets}x${program.repsPerSet}`;
    } else if (program.type === 'TARGET_REPS' && program.targetReps) {
      label += ` • ${program.targetReps} reps`;
    } else if (program.type === 'MAX_TIME' && program.duration) {
      label += ` • ${Math.round(program.duration / 60)} min`;
    }

    return label;
  };

  return (
    <Card
      style={styles.card}
      color={appColors.primary}
      paddingHorizontal={20}
      paddingVertical={25}
      onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Icon
            name={getProgramIcon(program.type)}
            size={24}
            color={appColors.primary}
          />
          <View style={styles.textContainer}>
            <Text style={styles.label}>{program.name}</Text>
            <Text style={styles.subLabel}>{getSubLabel()}</Text>

            <View style={styles.metaContainer}>
              <View style={styles.usageContainer}>
                <Icon name="people" size={14} color={appColors.textSecondary} />
                <Text style={styles.usageText}>
                  {program?.usageCount || 0} utilisations
                </Text>
              </View>

              {program.likes !== undefined && onLike && (
                <LikeButton
                  likes={program.likes}
                  userLiked={program.userLiked || false}
                  onPress={onLike}
                  size="small"
                  variant="inline"
                />
              )}
            </View>
          </View>
        </View>

        <Icon
          name="caret-forward-outline"
          size={24}
          color={appColors.primary}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 25,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  subLabel: {
    fontSize: 13,
    color: appColors.textSecondary,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  usageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  usageText: {
    fontSize: 11,
    color: appColors.textSecondary,
    fontStyle: 'italic',
  },
});

export default ProgramListCard;
