import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import appColors from '../../assets/colors';
import {BaseToastProps} from 'react-native-toast-message';

const getToastConfig = (type: 'success' | 'error' | 'info' | 'warning') => {
  switch (type) {
    case 'success':
      return {
        icon: 'checkmark-circle',
        colors: [appColors.success, '#2D7A4F'],
        iconColor: '#FFFFFF',
      };
    case 'error':
      return {
        icon: 'close-circle',
        colors: [appColors.error, '#A31D1D'],
        iconColor: '#FFFFFF',
      };
    case 'info':
      return {
        icon: 'information-circle',
        colors: [appColors.primary, '#2563EB'],
        iconColor: '#FFFFFF',
      };
    case 'warning':
      return {
        icon: 'warning',
        colors: [appColors.warning, '#D97706'],
        iconColor: '#FFFFFF',
      };
    default:
      return {
        icon: 'information-circle',
        colors: [appColors.primary, '#2563EB'],
        iconColor: '#FFFFFF',
      };
  }
};

interface CustomToastProps extends BaseToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
}

export const CustomToast = ({text1, text2, type}: CustomToastProps) => {
  const config = getToastConfig(type);

  return (
    <LinearGradient
      colors={config.colors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={styles.linearGradient}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name={config.icon} size={28} color={config.iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{text1}</Text>
          {text2 && <Text style={styles.message}>{text2}</Text>}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    borderRadius: 16,
  },
  container: {
    width: '90%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start', // alignement haut pour l'icône
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 4, // centre l'icône par rapport au texte multi-lignes
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.9,
  },
});

export const toastConfig = {
  success: (props: BaseToastProps) => <CustomToast {...props} type="success" />,
  error: (props: BaseToastProps) => <CustomToast {...props} type="error" />,
  info: (props: BaseToastProps) => <CustomToast {...props} type="info" />,
  warning: (props: BaseToastProps) => <CustomToast {...props} type="warning" />,
};
