import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {Challenge} from '../../types/challenge.types';
import {DIFFICULTY_LABELS, VARIANT_LABELS} from '../../types/workout.types';
import LikeButton from '../LikeButton';
import CreatorBadge from '../CreatorBadge';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: (challenge: Challenge) => void;
  onLike?: (challengeId: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPress,
  onLike,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Calculate progress
  const getProgress = (): {
    current: number;
    total: number;
    percentage: number;
  } => {
    if (!challenge.challengeTasks || challenge.challengeTasks.length === 0) {
      return {current: 0, total: 0, percentage: 0};
    }
    const completedTasks = challenge.challengeTasks.filter(t => t.completed).length;
    const totalTasks = challenge.challengeTasks.length;
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    return {current: completedTasks, total: totalTasks, percentage};
  };

  const progress = getProgress();
  const hasStarted = progress.current > 0 && !!challenge.userCompleted;

  const getTargetText = (): string => {
    if (challenge.targetReps) {
      return `${challenge.targetReps} pompes`;
    }
    if (challenge.duration) {
      const minutes = Math.floor(challenge.duration / 60);
      const seconds = challenge.duration % 60;
      if (minutes > 0) {
        return `${minutes}min${seconds > 0 ? ` ${seconds}s` : ''}`;
      }
      return `${seconds}s`;
    }
    if (challenge.sets && challenge.repsPerSet) {
      return `${challenge.sets}x${challenge.repsPerSet}`;
    }
    return '';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(challenge)}
      activeOpacity={0.8}>
      <LinearGradient
        colors={[`${challenge.iconColor}15`, `${challenge.iconColor}05`]}
        style={styles.gradient}>
        {/* Header avec icône et badge */}
        <View style={styles.gradientContainer}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon
                size={32}
                name={challenge.iconName}
                color={challenge.iconColor}
              />
            </View>

            <View style={styles.headerRight}>
              <View
                style={[
                  styles.difficultyBadge,
                  {backgroundColor: `${challenge.iconColor}20`},
                ]}>
                <Text
                  style={[styles.difficultyText, {color: challenge.iconColor}]}>
                  {DIFFICULTY_LABELS[challenge.difficulty]}
                </Text>
              </View>
            </View>
          </View>

          {/* Titre et description */}
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {challenge.description}
          </Text>

          {/* Détails du challenge */}
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Icon name="barbell" size={14} color={appColors.textSecondary} />
              <Text style={styles.detailText}>
                {VARIANT_LABELS[challenge.variant]}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="target" size={14} color={appColors.textSecondary} />
              <Text style={styles.detailText}>{getTargetText()}</Text>
            </View>
          </View>

          {/* Creator Badge */}
          <View style={styles.creatorSection}>
            <CreatorBadge
              creator={challenge.creator}
              isOfficial={challenge.isOfficial}
              size="small"
              showAvatar={true}
            />
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Icon name="people" size={16} color={appColors.textSecondary} />
              <Text style={styles.statText}>
                {formatNumber(challenge.participants)}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Icon name="checkmark-done" size={16} color={appColors.success} />
              <Text style={styles.statText}>
                {formatNumber(challenge.completions)}
              </Text>
            </View>

            <LikeButton
              likes={challenge.likes}
              userLiked={challenge.userLiked || false}
              onPress={() => onLike?.(challenge.id)}
              size="medium"
              variant="inline"
              style={styles.statItem}
            />

            <View style={styles.pointsContainer}>
              <Icon name="star" size={14} color={appColors.warning} />
              <Text style={styles.pointsText}>{challenge.points} pts</Text>
            </View>
          </View>

          {/* Progress bar si user a commencé */}
          {hasStarted && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>
                  {progress.current}/{progress.total} jours
                </Text>
                <Text style={styles.progressPercentage}>
                  {progress.percentage}%
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={[challenge.iconColor, `${challenge.iconColor}CC`]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[
                    styles.progressBar,
                    {width: `${progress.percentage}%`},
                  ]}
                />
              </View>
            </View>
          )}

          {/* Completed banner */}
          {challenge.userCompleted && (
            <View style={styles.completedBanner}>
              <Icon
                name="checkmark-circle"
                size={16}
                color={appColors.success}
              />
              <Text style={styles.completedText}>Complété ✓</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'visible',
  },
  gradientContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  gradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${appColors.textSecondary}20`,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: 20,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: appColors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
  creatorSection: {
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: `${appColors.textSecondary}20`,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
  pointsContainer: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${appColors.warning}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointsText: {
    fontSize: 12,
    color: appColors.warning,
    fontWeight: 'bold',
  },
  progressSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: `${appColors.textSecondary}20`,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: appColors.textPrimary,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 12,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: `${appColors.textSecondary}20`,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    backgroundColor: `${appColors.success}20`,
    borderRadius: 8,
  },
  completedText: {
    fontSize: 13,
    color: appColors.success,
    fontWeight: 'bold',
  },
});

export default ChallengeCard;
