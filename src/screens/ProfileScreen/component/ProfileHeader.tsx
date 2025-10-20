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
  onChangeAvatar: () => void;
};

const ProfileHeader = ({
  user,
  isUploading,
  onChangeAvatar,
}: ProfileHeaderProps) => {
  return (
    <View style={styles.profileHeader}>
      {/* Left Section: Avatar + User Info */}
      <View style={styles.leftSection}>
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
            onPress={onChangeAvatar}
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

      {/* Right Section: Points Card */}
      <View style={styles.pointsCard}>
        <Icon name="star" size={32} color="#FFD700" />
        <Text style={styles.pointsLabel}>Points</Text>
        <Text style={styles.pointsValue}>
          {user.score ? user.score.toLocaleString() : '0'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
    gap: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
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
  pointsCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD70010',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 6,
    minWidth: 110,
  },
  pointsLabel: {
    fontSize: 11,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
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
});

export default ProfileHeader;
