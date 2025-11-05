import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import LikeButton from '../LikeButton';
import CreatorBadge from '../CreatorBadge';
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
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.card}>
        <LinearGradient
          colors={[appColors.backgroundLight, appColors.backgroundLight]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradient}>
          <View style={styles.content}>
            <View style={styles.leftSection}>
              {/* Icon circulaire avec gradient */}
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={[appColors.primary + '30', appColors.accent + '30']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.iconGradient}>
                  <Icon
                    name={getProgramIcon(program.type)}
                    size={28}
                    color={appColors.primary}
                  />
                </LinearGradient>
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.label}>{program.name}</Text>
                <Text style={styles.subLabel}>{getSubLabel()}</Text>

                {/* Creator Badge */}
                <View style={styles.creatorSection}>
                  <CreatorBadge
                    creator={program.creator}
                    isOfficial={program.isFeatured}
                    size="small"
                    showAvatar={false}
                  />
                </View>

                <View style={styles.metaContainer}>
                  <View style={styles.usageContainer}>
                    <Icon
                      name="people"
                      size={14}
                      color={appColors.textSecondary}
                    />
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

            {/* Icône flèche avec accent */}
            <View style={styles.arrowContainer}>
              <Icon
                name="chevron-forward"
                size={24}
                color={appColors.primary}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 4,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: appColors.border + '40',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gradient: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    gap: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginTop: 2,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: 2,
  },
  subLabel: {
    fontSize: 13,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
  creatorSection: {
    marginTop: 2,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
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
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: appColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default ProgramListCard;
