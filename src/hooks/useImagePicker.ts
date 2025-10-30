import {useState} from 'react';
import {Alert} from 'react-native';
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import {useUser} from './useUser';

export const useImagePicker = () => {
  const [isUploading, setIsUploading] = useState(false);
  const {uploadAvatar} = useUser();

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
        Alert.alert(
          'Erreur',
          result.errorMessage || "Impossible de sélectionner l'image",
        );
        return null;
      }

      // Récupérer l'image sélectionnée
      const asset: Asset | undefined = result.assets?.[0];
      if (!asset || !asset.uri) {
        Alert.alert('Erreur', 'Aucune image sélectionnée');
        return null;
      }

      // Upload de l'image
      setIsUploading(true);
      const updatedUser = await uploadAvatar(asset.uri);
      setIsUploading(false);

      // Retourner l'URL de l'avatar depuis le user mis à jour
      return updatedUser.avatar || null;
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
