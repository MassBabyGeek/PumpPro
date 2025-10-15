import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import appColors from '../../assets/colors';

type LoadingViewProps = {
  message?: string;
  height?: number;
};

const LoadingView = ({
  message = 'Chargement des données...',
  height = 220,
}: LoadingViewProps) => {
  return (
    <View style={[styles.container, {height}]}>
      <ActivityIndicator size="large" color={appColors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 14,
    color: appColors.textSecondary,
    marginTop: 8,
  },
});

export default LoadingView;
