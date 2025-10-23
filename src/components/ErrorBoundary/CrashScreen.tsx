import React, {useState, ErrorInfo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {feedbackService} from '../../services/api';
import {useToast} from '../../hooks/useToast';
import DeviceInfo from 'react-native-device-info';

interface CrashScreenProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}

const CrashScreen: React.FC<CrashScreenProps> = ({
  error,
  errorInfo,
  onReset,
}) => {
  const {toastSuccess, toastError} = useToast();
  const [userNote, setUserNote] = useState('');
  const [isSending, setIsSending] = useState(false);

  const getDeviceInfo = () => {
    return {
      brand: DeviceInfo.getBrand(),
      model: DeviceInfo.getModel(),
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      appVersion: DeviceInfo.getVersion(),
      buildNumber: DeviceInfo.getBuildNumber(),
    };
  };

  const handleSendReport = async () => {
    setIsSending(true);

    try {
      const errorStack =
        error?.stack ||
        `${error?.name}: ${error?.message}\n\nComponent Stack: ${errorInfo?.componentStack}`;

      await feedbackService.submitBugReport({
        title: `App Crash: ${error?.name || 'Unknown Error'}`,
        description: `
## Erreur de crash de l'application

**Message d'erreur:**
${error?.message || 'Unknown error'}

**Note de l'utilisateur:**
${userNote || 'Aucune note fournie'}

**Stack trace:**
\`\`\`
${errorStack}
\`\`\`
        `,
        category: 'BUG',
        severity: 'CRITICAL',
        deviceInfo: getDeviceInfo(),
        appVersion: DeviceInfo.getVersion(),
        errorStack: errorStack,
      });

      toastSuccess('Merci !', 'Votre rapport a été envoyé avec succès');

      // Attendre un peu avant de réinitialiser
      setTimeout(() => {
        onReset();
      }, 2000);
    } catch (err) {
      console.error('Error sending crash report:', err);
      toastError(
        'Erreur',
        "Impossible d'envoyer le rapport. Veuillez réessayer.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Icône d'erreur */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="bug-outline" size={64} color={appColors.error} />
          </View>
        </View>

        {/* Titre */}
        <Text style={styles.title}>Oups ! Une erreur est survenue</Text>

        {/* Message */}
        <Text style={styles.message}>
          L'application a rencontré un problème inattendu. Nous sommes désolés
          pour la gêne occasionnée.
        </Text>

        {/* Détails de l'erreur (repliable) */}
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Détails techniques</Text>
          <View style={styles.errorBox}>
            <Text style={styles.errorText} numberOfLines={10}>
              {error?.message || 'Erreur inconnue'}
            </Text>
          </View>
        </View>

        {/* Formulaire de signalement */}
        <View style={styles.reportContainer}>
          <Text style={styles.reportTitle}>Signaler ce problème</Text>
          <Text style={styles.reportSubtitle}>
            Aidez-nous à améliorer l'application en nous décrivant ce que vous
            faisiez quand l'erreur s'est produite :
          </Text>

          <TextInput
            style={styles.textArea}
            placeholder="Décrivez ce qui s'est passé... (optionnel)"
            placeholderTextColor={`${appColors.textSecondary}80`}
            multiline
            numberOfLines={6}
            value={userNote}
            onChangeText={setUserNote}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
            onPress={handleSendReport}
            disabled={isSending}>
            <LinearGradient
              colors={
                isSending
                  ? [appColors.border, appColors.border]
                  : [appColors.primary, appColors.accent]
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientContainer}>
              <View style={styles.sendButtonGradient}>
                <Icon
                  name="send"
                  size={20}
                  color={appColors.textPrimary}
                  style={styles.sendIcon}
                />
                <Text style={styles.sendButtonText}>
                  {isSending ? 'Envoi en cours...' : 'Envoyer le rapport'}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bouton réessayer */}
        <TouchableOpacity style={styles.retryButton} onPress={onReset}>
          <Icon
            name="refresh"
            size={20}
            color={appColors.primary}
            style={styles.retryIcon}
          />
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>

        {/* Info de contact */}
        <Text style={styles.contactInfo}>
          Pour toute question, contactez-nous à {'\n'}
          <Text style={styles.contactEmail}>support@pompeurpro.com</Text>
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${appColors.error}20`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: `${appColors.error}40`,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: appColors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  errorContainer: {
    width: '100%',
    marginBottom: 32,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textSecondary,
    marginBottom: 8,
  },
  errorBox: {
    backgroundColor: `${appColors.error}10`,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: `${appColors.error}30`,
  },
  errorText: {
    fontSize: 12,
    color: appColors.error,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  reportContainer: {
    width: '100%',
    marginBottom: 24,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 8,
  },
  reportSubtitle: {
    fontSize: 14,
    color: appColors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  textArea: {
    backgroundColor: `${appColors.border}30`,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: appColors.textPrimary,
    minHeight: 120,
    borderWidth: 1,
    borderColor: `${appColors.border}50`,
    marginBottom: 16,
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  gradientContainer: {
    flex: 1,
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  sendIcon: {
    marginRight: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: `${appColors.primary}20`,
    borderWidth: 1,
    borderColor: `${appColors.primary}40`,
    marginBottom: 24,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.primary,
  },
  contactInfo: {
    fontSize: 12,
    color: appColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  contactEmail: {
    color: appColors.primary,
    fontWeight: '600',
  },
});

export default CrashScreen;
