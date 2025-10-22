import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {WorkoutSession, WorkoutProgram, VARIANT_LABELS, TYPE_LABELS} from '../../types/workout.types';
import {formatTime} from '../../utils/workout.utils';
import LikeButton from '../LikeButton';
import {programService} from '../../services/api';

interface WorkoutSessionCardProps {
  session: WorkoutSession;
  onLike?: () => void;
  onPress?: () => void;
}

const WorkoutSessionCard: React.FC<WorkoutSessionCardProps> = ({
  session,
  onLike,
  onPress,
}) => {
  const [program, setProgram] = useState<WorkoutProgram | null>(null);

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month} à ${hours}:${minutes}`;
  };

  const getDifficultyColor = (difficulty: string): string => {
    const normalizedDifficulty = difficulty.toUpperCase();
    switch (normalizedDifficulty) {
      case 'BEGINNER':
        return appColors.success; // Vert
      case 'INTERMEDIATE':
        return appColors.warning; // Jaune
      case 'ADVANCED':
        return appColors.error; // Rouge
      default:
        return appColors.textSecondary; // Par défaut
    }
  };

  const calories = Math.round(session.totalReps * 0.5);

  // Fetch program data if programId exists and program is not already in session
  useEffect(() => {
    const fetchProgram = async () => {
      if (session.programId && !session.program) {
        try {
          const fetchedProgram = await programService.getProgramById(session.programId);
          if (fetchedProgram) {
            setProgram(fetchedProgram);
          }
        } catch (error) {
          console.error('[WorkoutSessionCard] Error fetching program:', error);
        }
      }
    };
    fetchProgram();
  }, [session.programId, session.program]);

  // Use either the program from session or the fetched program
  const displayProgram = session.program || program;

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper style={styles.container} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Icon name="calendar" size={16} color={appColors.primary} />
          <Text style={styles.dateText}>{formatDate(session.startTime)}</Text>
        </View>
        {session.completed && (
          <View style={styles.completedBadge}>
            <Icon name="checkmark-circle" size={14} color={appColors.success} />
            <Text style={styles.completedText}>Terminé</Text>
          </View>
        )}
      </View>

      {/* Program/Challenge Info */}
      {(displayProgram || session.challenge) && (
        <View style={styles.contextSection}>
          {session.challenge && (
            <View style={styles.challengeInfo}>
              <Icon
                name={session.challenge.iconName}
                size={18}
                color={session.challenge.iconColor}
              />
              <Text style={styles.challengeTitle} numberOfLines={1}>
                {session.challenge.title}
              </Text>
            </View>
          )}
          {displayProgram && (
            <View style={styles.programInfo}>
              {displayProgram.name && (
                <View style={styles.programNameContainer}>
                  <Icon name="barbell-outline" size={18} color={appColors.primary} />
                  <Text style={styles.programName} numberOfLines={1}>
                    {displayProgram.name}
                  </Text>
                </View>
              )}
              <View style={styles.programDetails}>
                <View style={styles.programDetail}>
                  <Icon name="barbell" size={14} color={appColors.textSecondary} />
                  <Text style={styles.programText}>
                    {VARIANT_LABELS[displayProgram.variant]}
                  </Text>
                </View>
                <View style={styles.programDetail}>
                  <Icon name="trending-up" size={14} color={appColors.textSecondary} />
                  <Text style={styles.programText}>
                    {TYPE_LABELS[displayProgram.type]}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.mainContent}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Icon name="fitness" size={24} color={appColors.primary} />
            </View>
            <Text style={styles.statValue}>{session.totalReps}</Text>
            <Text style={styles.statLabel}>pompes</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Icon name="time" size={24} color={appColors.accent} />
            </View>
            <Text style={styles.statValue}>{formatTime(session.totalDuration)}</Text>
            <Text style={styles.statLabel}>durée</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Icon name="flame" size={24} color={appColors.warning} />
            </View>
            <Text style={styles.statValue}>{calories}</Text>
            <Text style={styles.statLabel}>kcal</Text>
          </View>
        </View>
      </View>

      {/* Notes section */}
      {session.notes && session.notes.trim() !== '' && (
        <View style={styles.notesSection}>
          <View style={styles.notesHeader}>
            <Icon name="chatbox-ellipses" size={16} color={appColors.textSecondary} />
            <Text style={styles.notesHeaderText}>Note</Text>
          </View>
          <Text style={styles.notesText} numberOfLines={3}>
            {session.notes}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {session.user && (
            <View style={styles.userInfo}>
              {session.user.avatar ? (
                <Image source={{uri: session.user.avatar}} style={styles.userAvatar} />
              ) : (
                <View style={styles.userAvatarPlaceholder}>
                  <Icon name="person" size={16} color={appColors.textSecondary} />
                </View>
              )}
              <View style={styles.userDetails}>
                <Text style={styles.userName} numberOfLines={1}>
                  {session.user.name}
                </Text>
                <View style={styles.userScore}>
                  <Icon name="trophy" size={10} color={appColors.warning} />
                  <Text style={styles.userScoreText}>
                    {session.user.score} pts
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.footerRight}>
          {(displayProgram?.difficulty !== undefined) && (
            <View style={[styles.pointsContainer, {backgroundColor: `${getDifficultyColor(displayProgram.difficulty)}20`}]}>
              <Icon name="star" size={14} color={getDifficultyColor(displayProgram.difficulty)} />
              <Text style={[styles.pointsText, {color: getDifficultyColor(displayProgram.difficulty)}]}>
                {displayProgram.difficulty}
              </Text>
            </View>
          )}
          {session.likes !== undefined && onLike && (
            <LikeButton
              likes={session.likes}
              userLiked={session.userLiked || false}
              onPress={onLike}
              size="medium"
              variant="standalone"
            />
          )}
        </View>
      </View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: `${appColors.border}40`,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${appColors.success}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedText: {
    fontSize: 11,
    color: appColors.success,
    fontWeight: '600',
  },
  mainContent: {
    backgroundColor: `${appColors.primary}08`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${appColors.background}60`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: `${appColors.border}30`,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: appColors.textSecondary,
    textTransform: 'uppercase',
  },
  contextSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: `${appColors.border}30`,
  },
  challengeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textPrimary,
    flex: 1,
  },
  programInfo: {
    gap: 8,
  },
  programNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  programName: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.primary,
    flex: 1,
  },
  programDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  programDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  programText: {
    fontSize: 12,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: `${appColors.border}30`,
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  setsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  setsLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${appColors.warning}20`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pointsText: {
    fontSize: 12,
    color: appColors.warning,
    fontWeight: 'bold',
  },
  notesSection: {
    backgroundColor: `${appColors.accent}10`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: appColors.accent,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  notesHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: appColors.textSecondary,
    textTransform: 'uppercase',
  },
  notesText: {
    fontSize: 13,
    color: appColors.textPrimary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: appColors.backgroundDark,
  },
  userAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${appColors.border}40`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  userScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userScoreText: {
    fontSize: 11,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
});

export default WorkoutSessionCard;
