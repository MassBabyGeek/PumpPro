/**
 * OfflineBanner Component
 * Shows a banner when device is offline or in forced offline mode
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {useOffline} from '../../hooks/useOffline';

const OfflineBanner: React.FC = () => {
  const {isOffline, forcedOffline, syncStatus, sync} = useOffline();

  if (!isOffline) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon
          name={forcedOffline ? 'airplane' : 'cloud-offline'}
          size={16}
          color={appColors.textPrimary}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {forcedOffline ? 'Mode hors ligne activé' : 'Hors ligne'}
          </Text>
          {syncStatus.pendingActions > 0 && (
            <Text style={styles.subtitle}>
              {syncStatus.pendingActions} action
              {syncStatus.pendingActions > 1 ? 's' : ''} en attente
            </Text>
          )}
        </View>
      </View>

      {syncStatus.pendingActions > 0 && !forcedOffline && (
        <TouchableOpacity style={styles.syncButton} onPress={sync}>
          <Icon name="refresh" size={16} color={appColors.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.warning,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 50, // Pour descendre la bannière sous la status bar
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: appColors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  subtitle: {
    color: appColors.textPrimary,
    fontSize: 11,
    opacity: 0.9,
  },
  syncButton: {
    padding: 8,
  },
});

export default OfflineBanner;
