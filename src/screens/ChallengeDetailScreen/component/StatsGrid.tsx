import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

type StatsGridProps = {
  participants: number;
  completions: number;
  likes: number;
};

const StatsGrid = ({participants, completions, likes}: StatsGridProps) => {
  return (
    <View style={styles.statsGrid}>
      {participants && (
        <View style={styles.statCard}>
          <LinearGradient
            colors={[`${appColors.primary}15`, `${appColors.accent}10`]}
            style={styles.statGradient}>
            <View style={styles.statGradientContainer}>
              <Icon name="people" size={24} color={appColors.primary} />
              <Text style={styles.statValue}>
                {participants.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Participants</Text>
            </View>
          </LinearGradient>
        </View>
      )}

      {completions && (
        <View style={styles.statCard}>
          <LinearGradient
            colors={[`${appColors.success}15`, `${appColors.success}10`]}
            style={styles.statGradient}>
            <View style={styles.statGradientContainer}>
              <Icon name="checkmark-done" size={24} color={appColors.success} />
              <Text style={styles.statValue}>
                {completions?.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Complétés</Text>
            </View>
          </LinearGradient>
        </View>
      )}

      {likes && (
        <View style={styles.statCard}>
          <LinearGradient
            colors={[`${appColors.error}15`, `${appColors.error}10`]}
            style={styles.statGradient}>
            <View style={styles.statGradientContainer}>
              <Icon name="heart" size={24} color={appColors.error} />
              <Text style={styles.statValue}>{likes?.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statGradientContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statGradient: {
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
});

export default StatsGrid;
