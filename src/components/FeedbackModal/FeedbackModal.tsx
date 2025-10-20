import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import appColors from '../../assets/colors';
import {
  BugReportCategory,
  BugReportSeverity,
  feedbackService,
} from '../../services/api';
import {useAuth, useUser, useToast} from '../../hooks';
import GradientButton from '../GradientButton/GradientButton';

type FeedbackModalProps = {
  visible: boolean;
  onClose: () => void;
};

const FEEDBACK_TYPES: {
  value: BugReportCategory;
  label: string;
  icon: string;
}[] = [
  {value: 'bug', label: 'Bug', icon: 'bug-outline'},
  {value: 'suggestion', label: 'Suggestion', icon: 'bulb-outline'},
  {value: 'improvement', label: 'Amélioration', icon: 'trending-up-outline'},
  {value: 'other', label: 'Autre', icon: 'chatbubble-ellipses-outline'},
];

const SEVERITY_LEVELS: {
  value: BugReportSeverity;
  label: string;
  color: string;
}[] = [
  {value: 'low', label: 'Faible', color: appColors.success},
  {value: 'medium', label: 'Moyen', color: appColors.warning},
  {value: 'high', label: 'Élevé', color: appColors.error},
  {value: 'critical', label: 'Critique', color: '#8B0000'},
];

const FeedbackModal = ({visible, onClose}: FeedbackModalProps) => {
  const [selectedType, setSelectedType] = useState<BugReportCategory>('bug');
  const [selectedSeverity, setSelectedSeverity] =
    useState<BugReportSeverity>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {getToken} = useAuth();
  const {user} = useUser();
  const {toastError, toastSuccess} = useToast();

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toastError(
        'Champs requis',
        'Veuillez remplir le titre et la description',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();

      // Get device info
      const appVersion = await DeviceInfo.getVersion();
      const systemVersion = await DeviceInfo.getSystemVersion();
      const deviceModel = await DeviceInfo.getModel();

      await feedbackService.submitBugReport(
        {
          title: title.trim(),
          description: description.trim(),
          category: selectedType,
          severity: selectedType === 'bug' ? selectedSeverity : undefined,
          deviceInfo: {
            platform: Platform.OS,
            version: Platform.Version.toString(),
            model: deviceModel,
            osVersion: systemVersion,
          },
          appVersion: appVersion,
          userEmail: user?.email,
        },
        token || undefined,
      );

      toastSuccess('Merci !', 'Votre signalement a été envoyé');

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedType('bug');
      setSelectedSeverity('medium');
      onClose();
    } catch (error) {
      console.error('Error submitting bug report:', error);
      toastError('Erreur', "Impossible d'envoyer le signalement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Signalement</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={appColors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Type de signalement</Text>
            <View style={styles.typeSelector}>
              {FEEDBACK_TYPES.map(type => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    selectedType === type.value && styles.typeButtonActive,
                  ]}
                  onPress={() => setSelectedType(type.value)}>
                  <Icon
                    name={type.icon}
                    size={20}
                    color={
                      selectedType === type.value
                        ? appColors.background
                        : appColors.textPrimary
                    }
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      selectedType === type.value &&
                        styles.typeButtonTextActive,
                    ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedType === 'bug' && (
              <>
                <Text style={styles.label}>Gravité</Text>
                <View style={styles.typeSelector}>
                  {SEVERITY_LEVELS.map(severity => (
                    <TouchableOpacity
                      key={severity.value}
                      style={[
                        styles.severityButton,
                        selectedSeverity === severity.value && {
                          backgroundColor: severity.color,
                          borderColor: severity.color,
                        },
                      ]}
                      onPress={() => setSelectedSeverity(severity.value)}>
                      <Text
                        style={[
                          styles.severityButtonText,
                          selectedSeverity === severity.value &&
                            styles.severityButtonTextActive,
                        ]}>
                        {severity.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Text style={styles.label}>Titre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Problème de connexion"
              placeholderTextColor={appColors.textSecondary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Décrivez votre signalement en détail..."
              placeholderTextColor={appColors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={1000}
            />

            <Text style={styles.charCount}>
              {description.length}/1000 caractères
            </Text>
          </ScrollView>

          <View style={styles.footer}>
            <GradientButton
              text={isSubmitting ? 'Envoi...' : 'Envoyer'}
              icon="send"
              onPress={handleSubmit}
              disabled={isSubmitting}
              paddingVertical={14}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: appColors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: appColors.border + '30',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: appColors.border + '30',
    borderWidth: 1,
    borderColor: appColors.border,
  },
  typeButtonActive: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: appColors.background,
  },
  severityButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: appColors.border + '30',
    borderWidth: 1,
    borderColor: appColors.border,
  },
  severityButtonText: {
    fontSize: 13,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
  severityButtonTextActive: {
    color: appColors.background,
  },
  input: {
    backgroundColor: appColors.border + '20',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: appColors.textPrimary,
    borderWidth: 1,
    borderColor: appColors.border + '40',
  },
  textArea: {
    height: 150,
    paddingTop: 14,
  },
  charCount: {
    fontSize: 12,
    color: appColors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: appColors.border + '30',
  },
});

export default FeedbackModal;
