import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import appColors from '../../assets/colors';
import { useUser } from '../../hooks/useUser';
import { useToast } from '../../hooks/useToast';
import LinearGradient from 'react-native-linear-gradient';
import {
  EditProfileHeader,
  PersonalInfoForm,
  PhysicalInfoForm,
  EditProfileActions,
} from './component';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser, isLoading } = useUser();
  const { toastError, toastSuccess, toastInfo } = useToast();

  // Stocker les valeurs initiales dans une ref pour éviter la boucle infinie
  const initialValues = useRef({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
  });

  // Flag pour savoir si on a déjà initialisé
  const isInitialized = useRef(false);

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
  });

  // Initialiser les valeurs quand le user se charge
  useEffect(() => {
    if (user && !isInitialized.current) {
      const initial = {
        name: user.name || '',
        email: user.email || '',
        age: user.age?.toString() || '',
        weight: user.weight?.toString() || '',
        height: user.height?.toString() || '',
        goal: user.goal || '',
      };
      initialValues.current = initial;
      setFormData(initial);
      isInitialized.current = true;
    }
  }, [user]);

  // Validation and UI states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Detect changes (comparé aux valeurs INITIALES, pas au user actuel)
  useEffect(() => {
    const changed =
      formData.name !== initialValues.current.name ||
      formData.email !== initialValues.current.email ||
      formData.age !== initialValues.current.age ||
      formData.weight !== initialValues.current.weight ||
      formData.height !== initialValues.current.height ||
      formData.goal !== initialValues.current.goal;

    setHasChanges(changed);
  }, [formData]);

  // Update form field helper
  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Age (optional but must be valid if provided)
    if (formData.age && (isNaN(Number(formData.age)) || Number(formData.age) < 13 || Number(formData.age) > 120)) {
      newErrors.age = 'Âge invalide (13-120 ans)';
    }

    // Weight (optional but must be valid if provided)
    if (formData.weight && (isNaN(Number(formData.weight)) || Number(formData.weight) < 30 || Number(formData.weight) > 300)) {
      newErrors.weight = 'Poids invalide (30-300 kg)';
    }

    // Height (optional but must be valid if provided)
    if (formData.height && (isNaN(Number(formData.height)) || Number(formData.height) < 100 || Number(formData.height) > 250)) {
      newErrors.height = 'Taille invalide (100-250 cm)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save changes
  const handleSave = async () => {
    if (!validateForm()) {
      toastError('Erreur', 'Veuillez corriger les erreurs du formulaire');
      return;
    }

    if (!hasChanges) {
      toastInfo('Info', 'Aucune modification à enregistrer');
      return;
    }

    try {
      // Prepare data to update
      const updatedData: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        age: formData.age ? Number(formData.age) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        goal: formData.goal.trim() || undefined,
      };

      // Call useUser hook to update profile
      await updateUser(updatedData);

      toastSuccess('Succès', 'Profil mis à jour avec succès !');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      toastError('Erreur', error instanceof Error ? error.message : 'Impossible de mettre à jour le profil');
    }
  };

  // Cancel and go back
  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Annuler les modifications',
        'Êtes-vous sûr de vouloir annuler ? Les modifications non enregistrées seront perdues.',
        [
          { text: 'Continuer l\'édition', style: 'cancel' },
          {
            text: 'Annuler',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[appColors.backgroundDark, appColors.background]}
        style={styles.gradient}>
        <EditProfileHeader onBack={handleCancel} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <PersonalInfoForm
            name={formData.name}
            email={formData.email}
            goal={formData.goal}
            onNameChange={(text) => updateField('name', text)}
            onEmailChange={(text) => updateField('email', text)}
            onGoalChange={(text) => updateField('goal', text)}
            errors={errors}
          />

          <PhysicalInfoForm
            age={formData.age}
            weight={formData.weight}
            height={formData.height}
            onAgeChange={(text) => updateField('age', text)}
            onWeightChange={(text) => updateField('weight', text)}
            onHeightChange={(text) => updateField('height', text)}
            errors={errors}
          />

          <EditProfileActions
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isLoading}
            hasChanges={hasChanges}
          />
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.backgroundDark,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});

export default EditProfileScreen;
