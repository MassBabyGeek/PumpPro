import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppTitle from '../../components/AppTitle/AppTitle';
import Footer from '../../components/Footer';
import appColors from '../../assets/colors';
import {useImagePicker} from '../../hooks/useImagePicker';
import {useAuth, useUser, useToast, useWorkouts, useTabBarHeight} from '../../hooks';
import {useCalibrationContext} from '../../contexts/CalibrationContext';
import LinearGradient from 'react-native-linear-gradient';
import ProfileHeader from './component/ProfileHeader';
import QuickStats from './component/QuickStats';
import PersonalInfoSection from './component/PersonalInfoSection';
import StatsSection from './component/StatsSection';
import AccountActionsSection from './component/AccountActionsSection';
import ProfileScreenSkeleton from './component/ProfileScreenSkeleton';
import {WorkoutChart, AppRefreshControl} from '../../components';
import FeedbackModal from '../../components/FeedbackModal/FeedbackModal';
import EditProfileModal from '../../components/EditProfileModal/EditProfileModal';
import RecentWorkoutsSection from '../HomeScreen/component/RecentWorkoutsSection';

const ProfileScreen = () => {
  const {logout} = useAuth();
  const {user, setStatsPeriod, reloadUser} = useUser();
  const {toastError, toastSuccess} = useToast();
  const navigation = useNavigation<any>();
  const {
    workouts,
    isLoading: workoutsLoading,
    loadWorkouts,
    toggleLike,
  } = useWorkouts();
  const {contentPaddingBottom} = useTabBarHeight();
  const {resetCalibration} = useCalibrationContext();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'year'
  >('week');
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] =
    useState(false);

  const {pickAndUploadImage, isUploading} = useImagePicker();

  // Utiliser un ref pour éviter les appels multiples
  const hasLoadedInitialData = useRef(false);
  const currentUserId = useRef<string | null>(null);

  // Fonction stable pour charger les stats avec useMemo
  const loadStatsForPeriod = useCallback(
    async (period: 'today' | 'week' | 'month' | 'year') => {
      if (!user?.id) return;
      try {
        await setStatsPeriod(period);
      } catch (error) {
        // Erreur silencieuse
      }
    },
    [user?.id, setStatsPeriod],
  );

  // Fonction stable pour charger les workouts avec useMemo
  const loadUserWorkouts = useCallback(async () => {
    if (!user?.id) return;
    try {
      await loadWorkouts(user.id);
    } catch (error) {
      // Erreur silencieuse
    }
  }, [user?.id, loadWorkouts]);

  // Charger les données initiales une seule fois quand user?.id change
  useEffect(() => {
    // Ne charger que si l'ID a changé ou si c'est la première fois
    if (user?.id && currentUserId.current !== user.id) {
      currentUserId.current = user.id;
      hasLoadedInitialData.current = true;

      // Charger stats et workouts en parallèle
      Promise.all([
        loadStatsForPeriod(selectedPeriod),
        loadUserWorkouts(),
      ]);
    }
  }, [user?.id, selectedPeriod, loadStatsForPeriod, loadUserWorkouts]);

  // Recharger quand on revient sur l'écran (après édition profil)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Seulement si on a déjà des données
      if (hasLoadedInitialData.current && user?.id) {
        reloadUser();
      }
    });

    return () => unsubscribe();
  }, [navigation, reloadUser, user?.id]);

  // Recharger les stats quand la période change (mais pas au premier render)
  useEffect(() => {
    // Ne déclencher que si on a déjà chargé les données initiales
    if (hasLoadedInitialData.current && user?.id) {
      loadStatsForPeriod(selectedPeriod);
    }
  }, [selectedPeriod, user?.id, loadStatsForPeriod]);

  const handleRefresh = useCallback(async () => {
    if (!user?.id) return;

    setIsRefreshing(true);

    try {
      // Reload user first
      const freshUser = await reloadUser();

      // Then reload stats and workouts with the fresh user
      if (freshUser?.id) {
        await Promise.all([
          loadStatsForPeriod(selectedPeriod),
          loadWorkouts(freshUser.id),
        ]);
      }
    } catch (error) {
      // Erreur silencieuse
    } finally {
      setIsRefreshing(false);
    }
  }, [user?.id, reloadUser, selectedPeriod, loadStatsForPeriod, loadWorkouts]);

  const handleChangeAvatar = useCallback(async () => {
    try {
      const imageUrl = await pickAndUploadImage();
      if (imageUrl) {
        toastSuccess('Succès', 'Photo de profil mise à jour !');
      }
    } catch (error) {
      toastError('Erreur', 'Impossible de mettre à jour la photo de profil');
    }
  }, [pickAndUploadImage, toastSuccess, toastError]);

  const handleEditProfile = useCallback(() => {
    setIsEditProfileModalVisible(true);
  }, []);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        {text: 'Annuler', style: 'cancel'},
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Alert.alert('Compte supprimé', 'Au revoir ! 👋');
            } catch (error) {
              toastError('Erreur', 'Impossible de supprimer le compte');
            }
          },
        },
      ],
    );
  }, [logout, toastError]);

  const handleLogout = useCallback(() => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      {text: 'Annuler', style: 'cancel'},
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            toastSuccess('Déconnexion réussie', 'À bientôt !');
          } catch (error) {
            toastError('Erreur', 'Impossible de se déconnecter');
          }
        },
      },
    ]);
  }, [logout, toastSuccess, toastError]);

  const handleOpenFeedback = useCallback(() => {
    setIsFeedbackModalVisible(true);
  }, []);

  const handleRecalibrate = useCallback(() => {
    Alert.alert(
      'Recalibrer mes pompes',
      'Voulez-vous recalibrer la détection de vos pompes ? Cela réinitialisera vos réglages actuels et vous guidera à travers le processus de calibration.',
      [
        {text: 'Annuler', style: 'cancel'},
        {
          text: 'Recalibrer',
          style: 'default',
          onPress: async () => {
            try {
              await resetCalibration();
              navigation.navigate('FirstChallenge', {isRecalibration: true});
              toastSuccess(
                'Calibration réinitialisée',
                'Suivez les instructions pour recalibrer',
              );
            } catch (error) {
              toastError('Erreur', 'Impossible de réinitialiser la calibration');
            }
          },
        },
      ],
    );
  }, [resetCalibration, navigation, toastSuccess, toastError]);

  const handleViewAllWorkouts = useCallback(() => {
    navigation.navigate('WorkoutSessions');
  }, [navigation]);

  const handleToggleLike = useCallback(
    (workoutId: string) => {
      toggleLike(workoutId);
    },
    [toggleLike],
  );

  // Skeleton si pas de user ou en cours de rafraîchissement initial
  if (!user || (isRefreshing && !user.stats)) {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.gradientContainer}>
        <ProfileScreenSkeleton />
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
        <View style={styles.header}>
          <AppTitle
            greeting="👤 Mon profil"
            subGreeting="Mon compte personnel"
            showIcon={true}
            onIconPress={handleEditProfile}
            iconName="create-outline"
          />
        </View>

        <View style={styles.content}>
          {/* Avatar et Info utilisateur */}
          <ProfileHeader
            user={user}
            isUploading={isUploading}
            onChangeAvatar={handleChangeAvatar}
          />

          {/* Quick Stats */}
          <QuickStats user={user} />

          {/* Infos personnelles */}
          <PersonalInfoSection user={user} />

          {/* Statistiques - Sélecteur de période */}
          <StatsSection
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />

          {/* Graphique de progression */}
          <View style={styles.section}>
            <WorkoutChart />
          </View>

          {/* Mes dernières séances */}
          <RecentWorkoutsSection
            sessions={workouts}
            isLoading={workoutsLoading}
            onLike={handleToggleLike}
            onViewAll={handleViewAllWorkouts}
          />

          {/* Actions du compte */}
          <AccountActionsSection
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
            onFeedback={handleOpenFeedback}
            onRecalibrate={handleRecalibrate}
          />

          <Footer />

          <View style={{height: contentPaddingBottom}} />
        </View>
      </ScrollView>

      <FeedbackModal
        visible={isFeedbackModalVisible}
        onClose={() => setIsFeedbackModalVisible(false)}
      />

      <EditProfileModal
        visible={isEditProfileModalVisible}
        onClose={() => setIsEditProfileModalVisible(false)}
      />
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 40,
  },
});

export default ProfileScreen;
