import {useState} from 'react';
import {Alert, Platform} from 'react-native';
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import {uploadProfileImage} from '../services/api.service';

export const useImagePicker = () => {
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Ouvre la galerie photo et upload l'image sélectionnée
   * @returns L'URL de l'image uploadée ou null
   */
  const pickAndUploadImage = async (): Promise<string | null> => {
    try {
      // Ouvre la galerie photo
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
      });

      // Vérifier si l'utilisateur a annulé
      if (result.didCancel) {
        console.log('📷 Sélection annulée');
        return null;
      }

      // Vérifier les erreurs
      if (result.errorCode) {
        console.error('❌ Erreur image picker:', result.errorMessage);
        Alert.alert('Erreur', result.errorMessage || 'Impossible de sélectionner l\'image');
        return null;
      }

      // Récupérer l'image sélectionnée
      const asset: Asset | undefined = result.assets?.[0];
      if (!asset || !asset.uri) {
        Alert.alert('Erreur', 'Aucune image sélectionnée');
        return null;
      }

      console.log('📷 Image sélectionnée:', asset.uri);

      // Upload de l'image
      setIsUploading(true);

      try {
        const uploadResult = await uploadProfileImage(asset.uri);

        if (uploadResult.success && uploadResult.url) {
          Alert.alert('Succès', 'Photo de profil mise à jour !');
          return uploadResult.url;
        } else {
          Alert.alert('Erreur', uploadResult.error || 'Échec de l\'upload');
          return null;
        }
      } catch (error) {
        console.error('❌ Erreur upload:', error);
        Alert.alert('Erreur', 'Impossible d\'uploader l\'image');
        return null;
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
      setIsUploading(false);
      return null;
    }
  };

  return {
    pickAndUploadImage,
    isUploading,
  };
};
