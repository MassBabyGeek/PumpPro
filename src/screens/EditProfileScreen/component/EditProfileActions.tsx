/**
 * EditProfileActions Component
 *
 * Action buttons section (Save and Cancel) with loading overlay
 */

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AppButton from '../../../components/AppButton/AppButton';
import appColors from '../../../assets/colors';

interface EditProfileActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
  hasChanges: boolean;
}

const EditProfileActions: React.FC<EditProfileActionsProps> = ({
  onSave,
  onCancel,
  isLoading,
  hasChanges,
}) => {
  return (
    <>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <AppButton
            text={isLoading ? 'Enregistrement...' : 'Enregistrer'}
            backgroundColor={appColors.success}
            borderColor={appColors.success}
            onPress={onSave}
            disabled={isLoading || !hasChanges}
            paddingVertical={14}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <AppButton
            text="Annuler"
            backgroundColor={appColors.backgroundLight}
            borderColor={appColors.border}
            onPress={onCancel}
            disabled={isLoading}
            paddingVertical={14}
            outlined
          />
        </View>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={appColors.primary} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 20,
    gap: 12,
  },
  buttonWrapper: {
    marginBottom: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default EditProfileActions;
