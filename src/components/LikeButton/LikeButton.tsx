import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';

export interface LikeButtonProps {
  likes: number;
  userLiked: boolean;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'inline' | 'badge' | 'standalone';
  showCount?: boolean;
  style?: ViewStyle;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  likes,
  userLiked,
  onPress,
  size = 'medium',
  variant = 'inline',
  showCount = true,
  style,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const iconSize = {
    small: 12,
    medium: 16,
    large: 18,
  }[size];

  const fontSize = {
    small: 11,
    medium: 13,
    large: 13,
  }[size];

  const getContainerStyle = () => {
    const baseStyle: ViewStyle[] = [styles.container];

    if (variant === 'badge') {
      baseStyle.push(styles.badgeContainer);
    } else if (variant === 'standalone') {
      baseStyle.push(styles.standaloneContainer);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const handlePress = (e?: any) => {
    e?.stopPropagation?.();
    onPress();
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={handlePress}
      activeOpacity={0.7}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      <Icon
        name={userLiked ? 'heart' : 'heart-outline'}
        size={iconSize}
        color={userLiked ? appColors.error : appColors.textSecondary}
      />
      {showCount && (
        <Text
          style={[
            styles.text,
            {fontSize},
            userLiked && variant === 'standalone' && {color: appColors.error},
          ]}>
          {formatNumber(likes)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 32,
    justifyContent: 'center',
  },
  badgeContainer: {
    backgroundColor: `${appColors.background}80`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  standaloneContainer: {
    backgroundColor: `${appColors.border}20`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  text: {
    color: appColors.textSecondary,
    fontWeight: '600',
  },
});

export default LikeButton;
