import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AppTitle from '../../components/AppTitle/AppTitle';
import WorkoutChart from '../../components/WorkoutChart/WorkoutChart';
import Footer from '../../components/Footer';
import appColors from '../../assets/colors';
import {useImagePicker} from '../../hooks/useImagePicker';
import {useAuth} from '../../hooks/useAuth';
import QuoteCard from '../../components/QuoteCard/QuoteCard';
import LinearGradient from 'react-native-linear-gradient';
import ProfileHeader from './component/ProfileHeader';
import PersonalInfoSection from './component/PersonalInfoSection';
import StatsSection from './component/StatsSection';
import AccountActionsSection from './component/AccountActionsSection';
import {AppStackParamList} from '../../types/navigation.types';
import {userService} from '../../services/api';
import {Stats} from '../../types/user.types';

type ProfileScreenNavigationProp = StackNavigationProp<AppStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const {user, logout, updateUser, deleteAccount, getToken} = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'year'
  >('week');

  const {pickAndUploadImage, isUploading} = useImagePicker();

  const loadStats = useCallback(async () => {
    if (!user) return;

    const token = await getToken();
    try {
      setIsLoadingStats(true);
      const stats = await userService.getStats(
        user.id,
        selectedPeriod,
        token || undefined,
      );
      setStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les statistiques',
      });
    } finally {
      setIsLoadingStats(false);
    }
  }, [user, getToken, selectedPeriod]);

  // Charger les statistiques utilisateur
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const currentStats = stats || {
    totalPushUps: 0,
    totalWorkouts: 0,
    totalCalories: 0,
    totalTime: 0,
    averagePushUps: 0,
    bestSession: 0,
  };

  const handleChangeAvatar = async () => {
    const imageUrl = await pickAndUploadImage();
    if (imageUrl) {
      // Mettre à jour l'avatar via le contexte
      try {
        await updateUser({avatar: imageUrl});
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Photo de profil mise à jour !',
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'Impossible de mettre à jour la photo de profil',
        });
      }
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
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
            Toast.show({
              type: 'success',
              text1: 'Déconnexion réussie',
              text2: 'À bientôt !',
            });
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Erreur',
              text2: 'Impossible de se déconnecter',
            });
          }
        },
      },
    ]);
  };

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
        keyboardShouldPersistTaps="handled">
        <AppTitle
          greeting="👤 Mon profil"
          subGreeting="Mon compte personnel"
          showIcon={true}
          onIconPress={handleEditProfile}
          iconName="create-outline"
        />

        <QuoteCard
          style={styles.quote}
          quote="“ Le plus grand bien-être est la force de vivre. ” — Lao Tzu"
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
          currentStats={currentStats}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          isLoading={isLoadingStats}
        />

        {/* Graphique de progression */}
        <View style={styles.section}>
          <WorkoutChart />
        </View>

        {/* Actions du compte */}
        <AccountActionsSection
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />

        <Footer />
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
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 120,
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
