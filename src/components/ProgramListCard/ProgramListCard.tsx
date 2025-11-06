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
      activeOpacity={0.85}>
      <LinearGradient
        colors={[appColors.primary + '25', appColors.accent + '25']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            {/* Icon circulaire avec gradient */}
            <View style={styles.iconWrapper}>
              <LinearGradient
                colors={[appColors.primary, appColors.accent]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.iconGradient}>
                <Icon
                  name={getProgramIcon(program.type)}
                  size={26}
                  color="#FFFFFF"
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
                    color={appColors.primary}
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

          {/* Icône flèche avec gradient */}
          <LinearGradient
            colors={[appColors.primary + '30', appColors.accent + '30']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.arrowContainer}>
            <Icon
              name="chevron-forward"
              size={22}
              color={appColors.textPrimary}
            />
          </LinearGradient>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
    elevation: 8,
    shadowColor: appColors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1.5,
    borderColor: appColors.primary + '40',
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
  iconWrapper: {
    elevation: 4,
    shadowColor: appColors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  iconGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: appColors.primary + '30',
  },
});

export default ProgramListCard;
