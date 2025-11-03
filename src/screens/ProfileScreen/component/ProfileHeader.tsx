import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import {UserProfile} from '../../../types/user.types';

type ProfileHeaderProps = {
  user: UserProfile;
  isUploading: boolean;
  onChangeAvatar?: () => void; // Optionnel pour les profils en lecture seule
  showEmail?: boolean; // Afficher l'email ou non (par défaut true)
};

const ProfileHeader = ({
  user,
  isUploading,
  onChangeAvatar,
  showEmail = true,
}: ProfileHeaderProps) => {
  return (
    <View style={styles.profileHeader}>
      {/* Avatar centré */}
      <View style={styles.avatarContainer}>
        {user.avatar ? (
          <Image
            source={{uri: user.avatar}}
            style={styles.avatar}
            key={user.id || user.avatar} // Force re-render si l'avatar change
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="person" size={48} color={appColors.textSecondary} />
          </View>
        )}
        {/* Afficher le bouton d'édition seulement si onChangeAvatar est fourni */}
        {onChangeAvatar && (
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={onChangeAvatar}
            disabled={isUploading}>
            {isUploading ? (
              <ActivityIndicator size="small" color={appColors.background} />
            ) : (
              <Icon name="camera" size={20} color={appColors.background} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* User Info centré */}
      <Text style={styles.userName}>{user.name}</Text>
      {showEmail && <Text style={styles.userEmail}>{user.email}</Text>}

      {user.goal && (
        <View style={styles.goalContainer}>
          <Icon name="flag" size={14} color={appColors.primary} />
          <Text style={styles.goalText}>{user.goal}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: appColors.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: appColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: appColors.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: appColors.backgroundLight,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: appColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${appColors.primary}15`,
    borderRadius: 12,
  },
  goalText: {
    fontSize: 12,
    color: appColors.primary,
    fontWeight: '600',
  },
});

export default ProfileHeader;
