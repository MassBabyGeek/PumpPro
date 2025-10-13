import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import appColors from '../../assets/colors';

type FooterVariant = 'app' | 'auth';

type Props = {
  variant?: FooterVariant;
  children?: React.ReactNode;
};

const Footer = ({variant = 'app', children}: Props) => {
  if (children) {
    return <View style={styles.footer}>{children}</View>;
  }

  if (variant === 'app') {
    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>PompeurPro © 2025</Text>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>
          Propulsé par la Vision AI • Made with 💪
        </Text>
      </View>
    );
  }

  // Simple version footer (pour ProfileScreen par exemple)
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Version 1.0.0</Text>
      <Text style={styles.footerText}>PompeurPro © 2025</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 40,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: appColors.textSecondary,
  },
});

export default Footer;
