import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';

type Props = {
  icon?: string;
  title?: string;
  message?: string;
  isLoading?: boolean;
};

const EmptyState = ({
  icon = 'hourglass-outline',
  title = 'Bientôt disponible',
  message = 'Nous travaillons dessus ! Cette fonctionnalité sera bientôt disponible.',
  isLoading = false,
}: Props) => {
  return (
    <View style={styles.container}>
      <Icon
        name={icon}
        size={64}
        color={appColors.textSecondary}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {isLoading && (
        <Text style={styles.loading}>Chargement...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: appColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loading: {
    fontSize: 12,
    color: appColors.primary,
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default EmptyState;
