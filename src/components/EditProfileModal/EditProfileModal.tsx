import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {useUser, useToast} from '../../hooks';
import GradientButton from '../GradientButton/GradientButton';

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

const EditProfileModal = ({visible, onClose}: EditProfileModalProps) => {
  const {user, updateUser, isLoading} = useUser();
  const {toastSuccess, toastError} = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when modal opens or user changes
  useEffect(() => {
    if (visible && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age?.toString() || '',
        weight: user.weight?.toString() || '',
        height: user.height?.toString() || '',
        goal: user.goal || '',
      });
      setErrors({});
    }
  }, [visible, user]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Au moins 2 caractères';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (
      formData.age &&
      (isNaN(Number(formData.age)) ||
        Number(formData.age) < 13 ||
        Number(formData.age) > 120)
    ) {
      newErrors.age = 'Âge invalide (13-120)';
    }

    if (
      formData.weight &&
      (isNaN(Number(formData.weight)) ||
        Number(formData.weight) < 30 ||
        Number(formData.weight) > 300)
    ) {
      newErrors.weight = 'Poids invalide (30-300)';
    }

    if (
      formData.height &&
      (isNaN(Number(formData.height)) ||
        Number(formData.height) < 100 ||
        Number(formData.height) > 250)
    ) {
      newErrors.height = 'Taille invalide (100-250)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toastSuccess('Erreur', 'Veuillez corriger les erreurs');
      return;
    }

    try {
      const updatedData: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        age: formData.age ? Number(formData.age) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        goal: formData.goal.trim() || undefined,
      };

      await updateUser(updatedData);

      toastSuccess('Succès', 'Profil mis à jour !');

      onClose();
    } catch (error) {
      toastError(
        'Erreur',
        error instanceof Error ? error.message : 'Impossible de mettre à jour',
      );
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
            <Text style={styles.title}>Modifier mon profil</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={appColors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}>
            {/* Personal Info Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations personnelles</Text>

              <Text style={styles.label}>
                Nom <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Votre nom"
                placeholderTextColor={appColors.textSecondary}
                value={formData.name}
                onChangeText={text => updateField('name', text)}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <Text style={styles.label}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="votre@email.com"
                placeholderTextColor={appColors.textSecondary}
                value={formData.email}
                onChangeText={text => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <Text style={styles.label}>Objectif</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Faire 100 pompes d'affilée"
                placeholderTextColor={appColors.textSecondary}
                value={formData.goal}
                onChangeText={text => updateField('goal', text)}
                multiline
                numberOfLines={2}
                maxLength={200}
              />
            </View>

            {/* Physical Info Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations physiques</Text>

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Âge</Text>
                  <TextInput
                    style={[styles.input, errors.age && styles.inputError]}
                    placeholder="25"
                    placeholderTextColor={appColors.textSecondary}
                    value={formData.age}
                    onChangeText={text => updateField('age', text)}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  {errors.age && (
                    <Text style={styles.errorText}>{errors.age}</Text>
                  )}
                </View>

                <View style={styles.halfInput}>
                  <Text style={styles.label}>Poids (kg)</Text>
                  <TextInput
                    style={[styles.input, errors.weight && styles.inputError]}
                    placeholder="70"
                    placeholderTextColor={appColors.textSecondary}
                    value={formData.weight}
                    onChangeText={text => updateField('weight', text)}
                    keyboardType="decimal-pad"
                    maxLength={5}
                  />
                  {errors.weight && (
                    <Text style={styles.errorText}>{errors.weight}</Text>
                  )}
                </View>
              </View>

              <Text style={styles.label}>Taille (cm)</Text>
              <TextInput
                style={[styles.input, errors.height && styles.inputError]}
                placeholder="175"
                placeholderTextColor={appColors.textSecondary}
                value={formData.height}
                onChangeText={text => updateField('height', text)}
                keyboardType="number-pad"
                maxLength={3}
              />
              {errors.height && (
                <Text style={styles.errorText}>{errors.height}</Text>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <GradientButton
              text={isLoading ? 'Enregistrement...' : 'Enregistrer'}
              icon="checkmark-circle"
              onPress={handleSave}
              disabled={isLoading}
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
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  required: {
    color: appColors.error,
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
  inputError: {
    borderColor: appColors.error,
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 12,
    color: appColors.error,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: appColors.border + '30',
  },
});

export default EditProfileModal;
