import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

const LoginHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={[appColors.primary, appColors.accent]}
          style={styles.logoGradient}>
          <Icon name="fitness" size={60} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={styles.title}>Bon retour! 👋</Text>
      <Text style={styles.subtitle}>Connecte-toi pour continuer</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: appColors.primary,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
});

export default LoginHeader;
