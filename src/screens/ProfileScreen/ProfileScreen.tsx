import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppTitle from '../../components/AppTitle/AppTitle';
import StatCard from '../../components/StatCard/StatCard';
import WorkoutChart from '../../components/WorkoutChart/WorkoutChart';
import appColors from '../../assets/colors';
import {MOCK_STATS} from '../../data/mockData';
import {formatTime} from '../../utils/workout.utils';
import {useImagePicker} from '../../hooks/useImagePicker';
import {useAuth} from '../../hooks/useAuth';
import {useModal} from '../../hooks/useModal';
import QuoteCard from '../../components/QuoteCard/QuoteCard';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import InfoCard from '../../components/InfoCard/InfoCard';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = () => {
  const {user, logout, updateUser} = useAuth();
  const [stats] = useState(MOCK_STATS);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'year'
  >('week');

  const {pickAndUploadImage, isUploading} = useImagePicker();
  const logoutModal = useModal();

  const currentStats = stats[selectedPeriod];

  const handleChangeAvatar = async () => {
    const imageUrl = await pickAndUploadImage();
    if (imageUrl) {
      // Mettre à jour l'avatar via le contexte
      try {
        await updateUser({avatar: imageUrl});
        Alert.alert('Succès', 'Photo de profil mise à jour !');
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de mettre à jour la photo de profil');
      }
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Modifier le profil', 'Fonctionnalité à venir...');
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
            await logout();
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
          } catch (error) {
            Alert.alert('Erreur', 'Impossible de se déconnecter');
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
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{uri: user.avatar}} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={48} color={appColors.textSecondary} />
              </View>
            )}
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleChangeAvatar}
              disabled={isUploading}>
              {isUploading ? (
                <ActivityIndicator size="small" color={appColors.background} />
              ) : (
                <Icon name="camera" size={16} color={appColors.background} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {user.goal && (
              <View style={styles.goalContainer}>
                <Icon name="flag" size={14} color={appColors.primary} />
                <Text style={styles.goalText}>{user.goal}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Infos personnelles */}
        <View style={styles.section}>
          <SectionTitle title="Informations" />
          <View style={styles.infoGrid}>
            {user.age && (
              <InfoCard
                icon="calendar-outline"
                label="Âge"
                value={`${user.age} ans`}
              />
            )}
            {user.weight && (
              <InfoCard
                icon="fitness-outline"
                label="Poids"
                value={`${user.weight} kg`}
              />
            )}
            {user.height && (
              <InfoCard
                icon="resize-outline"
                label="Taille"
                value={`${user.height} cm`}
              />
            )}
            {user.joinDate && (
              <InfoCard
                icon="time-outline"
                label="Membre depuis"
                value={new Date(user.joinDate).toLocaleDateString('fr-FR', {
                  month: 'short',
                  year: 'numeric',
                })}
              />
            )}
          </View>
        </View>

        {/* Statistiques - Sélecteur de période */}
        <View style={styles.section}>
          <SectionTitle title="Statistiques" />
          <View style={styles.periodSelector}>
            {(['today', 'week', 'month', 'year'] as const).map(period => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.activePeriod,
                ]}
                onPress={() => setSelectedPeriod(period)}>
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period && styles.activePeriodText,
                  ]}>
                  {period === 'today'
                    ? 'Jour'
                    : period === 'week'
                      ? 'Semaine'
                      : period === 'month'
                        ? 'Mois'
                        : 'Année'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Cartes de stats */}
          <View style={styles.statsGrid}>
            <StatCard
              icon="fitness"
              label="Total pompes"
              value={currentStats.totalPushUps}
              color={appColors.primary}
            />
            <StatCard
              icon="flame"
              label="Calories"
              value={currentStats.totalCalories.toFixed(0)}
              unit="kcal"
              color={appColors.accent}
            />
            <StatCard
              icon="barbell"
              label="Séances"
              value={currentStats.totalWorkouts}
              color={appColors.success}
            />
            <StatCard
              icon="time"
              label="Temps total"
              value={formatTime(currentStats.totalTime)}
              color={appColors.warning}
            />
            <StatCard
              icon="trophy"
              label="Meilleure session"
              value={currentStats.bestSession}
              unit="pompes"
              color={appColors.primary}
            />
            <StatCard
              icon="stats-chart"
              label="Moyenne"
              value={currentStats.averagePushUps.toFixed(1)}
              unit="pompes"
              color={appColors.accent}
            />
          </View>
        </View>

        {/* Graphique de progression */}
        <View style={styles.section}>
          <WorkoutChart />
        </View>

        {/* Actions du compte */}
        <View style={styles.section}>
          <SectionTitle title="Compte" />
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Icon
              name="log-out-outline"
              size={20}
              color={appColors.textPrimary}
            />
            <Text style={styles.actionButtonText}>Se déconnecter</Text>
            <Icon
              name="chevron-forward"
              size={20}
              color={appColors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDeleteAccount}>
            <Icon name="trash-outline" size={20} color={appColors.error} />
            <Text style={[styles.actionButtonText, styles.dangerText]}>
              Supprimer mon compte
            </Text>
            <Icon name="chevron-forward" size={20} color={appColors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>PompeurPro © 2025</Text>
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
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 40,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: appColors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: appColors.error,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ProfileScreen;
