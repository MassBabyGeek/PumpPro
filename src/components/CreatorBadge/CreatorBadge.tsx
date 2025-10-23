import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {UserCreator} from '../../types/user.types';
import appColors from '../../assets/colors';
import {useUser} from '../../hooks';

interface CreatorBadgeProps {
  creator?: UserCreator;
  isOfficial?: boolean;
  style?: any;
  size?: 'small' | 'medium' | 'large';
  showAvatar?: boolean;
}

const CreatorBadge: React.FC<CreatorBadgeProps> = ({
  creator,
  isOfficial = false,
  style,
  size = 'medium',
  showAvatar = true,
}) => {
  const navigation = useNavigation<any>();
  const {user: currentUser} = useUser();

  const isCurrentUser = currentUser?.id === creator?.id;

  // Déterminer le texte et l'icône à afficher
  const getDisplayInfo = () => {
    if (isOfficial || !creator) {
      return {
        text: 'Officiel',
        icon: 'shield-checkmark',
        color: appColors.primary,
        isClickable: false,
      };
    }

    if (isCurrentUser) {
      return {
        text: 'Vous',
        icon: 'person',
        color: appColors.success,
        isClickable: false,
      };
    }

    return {
      text: creator.name,
      icon: 'person-circle',
      color: appColors.textSecondary,
      isClickable: true,
    };
  };

  const displayInfo = getDisplayInfo();

  const handlePress = () => {
    if (displayInfo.isClickable && creator) {
      navigation.navigate('UserProfile', {
        userId: creator.id,
        userName: creator.name,
      });
    }
  };

  const sizeStyles = {
    small: {
      fontSize: 11,
      iconSize: 14,
      avatarSize: 16,
      padding: 4,
      gap: 4,
    },
    medium: {
      fontSize: 12,
      iconSize: 16,
      avatarSize: 20,
      padding: 6,
      gap: 6,
    },
    large: {
      fontSize: 14,
      iconSize: 18,
      avatarSize: 24,
      padding: 8,
      gap: 8,
    },
  };

  const currentSize = sizeStyles[size];

  const Container = displayInfo.isClickable ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        {
          paddingHorizontal: currentSize.padding * 2,
          paddingVertical: currentSize.padding,
          gap: currentSize.gap,
        },
        style,
      ]}
      onPress={displayInfo.isClickable ? handlePress : undefined}
      activeOpacity={displayInfo.isClickable ? 0.7 : 1}>
      {showAvatar && creator?.avatar && !isOfficial ? (
        <Image
          source={{uri: creator.avatar}}
          style={[
            styles.avatar,
            {
              width: currentSize.avatarSize,
              height: currentSize.avatarSize,
              borderRadius: currentSize.avatarSize / 2,
            },
          ]}
        />
      ) : (
        <Icon
          name={displayInfo.icon}
          size={currentSize.iconSize}
          color={displayInfo.color}
        />
      )}
      <Text
        style={[
          styles.text,
          {fontSize: currentSize.fontSize, color: displayInfo.color},
        ]}>
        {displayInfo.text}
      </Text>
      {displayInfo.isClickable && (
        <Icon
          name="chevron-forward"
          size={currentSize.iconSize - 2}
          color={displayInfo.color}
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${appColors.textSecondary}15`,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  avatar: {
    resizeMode: 'cover',
  },
  text: {
    fontWeight: '600',
  },
});

export default CreatorBadge;
