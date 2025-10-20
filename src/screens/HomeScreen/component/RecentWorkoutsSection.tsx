import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import WorkoutSessionCard from '../../../components/WorkoutSessionCard/WorkoutSessionCard';
import EmptyState from '../../../components/EmptyState/EmptyState';
import appColors from '../../../assets/colors';
import {WorkoutSession} from '../../../types/workout.types';

type Props = {
  sessions: WorkoutSession[];
  isLoading: boolean;
  onSessionPress?: (session: WorkoutSession) => void;
  onLike?: (sessionId: string) => void;
  onViewAll: () => void;
  classname?: ViewStyle;
};

const RecentWorkoutsSection = ({
  sessions,
  isLoading,
  onSessionPress,
  onLike,
  onViewAll,
  classname,
}: Props) => {
  // Prendre seulement les 5 dernières
  const recentSessions = sessions.slice(0, 3);

  return (
    <View style={[styles.section, classname]}>
      <View style={styles.header}>
        <SectionTitle title="💪 Mes dernières séances" />
        {sessions.length > 0 && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
            <Text style={styles.viewAllText}>Tout voir</Text>
            <Icon name="chevron-forward" size={16} color={appColors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <EmptyState
          icon="time-outline"
          title="Chargement..."
          message="Récupération de vos séances"
          isLoading={true}
        />
      ) : recentSessions.length === 0 ? (
        <EmptyState
          icon="fitness-outline"
          title="Aucune séance"
          message="Commence ton premier entraînement pour voir tes statistiques !"
        />
      ) : (
        <View style={styles.sessions}>
          {recentSessions.map(session => (
            <WorkoutSessionCard
              key={session.sessionId}
              session={session}
              onPress={() => onSessionPress?.(session)}
              onLike={() => onLike?.(session.sessionId)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 13,
    color: appColors.primary,
    fontWeight: '600',
  },
  sessions: {
    gap: 12,
  },
});

export default RecentWorkoutsSection;
