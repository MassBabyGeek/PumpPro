import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

interface StreakSectionProps {
  currentStreak: number;
  maxStreak: number;
  isLoading?: boolean;
}

const StreakSection: React.FC<StreakSectionProps> = ({
  currentStreak,
  maxStreak,
  isLoading = false,
}) => {
  // Calculer le pourcentage par rapport au record
  const streakPercentage =
    maxStreak > 0 ? (currentStreak / maxStreak) * 100 : 0;

  // Déterminer le message de motivation
  const getMotivationalMessage = () => {
    if (currentStreak === 0) {
      return "Commence ta série aujourd'hui ! 💪";
    }
    if (currentStreak === 1) {
      return 'Bon début ! Continue comme ça ! 🔥';
    }
    if (currentStreak < 7) {
      return 'Tu es sur la bonne voie ! 🚀';
    }
    if (currentStreak < 30) {
      return 'Incroyable série ! Tu es en feu ! 🔥🔥';
    }
    return 'Tu es une machine ! 🏆';
  };

  // Déterminer les couleurs en fonction du streak
  const getStreakColors = (): [string, string] => {
    if (currentStreak === 0) return ['#6B7280', '#4B5563']; // Gris
    if (currentStreak < 7) return ['#F59E0B', '#D97706']; // Orange
    if (currentStreak < 30) return ['#EF4444', '#DC2626']; // Rouge
    return ['#8B5CF6', '#7C3AED']; // Violet (champion)
  };

  const streakColors = getStreakColors();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.loadingCard]}>
          <View style={styles.loadingPlaceholder} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.linearContainer}>
      <LinearGradient
        colors={streakColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>
        <View style={styles.container}>
          <View style={styles.mainSection}>
            <View style={styles.iconContainer}>
              <Text style={styles.fireEmoji}>🔥</Text>
              {currentStreak > 0 && <View style={styles.pulsatingCircle} />}
            </View>

            <View style={styles.streakInfo}>
              <View style={styles.streakNumberContainer}>
                <Text style={styles.streakNumber}>{currentStreak}</Text>
                <Text style={styles.streakUnit}>
                  {currentStreak > 1 ? 'jours' : 'jour'}
                </Text>
              </View>
              <Text style={styles.streakLabel}>Série actuelle</Text>
              <Text style={styles.motivationalText}>
                {getMotivationalMessage()}
              </Text>
            </View>
          </View>

          {/* Séparateur */}
          <View style={styles.separator} />

          {/* Section record */}
          <View style={styles.recordSection}>
            <View style={styles.recordItem}>
              <Icon name="trophy" size={18} color="#FFFFFF" />
              <View style={styles.recordInfo}>
                <Text style={styles.recordLabel}>Record</Text>
                <Text style={styles.recordValue}>
                  {maxStreak} {maxStreak > 1 ? 'jours' : 'jour'}
                </Text>
              </View>
            </View>

            {/* Barre de progression vers le record */}
            {maxStreak > 0 && currentStreak < maxStreak && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {width: `${Math.min(streakPercentage, 100)}%`},
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(streakPercentage)}% de ton record
                </Text>
              </View>
            )}

            {/* Message spécial si record battu */}
            {currentStreak > 0 && currentStreak === maxStreak && (
              <View style={styles.recordBeatenContainer}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.recordBeatenText}>Nouveau record ! 🎉</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    padding: 20,
  },
  card: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    margin: 20,
    elevation: 8,
  },
  loadingCard: {
    backgroundColor: appColors.border,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingPlaceholder: {
    width: '80%',
    height: 20,
    backgroundColor: `${appColors.textSecondary}30`,
    borderRadius: 10,
  },
  linearContainer: {
    flex: 1,
  },
  mainSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    position: 'relative',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 35,
  },
  fireEmoji: {
    fontSize: 36,
  },
  pulsatingCircle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.6,
  },
  streakInfo: {
    flex: 1,
    gap: 4,
  },
  streakNumberContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 52,
  },
  streakUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  motivationalText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 16,
  },
  recordSection: {
    gap: 12,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
  },
  recordValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressContainer: {
    gap: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '600',
  },
  recordBeatenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 8,
  },
  recordBeatenText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFD700',
  },
});

export default StreakSection;
