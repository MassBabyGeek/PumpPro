import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppTitle from '../../components/AppTitle/AppTitle';
import Footer from '../../components/Footer';
import appColors from '../../assets/colors';
import {useImagePicker} from '../../hooks/useImagePicker';
import {useAuth, useUser, useToast, useWorkouts} from '../../hooks';
import QuoteCard from '../../components/QuoteCard/QuoteCard';
import LinearGradient from 'react-native-linear-gradient';
import ProfileHeader from './component/ProfileHeader';
import PersonalInfoSection from './component/PersonalInfoSection';
import StatsSection from './component/StatsSection';
import AccountActionsSection from './component/AccountActionsSection';
import {WorkoutChart, AppRefreshControl} from '../../components';
import FeedbackModal from '../../components/FeedbackModal/FeedbackModal';
import EditProfileModal from '../../components/EditProfileModal/EditProfileModal';
import RecentWorkoutsSection from '../HomeScreen/component/RecentWorkoutsSection';

const ProfileScreen = () => {
  const {logout} = useAuth();
  const {user, updateUser, deleteAccount, getUser, setStatsPeriod, reloadUser} =
    useUser();
  const {toastError, toastSuccess} = useToast();
  const navigation = useNavigation<any>();
  const {
    workouts,
    isLoading: workoutsLoading,
    loadWorkouts,
    toggleLike,
  } = useWorkouts();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'year'
  >('week');
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] =
    useState(false);

  const {pickAndUploadImage, isUploading} = useImagePicker();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      reloadUser(),
      setStatsPeriod(selectedPeriod),
      user?.id ? loadWorkouts(user.id) : null,
    ]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        getUser(),
        setStatsPeriod(selectedPeriod),
        user?.id ? loadWorkouts(user.id) : null,
      ]);
    };
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeAvatar = async () => {
    const imageUrl = await pickAndUploadImage();
    if (imageUrl) {
      // Mettre à jour l'avatar via le contexte
      try {
        await updateUser({avatar: imageUrl});
        toastSuccess('Succès', 'Photo de profil mise à jour !');
      } catch (error) {
        toastError('Erreur', 'Impossible de mettre à jour la photo de profil');
      }
    }
  };

  const handleEditProfile = () => {
    setIsEditProfileModalVisible(true);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        {text: 'Annuler', style: 'cancel'},
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implémenter la suppression du compte backend
            await deleteAccount();
            Alert.alert('Compte supprimé', 'Au revoir ! 👋');
          },
        },
      ],
    );
  };

  const handleLogout = () => {
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
  };

  const handleOpenFeedback = () => {
    setIsFeedbackModalVisible(true);
  };

  const handleViewAllWorkouts = useCallback(() => {
    navigation.navigate('WorkoutSessions');
  }, [navigation]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Utilisateur non connecté</Text>
      </View>
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
          <QuoteCard
            style={styles.quote}
            quote="« Le plus grand bien-être est la force de vivre. » — Lao Tzu"
          />

          {/* Avatar et Info utilisateur */}
          <ProfileHeader
            user={user}
            isUploading={isUploading}
            onChangeAvatar={handleChangeAvatar}
          />

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
            onLike={toggleLike}
            onViewAll={handleViewAllWorkouts}
          />

          {/* Actions du compte */}
          <AccountActionsSection
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
            onFeedback={handleOpenFeedback}
          />

          <Footer />
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
    paddingBottom: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  quote: {
    marginVertical: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: appColors.background,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: appColors.textSecondary,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  goalText: {
    fontSize: 12,
    color: appColors.primary,
    fontStyle: 'italic',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: appColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 40,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: appColors.background,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  activePeriod: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  periodText: {
    fontSize: 12,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  activePeriodText: {
    color: appColors.background,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: appColors.border + '30',
    borderRadius: 12,
    gap: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: appColors.error + '10',
    borderWidth: 1,
    borderColor: appColors.error + '30',
  },
  dangerText: {
    color: appColors.error,
  },
  errorText: {
    fontSize: 16,
    color: appColors.error,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ProfileScreen;
