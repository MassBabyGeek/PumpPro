import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import Logo from '../../../components/Logo/Logo';

type Props = {
  onBack: () => void;
  showBackButton?: boolean;
};

const SignUpHeader = ({onBack, showBackButton = true}: Props) => {
  return (
    <>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" size={24} color={appColors.textPrimary} />
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo size={120} />
        </View>
        <Text style={styles.title}>Créer un compte 💪</Text>
        <Text style={styles.subtitle}>Rejoins la communauté PompeurPro</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${appColors.border}50`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
});

export default SignUpHeader;
