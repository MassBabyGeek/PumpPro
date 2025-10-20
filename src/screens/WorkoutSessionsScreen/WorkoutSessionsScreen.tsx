import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import appColors from '../../assets/colors';
import WorkoutSessionCard from '../../components/WorkoutSessionCard/WorkoutSessionCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingView from '../../components/LoadingView/LoadingView';
import {useWorkouts} from '../../hooks';
import {useUser} from '../../hooks/useUser';
import {WorkoutSession} from '../../types/workout.types';

type FilterType = 'all' | 'completed' | 'incomplete';

const WorkoutSessionsScreen = () => {
  const navigation = useNavigation();
  const {user} = useUser();
  const {isLoading: isUserLoading} = useUser();
  const {workouts, isLoading, loadWorkouts, toggleLike} = useWorkouts();
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id && !isUserLoading) {
      loadWorkouts(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isUserLoading]);

  const onRefresh = useCallback(async () => {
    if (!user?.id) {
      return;
    }
    setRefreshing(true);
    await loadWorkouts(user.id);
    setRefreshing(false);
  }, [user?.id, loadWorkouts]);

  const filteredSessions = workouts.filter(session => {
    if (filter === 'completed') {
      return session.completed;
    }
    if (filter === 'incomplete') {
      return !session.completed;
    }
    return true;
  });

  const handleSessionPress = (session: WorkoutSession) => {
    // TODO: Navigate to session detail
    console.log('Session pressed:', session.sessionId);
  };

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={appColors.primary}
          />
        }>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{padding: 4}}>
            <Icon name="arrow-back" size={24} color={appColors.textPrimary} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: appColors.textPrimary,
            }}>
            💪 Mes séances
          </Text>
          <View style={{width: 32}} />
        </View>

        {/* Filtres */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filter === 'all' && styles.filterChipActive,
            ]}
            onPress={() => setFilter('all')}>
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.filterTextActive,
              ]}>
              Toutes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filter === 'completed' && styles.filterChipActive,
            ]}
            onPress={() => setFilter('completed')}>
            <Icon
              name="checkmark-circle"
              size={16}
              color={
                filter === 'completed'
                  ? appColors.success
                  : appColors.textSecondary
              }
            />
            <Text
              style={[
                styles.filterText,
                filter === 'completed' && styles.filterTextActive,
              ]}>
              Terminées
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filter === 'incomplete' && styles.filterChipActive,
            ]}
            onPress={() => setFilter('incomplete')}>
            <Icon
              name="close-circle"
              size={16}
              color={
                filter === 'incomplete'
                  ? appColors.warning
                  : appColors.textSecondary
              }
            />
            <Text
              style={[
                styles.filterText,
                filter === 'incomplete' && styles.filterTextActive,
              ]}>
              Incomplètes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Liste des sessions */}
        <View style={styles.sessionsContainer}>
          {isLoading ? (
            <LoadingView />
          ) : filteredSessions.length === 0 ? (
            <EmptyState
              icon="fitness-outline"
              title="Aucune séance"
              message={
                filter === 'all'
                  ? 'Commence ton premier entraînement !'
                  : `Aucune séance ${
                      filter === 'completed' ? 'terminée' : 'incomplète'
                    }`
              }
            />
          ) : (
            filteredSessions.map(session => (
              <WorkoutSessionCard
                key={session.sessionId}
                session={session}
                onPress={() => handleSessionPress(session)}
                onLike={() => toggleLike(session.sessionId)}
              />
            ))
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
  },
  header: {
    paddingBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 0,
    zIndex: 10,
    padding: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: `${appColors.backgroundLight}80`,
    borderWidth: 1,
    borderColor: `${appColors.border}40`,
  },
  filterChipActive: {
    backgroundColor: `${appColors.primary}20`,
    borderColor: appColors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  filterTextActive: {
    color: appColors.primary,
  },
  sessionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  bottomSpacing: {
    height: 80,
  },
});

export default WorkoutSessionsScreen;
