import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

type AccountActionsSectionProps = {
  onLogout: () => void;
  onDeleteAccount: () => void;
  onFeedback: () => void;
  onRecalibrate: () => void;
};

const AccountActionsSection = ({
  onLogout,
  onDeleteAccount,
  onFeedback,
  onRecalibrate,
}: AccountActionsSectionProps) => {
  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.actionButton} onPress={onRecalibrate}>
        <Icon name="scan-outline" size={20} color={appColors.primary} />
        <Text style={[styles.actionButtonText, styles.primaryText]}>
          Recalibrer mes pompes
        </Text>
        <Icon
          name="chevron-forward"
          size={20}
          color={appColors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onLogout}>
        <Icon name="log-out-outline" size={20} color={appColors.textPrimary} />
        <Text style={styles.actionButtonText}>Se déconnecter</Text>
        <Icon
          name="chevron-forward"
          size={20}
          color={appColors.textSecondary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.dangerButton]}
        onPress={onDeleteAccount}>
        <Icon name="trash-outline" size={20} color={appColors.error} />
        <Text style={[styles.actionButtonText, styles.dangerText]}>
          Supprimer mon compte
        </Text>
        <Icon name="chevron-forward" size={20} color={appColors.error} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.feedbackButton} onPress={onFeedback}>
        <Icon name="chatbubbles-outline" size={18} color={appColors.primary} />
        <Text style={styles.feedbackButtonText}>
          Signaler un bug ou proposer une amélioration
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 40,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  feedbackButtonText: {
    flex: 1,
    fontSize: 14,
    color: appColors.primary,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: appColors.border + '30',
    borderRadius: 12,
    gap: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: appColors.error + '10',
    borderWidth: 1,
    borderColor: appColors.error + '30',
  },
  dangerText: {
    color: appColors.error,
  },
  primaryText: {
    color: appColors.primary,
  },
});

export default AccountActionsSection;
