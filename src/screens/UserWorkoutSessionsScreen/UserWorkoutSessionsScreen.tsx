import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import appColors from '../../assets/colors';
import {WorkoutSessionCard, AppRefreshControl} from '../../components';
import {WorkoutSession} from '../../types/workout.types';
import {workoutService} from '../../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import AppTitle from '../../components/AppTitle/AppTitle';

interface UserWorkoutSessionsScreenRouteProp {
  userId: string;
  userName?: string;
}

const UserWorkoutSessionsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {userId, userName} = route.params as UserWorkoutSessionsScreenRouteProp;

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await workoutService.getWorkoutSessions(userId);
      setSessions(data);
    } catch (error) {
      console.error('Error loading workout sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSessions();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleLike = async (sessionId: string) => {
    try {
      await workoutService.likeWorkout(sessionId);
      // Reload sessions to get updated like status
      await loadSessions();
    } catch (error) {
      console.error('Error liking workout:', error);
    }
  };

  const renderSession = ({item}: {item: WorkoutSession}) => (
    <WorkoutSessionCard
      session={item}
      onLike={() => handleLike(item.sessionId)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="fitness-outline" size={60} color={appColors.textSecondary} />
      <Text style={styles.emptyText}>
        Aucune séance d'entraînement pour le moment
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradientContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={appColors.textPrimary} />
          </TouchableOpacity>
          <AppTitle
            greeting={`🏋️ Séances de ${userName || 'cet utilisateur'}`}
            subGreeting="Historique complet"
            showIcon={false}
          />
        </View>

        {/* Sessions List */}
        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={item => item.sessionId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <AppRefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={!isLoading ? renderEmpty : null}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: appColors.border + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
});

export default UserWorkoutSessionsScreen;
