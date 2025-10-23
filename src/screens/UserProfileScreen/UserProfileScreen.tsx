import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AppTitle from '../../components/AppTitle/AppTitle';
import Footer from '../../components/Footer';
import appColors from '../../assets/colors';
import {useUserProfile, useWorkouts} from '../../hooks';
import QuoteCard from '../../components/QuoteCard/QuoteCard';
import LinearGradient from 'react-native-linear-gradient';
import ProfileHeader from '../ProfileScreen/component/ProfileHeader';
import PersonalInfoSection from '../ProfileScreen/component/PersonalInfoSection';
import StatsSection from '../ProfileScreen/component/StatsSection';
import {WorkoutChart, AppRefreshControl} from '../../components';
import RecentWorkoutsSection from '../HomeScreen/component/RecentWorkoutsSection';
import Icon from 'react-native-vector-icons/Ionicons';

interface UserProfileScreenRouteProp {
  userId: string;
  userName?: string;
}

const UserProfileScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {userId, userName} = route.params as UserProfileScreenRouteProp;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'year'
  >('week');

  // Utiliser le hook useUserProfile pour charger les données de l'utilisateur spécifique
  const {
    user,
    isLoading,
    loadUserProfile,
    setStatsPeriod,
    loadChartData,
  } = useUserProfile(userId);

  const {
    workouts,
    isLoading: workoutsLoading,
    loadWorkouts,
    toggleLike,
  } = useWorkouts();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadUserProfile(),
      setStatsPeriod(selectedPeriod),
      loadWorkouts(userId),
      loadChartData('week'),
    ]);
    setIsRefreshing(false);
  };

  // Load user on mount
  useEffect(() => {
    loadUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Load stats and workouts when user is available
  useEffect(() => {
    if (userId) {
      const loadUserData = async () => {
        await Promise.all([
          setStatsPeriod(selectedPeriod),
          loadWorkouts(userId),
          loadChartData('week'),
        ]);
      };
      loadUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleViewAllWorkouts = () => {
    navigation.navigate('UserWorkoutSessions', {userId, userName: user?.name});
  };

  if (isLoading && !user) {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.gradientContainer}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement du profil...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!user) {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.gradientContainer}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Utilisateur introuvable</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradientContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <AppRefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }>
        {/* Header avec bouton retour */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={appColors.textPrimary} />
          </TouchableOpacity>
          <AppTitle
            greeting={`👤 ${userName || user.name}`}
            subGreeting="Profil utilisateur"
            showIcon={false}
          />
        </View>

        <View style={styles.content}>
          <QuoteCard
            style={styles.quote}
            quote="« Le plus grand bien-être est la force de vivre. » — Lao Tzu"
          />

          {/* Avatar et Info utilisateur (sans possibilité de modifier) */}
          <ProfileHeader
            user={user}
            isUploading={false}
            onChangeAvatar={undefined} // Pas de modification d'avatar
          />

          {/* Infos personnelles */}
          <PersonalInfoSection user={user} />

          {/* Statistiques - Sélecteur de période */}
          <StatsSection
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            userId={userId}
          />

          {/* Graphique de progression */}
          <View style={styles.section}>
            <WorkoutChart userId={userId} />
          </View>

          {/* Dernières séances de l'utilisateur */}
          <RecentWorkoutsSection
            sessions={workouts}
            isLoading={workoutsLoading}
            onLike={toggleLike}
            onViewAll={handleViewAllWorkouts}
          />

          <Footer />
        </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 60,
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
  content: {
    paddingHorizontal: 20,
  },
  quote: {
    marginVertical: 20,
  },
  section: {
    marginBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: appColors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: appColors.error,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default UserProfileScreen;
