import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';

type GradientButtonProps = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  outlined?: boolean;
  icon?: string;
  iconSize?: number;
  fontSize?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  style?: any;
};

const GradientButton = ({
  text,
  onPress,
  disabled = false,
  isLoading = false,
  outlined = false,
  icon,
  iconSize = 20,
  fontSize = 17,
  paddingHorizontal = 40,
  paddingVertical = 16,
  style,
}: GradientButtonProps) => {
  const colors = isLoading
    ? [appColors.textSecondary, appColors.textSecondary]
    : outlined
      ? ['transparent', 'transparent']
      : [appColors.primary, appColors.accent];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[styles.buttonContainer, style]}>
      <LinearGradient
        colors={colors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.button, outlined && styles.outlinedButton]}>
        <View
          style={[styles.buttonContent, {paddingHorizontal, paddingVertical}]}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              {icon && (
                <Icon
                  name={icon}
                  size={iconSize}
                  color={outlined ? appColors.primary : '#fff'}
                />
              )}
              <Text
                style={[
                  styles.buttonText,
                  {fontSize},
                  outlined && styles.outlinedText,
                ]}>
                {text}
              </Text>
            </>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
  },
  button: {
    alignItems: 'center',
    borderRadius: 14,
    shadowColor: appColors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  outlinedButton: {
    borderWidth: 2,
    borderColor: appColors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 10,
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  outlinedText: {
    color: appColors.primary,
  },
});

export default GradientButton;
