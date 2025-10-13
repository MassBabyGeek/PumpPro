import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import {DIFFICULTY_LABELS, DifficultyLevel} from '../../../types/workout.types';

type ChallengeInfoSectionProps = {
  iconName: string;
  iconColor: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  points: number;
  isOfficial: boolean;
};

const ChallengeInfoSection = ({
  iconName,
  iconColor,
  title,
  description,
  difficulty,
  points,
  isOfficial,
}: ChallengeInfoSectionProps) => {
  return (
    <View style={styles.challengeInfo}>
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={48} color={iconColor} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* Badges */}
      <View style={styles.badges}>
        <View
          style={[
            styles.difficultyBadge,
            {backgroundColor: `${iconColor}20`},
          ]}>
          <Text style={[styles.badgeText, {color: iconColor}]}>
            {DIFFICULTY_LABELS[difficulty]}
          </Text>
        </View>
        <View style={styles.pointsBadge}>
          <Icon name="star" size={14} color={appColors.warning} />
          <Text style={styles.pointsText}>{points} pts</Text>
        </View>
        {isOfficial && (
          <View style={styles.officialBadge}>
            <Icon
              name="checkmark-circle"
              size={14}
              color={appColors.primary}
            />
            <Text style={styles.officialText}>Officiel</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  challengeInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: appColors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${appColors.warning}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    color: appColors.warning,
    fontWeight: 'bold',
  },
  officialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${appColors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  officialText: {
    fontSize: 12,
    color: appColors.primary,
    fontWeight: '600',
  },
});

export default ChallengeInfoSection;
