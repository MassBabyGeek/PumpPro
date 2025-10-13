import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import appColors from '../../assets/colors';

type Props = {
  text: string;
  linkText: string;
  onLinkPress: () => void;
  disabled?: boolean;
};

const AuthFooter = ({text, linkText, onLinkPress, disabled}: Props) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={onLinkPress} disabled={disabled}>
        <Text style={styles.footerText}>
          {text} <Text style={styles.footerLink}>{linkText}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    paddingTop: 32,
  },
  footerText: {
    fontSize: 15,
    color: appColors.textSecondary,
  },
  footerLink: {
    color: appColors.primary,
    fontWeight: '700',
  },
});

export default AuthFooter;
