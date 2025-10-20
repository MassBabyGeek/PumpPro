import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

const SocialLoginSection = () => {
  return (
    <>
      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OU</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social buttons désactivés */}
      <TouchableOpacity style={styles.socialButtonDisabled} disabled>
        <Icon name="logo-google" size={20} color={appColors.textSecondary} />
        <Text style={styles.socialButtonTextDisabled}>
          Continuer avec Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButtonDisabled} disabled>
        <Icon name="logo-apple" size={20} color={appColors.textSecondary} />
        <Text style={styles.socialButtonTextDisabled}>
          Continuer avec Apple
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: appColors.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  socialButtonDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: `${appColors.border}30`, // gris clair
    borderWidth: 1.5,
    borderColor: `${appColors.border}50`, // bordure gris clair
    gap: 12,
    marginBottom: 12,
  },
  socialButtonTextDisabled: {
    fontSize: 15,
    color: appColors.textSecondary, // texte gris
    fontWeight: '600',
  },
});

export default SocialLoginSection;
